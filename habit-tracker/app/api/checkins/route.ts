import { NextResponse } from "next/server";
import { prisma } from "@/internal-lib/prisma";

// define the GET method to fetch all check-ins from DB
export async function GET() {
    const checkIns = await prisma.checkIn.findMany(
        {
            orderBy : {
                date : "desc"
            }
        }
    );
    
    return NextResponse.json(checkIns, { status: 200 });
}

function getCurrentDate() {
    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
}

// define the POST method to create a new check-in in DB
export async function POST(request: Request) {
    // parse the request body to get the check-in data 
    const body = await request.json();

    // clean data 
    const habitId = body.habitId;
    const note = body.note?.trim();

    if (!habitId) {
        return NextResponse.json(
            { error: "Habit ID is required" }, 
            { status: 400 }
        );
    }

    const today = getCurrentDate();

    // create a new check-in in the database using Prisma
    // we upsert to ensure that if a check-in already exists 
    // then we update it instead of creating a new one
    const checkIn = await prisma.checkIn.upsert({
        where: {
            habitId_date: {
                habitId: habitId,
                date: today
            }
        },
        update: {
            completed: true
        },
        create: {
            habitId: habitId,
            date: today,
            reflection: note,
            completed: true,
        }
    });

    return NextResponse.json(checkIn, { status: 201 });
}