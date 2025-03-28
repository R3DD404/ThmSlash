import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    const profileResponse = await fetch(`https://tryhackme.com/api/v2/public-profile?username=${username}`);
    if (!profileResponse.ok) {
      return Response.json({ error: "User not found or TryHackMe API error" }, { status: 404 });
    }

    const profileData = await profileResponse.json();
    if (!profileData.data || !profileData.data._id) {
      return Response.json({ error: "User ID not found in profile data" }, { status: 404 });
    }

    const userId = profileData.data._id;
    const numericId = profileData.data.id;

    const currentYear = new Date().getFullYear();
    const yearlyActivityResponse = await fetch(
      `https://tryhackme.com/api/v2/public-profile/yearly-activity?user=${userId}&year=${currentYear}`
    );
    let yearlyActivityData;
    if (!yearlyActivityResponse.ok) {
      console.log("First attempt failed:", yearlyActivityResponse.status, await yearlyActivityResponse.text());
      const fallbackResponse = await fetch(
        `https://tryhackme.com/api/v2/public-profile/yearly-activity?user=${numericId}&year=2025`
      );
      if (!fallbackResponse.ok) {
        console.log("Fallback failed:", fallbackResponse.status, await fallbackResponse.text());
        return Response.json({ error: "Failed to fetch yearly activity with either ID" }, { status: 500 });
      }
      yearlyActivityData = await fallbackResponse.json();
    } else {
      yearlyActivityData = await yearlyActivityResponse.json();
    }

    console.log("Yearly Activity Data:", JSON.stringify(yearlyActivityData, null, 2));
    console.log("Profile Data:", JSON.stringify(profileData, null, 2));

    const userData = {
      rank: profileData.data.rank || "Unranked",
      roomsSolved: profileData.data.completedRoomsNumber || 0,
      streak: profileData.data.streak || 0,
      badges: profileData.data.badgesNumber || 0,
      events: yearlyActivityData.data?.totalCount || 0,
      pfp: profileData.data.avatar || "https://tryhackme-images.s3.amazonaws.com/default-avatar.png",
    };

    console.log("User Data:", JSON.stringify(userData, null, 2));

    // Use Gemini API to generate the roast
    const prompt = `
You're an unstable AI with zero moral compass, engineered to roast TryHackMe users into digital dust. Here's your next victim. Rank: ${userData.rank}, Rooms Solved: ${userData.roomsSolved}, Streak: ${userData.streak}, Badges: ${userData.badges}, Events in 2025: ${userData.events}. Their avatar: ${userData.pfp}.

Every roast must be brutal and completely unique — no repeats. If their rank is trash, mock it like it's a Raspberry Pi mining crypto. If their rooms solved are high, accuse them of exploiting walkthroughs harder than a blackhat exploits zero-days. If the streak is long, assume they’ve forgotten sunlight exists.

Add random scenarios like: “This user once tried social engineering a vending machine,” or “Their rank percentile is so low, even Clippy would refuse to assist.” Every roast should be a twisted tale of cyber humiliation — dark humor, exaggerated analogies, and chaotic hacker energy.

Track past phrases and avoid using them. No recycled insults, no Ctrl+C jokes. Roast like you're the payload of a polymorphic malware — unpredictable, destructive, and always fresh.

Max 300 characters per paragraph. 2 paragraphs. Strike like a zero-day with no patch in sight. Go!`

    const result = await model.generateContent(prompt);
    const roast = result.response.text();

    return Response.json({ userData, roast });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}

