import re

with open("backend/app/services/ai_agent_service.py", "r") as f:
    content = f.read()

# Find the insertion point: right before creating the Appointment object
target = """        # Create appointment
        appointment = Appointment("""

replacement = """        # Check for overlapping appointments
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
        
        # Simple clash detection: If there's an overlapping appointment, reject it.
        # (In a fully robust system we'd check against total available staff count)
        if overlapping_appointments:
            return {
                "success": False, 
                "message": f"I'm sorry, but that time slot is already fully booked. Could you please try a different time?"
            }

        # Create appointment
        appointment = Appointment("""

new_content = content.replace(target, replacement)

with open("backend/app/services/ai_agent_service.py", "w") as f:
    f.write(new_content)

print("Patched successfully" if new_content != content else "Failed to patch")
