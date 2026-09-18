import HabitGridMapper from "./grid";


export default async function HabitPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    HabitGridMapper(
        parseInt(id)
    );

    return (
        <div>
            <h1>Habit Page for ID: {id}</h1>
        </div>
    );
}
