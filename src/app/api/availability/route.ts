import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse, format, addMinutes, isAfter, isBefore } from "date-fns";

// GET /api/availability?stylistId=...&date=YYYY-MM-DD&duration=90
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stylistId = searchParams.get("stylistId");
  const serviceId = searchParams.get("serviceId");
  const dateStr = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") ?? "60", 10);

  if (!stylistId || !dateStr) {
    return NextResponse.json({ error: "stylistId and date required" }, { status: 400 });
  }

  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const startOfDay = new Date(dateStr + "T00:00:00");
  const endOfDay = new Date(dateStr + "T23:59:59");
  const now = new Date();

  // Determine which stylists to check
  let targetStylistIds: string[] = [];

  if (stylistId === "any") {
    if (!serviceId) {
      return NextResponse.json({ error: "serviceId required when stylistId is 'any'" }, { status: 400 });
    }
    // Fetch all active stylists who can do this service (based on availability today)
    const availableStylists = await prisma.availability.findMany({
      where: { dayOfWeek, isActive: true, stylist: { isActive: true } },
      select: { stylistId: true },
    });
    // Distinct ids
    targetStylistIds = Array.from(new Set(availableStylists.map(a => a.stylistId)));
  } else {
    targetStylistIds = [stylistId];
  }

  if (targetStylistIds.length === 0) return NextResponse.json([]);

  const allSlots = new Set<string>();

  for (const tId of targetStylistIds) {
    const availability = await prisma.availability.findFirst({
      where: { stylistId: tId, dayOfWeek, isActive: true },
    });

    if (!availability) continue;

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        stylistId: tId,
        status: { in: ["CONFIRMED", "ACCEPTED"] },
        scheduledAt: { gte: startOfDay, lte: endOfDay },
      },
      select: { scheduledAt: true, durationMins: true },
    });

    const blockedSlots = await prisma.blockedSlot.findMany({
      where: {
        stylistId: tId,
        date: { equals: new Date(dateStr) },
      },
    });

    const [startH, startM] = availability.startTime.split(":").map(Number);
    const [endH, endM] = availability.endTime.split(":").map(Number);

    const workStart = new Date(dateStr);
    workStart.setHours(startH!, startM!, 0, 0);

    const workEnd = new Date(dateStr);
    workEnd.setHours(endH!, endM!, 0, 0);

    const interval = 30;
    let current = workStart;

    while (isBefore(current, workEnd)) {
      const slotEnd = addMinutes(current, duration);

      if (isAfter(slotEnd, workEnd)) break;

      if (isBefore(current, now)) {
        current = addMinutes(current, interval);
        continue;
      }

      const hasConflict = existingAppointments.some((appt) => {
        const apptStart = appt.scheduledAt;
        const apptEnd = addMinutes(apptStart, appt.durationMins);
        return isBefore(current, apptEnd) && isAfter(slotEnd, apptStart);
      });

      const isBlocked = blockedSlots.some((block) => {
        const blockStart = parse(block.startTime, "HH:mm", date);
        const blockEnd = parse(block.endTime, "HH:mm", date);
        return isBefore(current, blockEnd) && isAfter(slotEnd, blockStart);
      });

      if (!hasConflict && !isBlocked) {
        allSlots.add(format(current, "HH:mm"));
      }

      current = addMinutes(current, interval);
    }
  }

  // Sort slots chronologically
  const sortedSlots = Array.from(allSlots).sort();
  return NextResponse.json(sortedSlots);
}
