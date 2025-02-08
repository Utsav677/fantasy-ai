import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });


    try {
        // 1️⃣ Go to ESPN Fantasy login page
        await page.goto("https://www.espn.com/fantasy/", { waitUntil: "networkidle2" });

        // 2️⃣ Click the "Sign In" button (ESPN login page might use different class names)
        await page.waitForSelector("a[href*='login']", { timeout: 5000 });
        await page.click("a[href*='login']");

        // 3️⃣ Wait for login fields to appear
        await page.waitForSelector("input[name='username']", { timeout: 10000 });

        // 4️⃣ Enter email & password
        await page.type("input[name='username']", email, { delay: 100 });
        await page.type("input[name='password']", password, { delay: 100 });

        // 5️⃣ Click submit button
        await page.click("button[type='submit']");

        // 6️⃣ Wait for ESPN to load user data (Adjust timing if needed)
        await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 });

        // 7️⃣ Capture cookies to maintain session
        const cookies = await page.cookies();

        // 8️⃣ Navigate to NBA Fantasy Teams
        await page.goto("https://fantasy.espn.com/basketball/team", { waitUntil: "networkidle2" });

        // 9️⃣ Scrape Available Fantasy Teams
        const teams = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".team-name")).map((el) => el.textContent.trim());
        });

        await browser.close();

        // 🔥 Send cookies & teams to frontend
        return NextResponse.json({ success: true, teams, cookies });

    } catch (error) {
        console.error("🔥 ESPN Login Error:", error);
        await browser.close();
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
