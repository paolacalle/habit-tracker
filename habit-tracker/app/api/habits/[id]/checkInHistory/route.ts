import { NextResponse } from "next/server";
import { prisma } from "@/internal-lib/prisma";


function parseLocalDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const habitId = parseInt(id);

    if (isNaN(habitId)) {
        return NextResponse.json(
        { error: "Invalid habit ID" },
        { status: 400 }
        );
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const dateFilter: {
        gte?: Date;
        lte?: Date;
    } = {};

    if (startDate) {
        const start = parseLocalDate(startDate);
        dateFilter.gte = start;
    }

    if (endDate) {
        const end = parseLocalDate(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.lte = end;
    }

    const checkIns = await prisma.checkIn.findMany({
        where: {
        habitId,
        ...(startDate || endDate
            ? {
                date: dateFilter,
            }
            : {}),
        },
        orderBy: {
        date: "desc",
        },
    });

    return NextResponse.json(checkIns);
}