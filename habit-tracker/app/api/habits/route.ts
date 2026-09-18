import { NextResponse } from "next/server";
import { prisma } from "@/internal-lib/prisma";

// define the GET method to fetch all habits from DB 
export async function GET() {
    const now = new Date();

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const habits = await prisma.habit.findMany(
        {
            where : {
                archived : false
            }, 
            include : {
                checkIns : {
                    where : {
                        date : today
                    }
                }
            },
            orderBy : {
                createdAt : "desc"
            }
        }
    );

    const result = habits.map((habit) => ({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        completedToday: 
            habit.checkIns.length > 0 && 
            habit.checkIns[0].completed,
        reflection:
            habit.checkIns.length > 0
                ? habit.checkIns[0].reflection
                : null,
    }));

    return NextResponse.json(result, { status: 200 });
}

// define the POST method to create a new habit in DB
export async function POST(request: Request) {

    // parse the request body to get the habit data 
    const body = await request.json();

    // clean data 
    const name = body.name.trim();
    const description = body.description?.trim();

    if (!name) {
        return NextResponse.json(
            { error: "Name is required" }, 
            { status: 400 }
        );
    }

    // create a new habit in the database using Prisma
    const habit = await prisma.habit.create({
        data: {
            name: name,
            description: description,
            archived: false
        }
    });

    return NextResponse.json(habit, { status: 201 });
}