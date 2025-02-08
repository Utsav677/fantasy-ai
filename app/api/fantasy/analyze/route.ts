import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { teamData } = await req.json();

    const recommendations = [
        { player: "Giannis Antetokounmpo", reason: "Strong matchup this week" },
        { player: "Luka Dončić", reason: "High projected fantasy points" },
    ];

    return NextResponse.json({ recommendations });
}
