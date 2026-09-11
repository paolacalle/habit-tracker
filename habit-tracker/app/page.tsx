"use client";

import { useEffect, useState } from "react";

type Habit = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
};

export default function Home() {

  // state to hold the list of habits and the form data
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // fetch all existing habits from the API when the component mounts
  async function fetchHabits() {
    const response = await fetch("/api/habits");
    const data = await response.json();

    // set the habits state with the fetched data
    setHabits(data);
  }

  // function to handle adding a new habit
  // if valid, it sends a POST request to the API and updates the habits list
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
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "Failed to add habit");
    }

    setName("");
    setDescription("");
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
            onChange={(event) => setName(event.target.value)}
            placeholder="Name of new habit..."
            className="flex-1 rounded border px-4 py-2"
          />

          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
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

        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded border p-4"
            >
              <h2 className="text-xl font-bold">{habit.name}</h2>
              <p className="text-gray-600">{habit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

}