// "use client";

// import { useEffect, useState } from "react";
// import { HabitWithCheckIn } from "@/app/types/api/habits";

export default function HabitGridMapper(
    habitId: number
) {
    const height = 7; // number of days in a week
    const length = 52; // number of weeks in a year

    const items = Array.from(
        { length: height }, () => Array.from({ length: length }, () => 0)
    );

    console.log(items);

    return "empty";
}