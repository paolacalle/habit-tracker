
export type HabitOnly = {
    id: number;
    name: string;
    description: string | null;
    archived: boolean;
};

export type HabitWithCheckIn = HabitOnly & {
    completedToday: boolean;
    reflection: string | null;
};