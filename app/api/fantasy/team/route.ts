import { NextResponse } from "next/server";

export async function GET() {
    const teamData = {
        players: [
            { name: "LeBron James", position: "SF" },
            { name: "Stephen Curry", position: "PG" },
            { name: "Nikola Jokić", position: "C" },
        ],
    };

    return NextResponse.json(teamData);
}
