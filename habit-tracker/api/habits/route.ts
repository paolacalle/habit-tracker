import { NextResponse } from "next/server";
import { prisma } from "@/internal-lib/prisma";
import { arch } from "os";

// define the GET method to fetch all habits from DB 
export async function GET() {
    const habits = await prisma.habit.findMany(
        {
            where : {
                archived : false
            }, 
            orderBy : {
                createdAt : "desc"
            }
        }
    );

    return NextResponse.json(habits);
}

// define the POST method to create a new habit in DB