"""
Aiva — AI Agent Service
Implements the tool functions called by voice AI during calls.
"""

from datetime import date as dt_date, datetime, time as dt_time, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.business import Business
from app.models.customer import Customer
from app.models.service import Service
from app.models.staff import Staff
from app.services.analytics_service import analytics_service
import logging
from app.services.agent_router import should_route_to_echo
from app.services.echo_agent import EchoAgentService

logger = logging.getLogger(__name__)


class AIAgentService:
    """Handles tool calls from the AI voice agent."""

    def __init__(self, db: AsyncSession, business_id: int):
        self.db = db
        self.business_id = business_id

    async def _find_service(self, service_name: str):
        """Find service by name, using advanced prioritized matching."""
        from sqlalchemy import select
        from typing import Optional
        
        all_svcs_result = await self.db.execute(
            select(Service).where(
                Service.business_id == self.business_id,
                Service.is_active == True,
            )
        )
        services = all_svcs_result.scalars().all()
        
        def normalize(text):
            return "".join(c for c in text.lower() if c.isalnum())
            
        search_lower = service_name.lower()
        search_norm = normalize(service_name)
        
        # 1. Exact raw match
        for s in services:
            if s.name.lower() == search_lower:
                return s
                
        # 2. Exact normalized match
        for s in services:
            if normalize(s.name) == search_norm:
                return s
                
        # 3. Substring match: search query is inside database name
        for s in services:
            if search_lower in s.name.lower():
                return s
                
        # 4. Substring match: database name is inside search query
        for s in services:
            if s.name.lower() in search_lower:
                return s
                
        # 5. Normalized substring match: search query normalized is inside database name normalized
        for s in services:
            if search_norm in normalize(s.name):
                return s
                
        # 6. Normalized substring match: database name normalized is inside search query normalized
        for s in services:
            if normalize(s.name) in search_norm:
                return s
                
        # 7. Word-overlap / token-matching (highest score first)
        import re
        def get_tokens(text):
            fillers = {"for", "with", "and", "wash", "men", "women", "styling", "studio", "service"}
            words = re.findall(r'\w+', text.lower())
            return {w for w in words if w not in fillers}
        
        search_tokens = get_tokens(service_name)
        if search_tokens:
            best_match = None
            best_score = 0
            for s in services:
                s_tokens = get_tokens(s.name)
                overlap = search_tokens.intersection(s_tokens)
                score = len(overlap) / len(search_tokens) if search_tokens else 0
                if score > best_score and score >= 0.5:
                    best_score = score
                    best_match = s
            if best_match:
                return best_match
                
        return None

    async def check_availability(
        self,
        service_name: str,
        date_str: str = None,
        time_preference: str = None,
        date: str = None,
    ) -> dict:
        """Check available slots for a service on a date."""
        date_str = date_str or date
        if not date_str:
            return {"success": False, "message": "Please specify a date."}

        # Find matching service
        service = await self._find_service(service_name)
        if not service:
            return {"success": False, "message": f"Sorry, we don't offer '{service_name}'. Let me check what services we have available."}

        target_date = dt_date.fromisoformat(date_str)

        # Get business hours
        biz_result = await self.db.execute(
            select(Business).where(Business.id == self.business_id)
        )
        business = biz_result.scalar_one_or_none()
        day_name = target_date.strftime("%A").lower()
        day_hours = (business.opening_hours or {}).get(day_name, {})

        if day_hours.get("closed", True):
            return {"success": False, "message": f"Sorry, we're closed on {target_date.strftime('%A')}s."}

        open_time = dt_time.fromisoformat(day_hours.get("open", "09:00"))
        close_time = dt_time.fromisoformat(day_hours.get("close", "17:00"))

        # Get existing appointments
        existing = await self.db.execute(
            select(Appointment).where(
                Appointment.business_id == self.business_id,
                Appointment.date == target_date,
                Appointment.status.in_(["scheduled", "confirmed"]),
            )
        )
        existing_apts = existing.scalars().all()

        # Generate available slots
        slots = []
        current = open_time
        duration = timedelta(minutes=service.duration_minutes)

        while True:
            end = (datetime.combine(target_date, current) + duration).time()
            if end > close_time:
                break

            conflict = any(
                current < apt.end_time and end > apt.start_time
                for apt in existing_apts
            )

            if not conflict:
                # Filter by time preference
                hour = current.hour
                if time_preference == "morning" and hour >= 12:
                    pass
                elif time_preference == "afternoon" and (hour < 12 or hour >= 17):
                    pass
                elif time_preference == "evening" and hour < 17:
                    pass
                else:
                    slots.append(current.strftime("%I:%M %p"))

            current = (
                datetime.combine(target_date, current) + timedelta(minutes=30)
            ).time()

        if not slots:
            return {
                "success": False,
                "message": f"Sorry, there are no available slots for {service.name} on {target_date.strftime('%B %d')}. Would you like to try a different date?",
            }

        return {
            "success": True,
            "service": service.name,
            "date": target_date.strftime("%B %d, %Y"),
            "available_slots": slots[:6],  # Return max 6 options
            "message": f"I have these available times for {service.name} on {target_date.strftime('%B %d')}: {', '.join(slots[:6])}. Which works best for you?",
        }

    async def book_appointment(
        self,
        customer_name: str,
        customer_phone: str,
        service_name: str,
        date_str: str = None,
        time_str: str = None,
        date: str = None,
        time: str = None,
    ) -> dict:
        """Book an appointment."""
        date_str = date_str or date
        time_str = time_str or time
        if not date_str or not time_str:
            return {"success": False, "message": "Please specify both a date and a time."}

        # Find or create customer
        cust_result = await self.db.execute(
            select(Customer).where(
                Customer.business_id == self.business_id,
                Customer.phone == customer_phone,
            )
        )
        customer = cust_result.scalar_one_or_none()

        if not customer:
            customer = Customer(
                business_id=self.business_id,
                name=customer_name,
                phone=customer_phone,
            )
            self.db.add(customer)
            await self.db.flush()

        # Find service
        service = await self._find_service(service_name)
        if not service:
            return {"success": False, "message": f"Sorry, I couldn't find the service '{service_name}'."}

        target_date = dt_date.fromisoformat(date_str)
        # Parse time (handle both HH:MM and HH:MM AM/PM)
        try:
            start_time = datetime.strptime(time_str, "%H:%M").time()
        except ValueError:
            try:
                start_time = datetime.strptime(time_str, "%I:%M %p").time()
            except ValueError:
                return {"success": False, "message": "I couldn't understand that time. Could you give it to me in a format like 2:00 PM?"}

        end_time = (
            datetime.combine(target_date, start_time)
            + timedelta(minutes=service.duration_minutes)
        ).time()

        # Check for overlapping appointments
        overlap_result = await self.db.execute(
            select(Appointment).where(
                Appointment.business_id == self.business_id,
                Appointment.date == target_date,
                Appointment.start_time < end_time,
                Appointment.end_time > start_time,
                Appointment.status.in_(["scheduled", "confirmed"])
            )
        )
        overlapping_appointments = overlap_result.scalars().all()
        
        # Get total active staff members
        staff_result = await self.db.execute(
            select(func.count()).select_from(Staff).where(
                Staff.business_id == self.business_id,
                Staff.is_active == True
            )
        )
        total_staff = staff_result.scalar() or 1
        
        # Clash detection: If the number of overlapping appointments equals or exceeds available staff, reject.
        if len(overlapping_appointments) >= total_staff:
            return {
                "success": False, 
                "message": f"I'm sorry, but that time slot is already fully booked. Could you please try a different time?"
            }

        # Create appointment
        appointment = Appointment(
            business_id=self.business_id,
            customer_id=customer.id,
            service_id=service.id,
            date=target_date,
            start_time=start_time,
            end_time=end_time,
            status="scheduled",
            source="ai",
        )
        self.db.add(appointment)
        await self.db.flush()

        await analytics_service.invalidate_overview_cache(self.business_id)

        return {
            "success": True,
            "appointment_id": appointment.id,
            "message": f"I've booked your {service.name} appointment for {target_date.strftime('%B %d, %Y')} at {start_time.strftime('%I:%M %p')}. You'll receive a confirmation shortly. Is there anything else I can help with?",
        }

    async def reschedule_appointment(
        self,
        customer_phone: str,
        new_date_str: str = None,
        new_time_str: str = None,
        new_date: str = None,
        new_time: str = None,
    ) -> dict:
        """Reschedule the customer's next upcoming appointment."""
        new_date_str = new_date_str or new_date
        new_time_str = new_time_str or new_time
        if not new_date_str or not new_time_str:
            return {"success": False, "message": "Please specify both a new date and a new time."}

        cust_result = await self.db.execute(
            select(Customer).where(
                Customer.business_id == self.business_id,
                Customer.phone == customer_phone,
            )
        )
        customer = cust_result.scalar_one_or_none()
        if not customer:
            return {"success": False, "message": "I couldn't find an account with that phone number. Could you verify your phone number?"}

        # Find next upcoming appointment
        apt_result = await self.db.execute(
            select(Appointment)
            .where(
                Appointment.customer_id == customer.id,
                Appointment.business_id == self.business_id,
                Appointment.status.in_(["scheduled", "confirmed"]),
                Appointment.date >= dt_date.today(),
            )
            .order_by(Appointment.date, Appointment.start_time)
            .limit(1)
        )
        appointment = apt_result.scalar_one_or_none()
        if not appointment:
            return {"success": False, "message": "I don't see any upcoming appointments for you."}

        new_date_parsed = dt_date.fromisoformat(new_date_str)
        try:
            new_time = datetime.strptime(new_time_str, "%H:%M").time()
        except ValueError:
            new_time = datetime.strptime(new_time_str, "%I:%M %p").time()

        duration = datetime.combine(dt_date.today(), appointment.end_time) - datetime.combine(dt_date.today(), appointment.start_time)

        appointment.date = new_date_parsed
        appointment.start_time = new_time
        appointment.end_time = (datetime.combine(new_date_parsed, new_time) + duration).time()

        await self.db.flush()

        await analytics_service.invalidate_overview_cache(self.business_id)

        return {
            "success": True,
            "message": f"Your appointment has been rescheduled to {new_date.strftime('%B %d, %Y')} at {new_time.strftime('%I:%M %p')}. You'll receive an updated confirmation.",
        }

    async def cancel_appointment(
        self, customer_phone: str, reason: str = None
    ) -> dict:
        """Cancel the customer's next upcoming appointment."""
        cust_result = await self.db.execute(
            select(Customer).where(
                Customer.business_id == self.business_id,
                Customer.phone == customer_phone,
            )
        )
        customer = cust_result.scalar_one_or_none()
        if not customer:
            return {"success": False, "message": "I couldn't find an account with that phone number."}

        apt_result = await self.db.execute(
            select(Appointment)
            .where(
                Appointment.customer_id == customer.id,
                Appointment.business_id == self.business_id,
                Appointment.status.in_(["scheduled", "confirmed"]),
                Appointment.date >= dt_date.today(),
            )
            .order_by(Appointment.date, Appointment.start_time)
            .limit(1)
        )
        appointment = apt_result.scalar_one_or_none()
        if not appointment:
            return {"success": False, "message": "I don't see any upcoming appointments to cancel."}

        appointment.status = "cancelled"
        appointment.notes = f"Cancelled by AI. Reason: {reason}" if reason else "Cancelled by AI"
        await self.db.flush()

        await analytics_service.invalidate_overview_cache(self.business_id)

        return {
            "success": True,
            "message": "Your appointment has been cancelled. Would you like to book a new appointment?",
        }

    async def answer_faq(self, question: str) -> dict:
        """Search the business FAQ knowledge base, or route to Echo Farm Agent."""
        
        # 1. Agent-to-Agent Routing
        if should_route_to_echo(question):
            logger.info("Aiva routed request to Echo")
            echo_service = EchoAgentService()
            response = await echo_service.ask(question)
            
            if response:
                logger.info("Echo response received")
                return {
                    "success": True,
                    "message": response
                }
            else:
                logger.info("Echo unavailable, falling back to Aiva")

        # 2. Normal Aiva Processing
        biz_result = await self.db.execute(
            select(Business).where(Business.id == self.business_id)
        )
        business = biz_result.scalar_one_or_none()

        faqs = business.faq_knowledge_base or []
        question_lower = question.lower()

        # Simple keyword matching
        best_match = None
        best_score = 0
        for faq in faqs:
            faq_q = faq.get("question", "").lower()
            # Count matching words
            score = sum(1 for word in question_lower.split() if word in faq_q)
            if score > best_score:
                best_score = score
                best_match = faq

        if best_match and best_score > 0:
            return {
                "success": True,
                "message": best_match["answer"],
            }

        return {
            "success": False,
            "message": "I'm not sure about that. Would you like me to transfer you to someone who can help?",
        }

    async def transfer_to_human(self, reason: str) -> dict:
        """Signal that the call should be transferred to a human."""
        return {
            "success": True,
            "action": "transfer",
            "reason": reason,
            "message": "Let me transfer you to a team member. Please hold for a moment.",
        }
