"""
Aiva — Monthly Report Generation Task
Generates and sends monthly business performance reports via email.
"""

from datetime import date, timedelta, datetime, timezone
import logging

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.models.appointment import Appointment
from app.models.business import Business
from app.models.call import Call
from app.models.customer import Customer
from app.models.service import Service
from app.models.user import User
from app.notifications.email import email_client

logger = logging.getLogger(__name__)


async def generate_monthly_report():
    """
    Generate a monthly performance report for each active business
    and email it to the business owner.
    """
    async with AsyncSessionLocal() as db:
        try:
            # Get all businesses
            result = await db.execute(select(Business))
            businesses = result.scalars().all()

            today = date.today()
            # Last month
            first_of_month = today.replace(day=1)
            last_month_end = first_of_month - timedelta(days=1)
            last_month_start = last_month_end.replace(day=1)

            month_name = last_month_start.strftime("%B %Y")

            for business in businesses:
                try:
                    report = await _build_report(db, business.id, last_month_start, last_month_end)
                    await _send_report(db, business, report, month_name)
                except Exception as e:
                    logger.error(
                        f"[Reports] Failed to generate report for business {business.id}: {e}"
                    )

        except Exception as e:
            logger.error(f"[Reports] Monthly report generation failed: {e}")


async def _build_report(
    db: AsyncSession, business_id: int, start_date: date, end_date: date
) -> dict:
    """Build report data for a single business."""

    # Total appointments
    appt_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
        )
    )
    total_appointments = appt_count.scalar() or 0

    # Completed appointments
    completed_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
            Appointment.status == "completed",
        )
    )
    completed = completed_count.scalar() or 0

    # AI-booked appointments
    ai_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
            Appointment.source == "ai",
        )
    )
    ai_booked = ai_count.scalar() or 0

    # No-shows
    noshow_count = await db.execute(
        select(func.count()).where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
            Appointment.status == "no_show",
        )
    )
    no_shows = noshow_count.scalar() or 0

    # Revenue
    revenue_result = await db.execute(
        select(func.sum(Service.price))
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
            Appointment.status == "completed",
        )
    )
    revenue = float(revenue_result.scalar() or 0)

    # New customers this month
    start_dt = datetime.combine(start_date, datetime.min.time()).replace(tzinfo=timezone.utc)
    end_dt = datetime.combine(end_date, datetime.max.time()).replace(tzinfo=timezone.utc)
    new_customers_result = await db.execute(
        select(func.count()).where(
            Customer.business_id == business_id,
            Customer.created_at >= start_dt,
            Customer.created_at <= end_dt,
        )
    )
    new_customers = new_customers_result.scalar() or 0

    # Total calls
    calls_result = await db.execute(
        select(func.count()).where(
            Call.business_id == business_id,
            Call.call_start >= start_dt,
            Call.call_start <= end_dt,
        )
    )
    total_calls = calls_result.scalar() or 0

    # Top services
    top_services_result = await db.execute(
        select(Service.name, func.count(Appointment.id).label("count"))
        .join(Appointment, Appointment.service_id == Service.id)
        .where(
            Appointment.business_id == business_id,
            Appointment.date >= start_date,
            Appointment.date <= end_date,
        )
        .group_by(Service.name)
        .order_by(func.count(Appointment.id).desc())
        .limit(5)
    )
    top_services = [{"name": row[0], "count": row[1]} for row in top_services_result]

    return {
        "total_appointments": total_appointments,
        "completed": completed,
        "ai_booked": ai_booked,
        "no_shows": no_shows,
        "revenue": revenue,
        "new_customers": new_customers,
        "total_calls": total_calls,
        "top_services": top_services,
        "completion_rate": round((completed / total_appointments) * 100, 1) if total_appointments else 0,
        "ai_rate": round((ai_booked / total_appointments) * 100, 1) if total_appointments else 0,
    }


async def _send_report(db: AsyncSession, business: Business, report: dict, month_name: str):
    """Send the report email to the business owner."""
    # Find owner
    owner_result = await db.execute(
        select(User).where(
            User.business_id == business.id,
            User.role == "owner",
            User.is_active == True,
        )
    )
    owner = owner_result.scalar_one_or_none()
    if not owner or not owner.email:
        logger.warning(f"No active owner found for business {business.id} — skipping report")
        return

    subject = f"📊 Monthly Report — {business.business_name} — {month_name}"
    top_services_html = "".join(
        f'<tr><td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0;">{s["name"]}</td>'
        f'<td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">{s["count"]}</td></tr>'
        for s in report["top_services"]
    )

    plain_text = (
        f"Monthly Report for {business.business_name} — {month_name}\n\n"
        f"Appointments: {report['total_appointments']}\n"
        f"Completed: {report['completed']} ({report['completion_rate']}%)\n"
        f"AI Booked: {report['ai_booked']} ({report['ai_rate']}%)\n"
        f"No-Shows: {report['no_shows']}\n"
        f"Revenue: ${report['revenue']:,.2f}\n"
        f"New Customers: {report['new_customers']}\n"
        f"Total Calls: {report['total_calls']}\n"
    )

    html_content = f"""
    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 16px; padding: 32px; color: white; text-align: center; margin-bottom: 24px;">
            <h1 style="margin: 0 0 4px; font-size: 22px;">📊 Monthly Report</h1>
            <p style="margin: 0; opacity: 0.9; font-size: 15px;">{business.business_name} — {month_name}</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
            <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #16a34a;">{report['total_appointments']}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Total Appointments</div>
            </div>
            <div style="background: #f0f9ff; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #2563eb;">${report['revenue']:,.0f}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Revenue</div>
            </div>
            <div style="background: #faf5ff; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #7c3aed;">{report['ai_rate']}%</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">AI Booking Rate</div>
            </div>
            <div style="background: #fefce8; border-radius: 12px; padding: 20px; text-align: center;">
                <div style="font-size: 28px; font-weight: 700; color: #ca8a04;">{report['new_customers']}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">New Customers</div>
            </div>
        </div>
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
            <h3 style="margin: 0 0 12px; font-size: 14px; color: #334155;">Top Services</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <thead><tr>
                    <th style="padding: 8px 12px; text-align: left; color: #64748b; border-bottom: 2px solid #e2e8f0;">Service</th>
                    <th style="padding: 8px 12px; text-align: right; color: #64748b; border-bottom: 2px solid #e2e8f0;">Bookings</th>
                </tr></thead>
                <tbody>{top_services_html}</tbody>
            </table>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 11px; margin-top: 24px;">Powered by Aiva — AI Receptionist</p>
    </div>
    """

    await email_client.send(owner.email, subject, plain_text, html_content)
    logger.info(f"[Reports] Sent monthly report to {owner.email} for business {business.id}")
