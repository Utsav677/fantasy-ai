import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
    const { team, cookies } = await req.json();
    if (!team || !cookies) return NextResponse.json({ error: "No team or session data" }, { status: 400 });

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        // 🏀 Set ESPN Cookies (to stay logged in)
        await page.setCookie(...cookies);

        // 🌍 Open Fantasy Team Page
        await page.goto(`https://fantasy.espn.com/basketball/team/${team}`, { waitUntil: "networkidle2" });

        // 🔍 Scrape Players in the Selected Fantasy Team
        const players = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".player-name")).map((el) => el.textContent.trim());
        });

        await browser.close();
        return NextResponse.json({ success: true, players });

    } catch (error) {
        console.error("🔥 Fetch Team Data Error:", error);
        await browser.close();
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
