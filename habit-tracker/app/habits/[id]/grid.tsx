// "use client";

// import { useEffect, useState } from "react";
// import { HabitWithCheckIn } from "@/app/types/api/habits";

function firstDayOfYear(year: number): number {
    const firstDayOfYear = new Date(year, 0, 1);

    // 0 -> Sunday, 1 -> Monday, ..., 6 -> Saturday
    return firstDayOfYear.getDay();
}

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