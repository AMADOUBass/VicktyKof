import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse, format, addMinutes, isAfter, isBefore } from "date-fns";

// GET /api/availability?stylistId=...&date=YYYY-MM-DD&duration=90
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stylistId = searchParams.get("stylistId");
  const dateStr = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") ?? "60", 10);

  if (!stylistId || !dateStr) {
    return NextResponse.json({ error: "stylistId and date required" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();

  // Get stylist's availability for this day
  const availability = await prisma.availability.findFirst({
    where: { stylistId, dayOfWeek, isActive: true },
  });

  if (!availability) {
    return NextResponse.json([]);
  }

  // Get existing appointments for that day
  const startOfDay = new Date(dateStr + "T00:00:00");
  const endOfDay = new Date(dateStr + "T23:59:59");

  const existingAppointments = await prisma.appointment.findMany({
    where: {
      stylistId,
      status: { in: ["CONFIRMED", "ACCEPTED"] },
      scheduledAt: { gte: startOfDay, lte: endOfDay },
    },
    select: { scheduledAt: true, durationMins: true },
  });

  // Get blocked slots
  const blockedSlots = await prisma.blockedSlot.findMany({
    where: {
      stylistId,
      date: { equals: new Date(dateStr) },
    },
  });

  // Generate 30-minute slots within working hours
  const [startH, startM] = availability.startTime.split(":").map(Number);
  const [endH, endM] = availability.endTime.split(":").map(Number);

  const workStart = new Date(dateStr);
  workStart.setHours(startH!, startM!, 0, 0);

  const workEnd = new Date(dateStr);
  workEnd.setHours(endH!, endM!, 0, 0);

  const slots: string[] = [];
  const interval = 30; // minutes between slot starts
  let current = workStart;
  const now = new Date();

  while (isBefore(current, workEnd)) {
    const slotEnd = addMinutes(current, duration);

    // Slot must end before working hours end
    if (isAfter(slotEnd, workEnd)) break;

    // Must be in the future
    if (isBefore(current, now)) {
      current = addMinutes(current, interval);
      continue;
    }

    // Check conflicts with existing appointments
    const hasConflict = existingAppointments.some((appt) => {
      const apptStart = appt.scheduledAt;
      const apptEnd = addMinutes(apptStart, appt.durationMins);
      return isBefore(current, apptEnd) && isAfter(slotEnd, apptStart);
    });

    // Check blocked slots
    const isBlocked = blockedSlots.some((block) => {
      const blockStart = parse(block.startTime, "HH:mm", date);
      const blockEnd = parse(block.endTime, "HH:mm", date);
      return isBefore(current, blockEnd) && isAfter(slotEnd, blockStart);
    });

    if (!hasConflict && !isBlocked) {
      slots.push(format(current, "HH:mm"));
    }

    current = addMinutes(current, interval);
  }

  return NextResponse.json(slots);
}
