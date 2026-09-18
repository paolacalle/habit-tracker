"use client";

import { useEffect, useState } from "react";
import { HabitWithCheckIn } from "@/app/types/api/habits";

export default function Home() {
  const [habits, setHabits] = useState<HabitWithCheckIn[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [reflections, setReflections] = useState<
    Record<number, string>
  >({});

  async function fetchHabits() {
    const response = await fetch("/api/habits");
    const data = await response.json();

    setHabits(data);
  }

  async function addHabit() {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const response = await fetch("/api/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "Failed to add habit");
      return;
    }

    setName("");
    setDescription("");

    await fetchHabits();
  }

  async function completeHabit(
    habitId: number,
    reflection: string | null = null
  ) {
    const response = await fetch("/api/checkIns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        habitId,
        reflection,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Check-in API error:",
        errorText
      );

      alert(errorText || "Failed to complete habit");
      return;
    }

    if (reflection !== null) {
      setReflections((prev) => ({
        ...prev,
        [habitId]: reflection,
      }));
    }

    await fetchHabits();
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <main className="min-h-screen p-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">
          Habit Tracker
        </h1>

        <div className="mb-8 flex gap-2">
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Name of new habit..."
            className="flex-1 rounded border px-4 py-2"
          />

          <input
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Description..."
            className="flex-1 rounded border px-4 py-2"
          />

          <button
            onClick={addHabit}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add Habit
          </button>
        </div>

        <div className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded border p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {habit.name}
                  </p>

                  <p className="text-sm">
                    {habit.description}
                  </p>
                </div>

                {habit.completedToday ? (
                  <span className="font-medium">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() =>
                      completeHabit(habit.id)
                    }
                    className="rounded bg-black px-3 py-2 text-white"
                  >
                    Complete Today
                  </button>
                )}
              </div>

              {habit.completedToday && (
                <div className="mt-4">
                  {!habit.reflection? (
                    <>
                      <textarea
                        defaultValue=""
                        onChange={(event) =>
                          setReflections({
                            ...reflections,
                            [habit.id]:
                              event.target.value,
                          })
                        }
                        placeholder="Write your reflection..."
                        className="w-full rounded border px-4 py-2"
                      />

                      <button
                        onClick={() =>
                          completeHabit(
                            habit.id,
                            reflections[habit.id] ?? null
                          )
                        }
                        className="mt-2 rounded bg-black px-4 py-2 text-white"
                      >
                        Save Reflection
                      </button>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600">
                      Latest Reflection: {habit.reflection}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}