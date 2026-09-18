

export type CheckIn = {
    id: number;
    habitId: number;
    date: string;
    completed: boolean;
    reflection: string | null;
};