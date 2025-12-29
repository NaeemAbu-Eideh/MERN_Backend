const OpenAI = require("openai");

const generateResponse = async (req, res) => {
    try {
        const { rule, startDate, endDate, sportType, mode, duration } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            console.error("❌ OPENAI_API_KEY is missing in .env file");
            return res.status(500).json({ success: false, error: "API Key missing" });
        }

        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
            Please write a professional and creative summary for a sports tournament:
            - Game: ${sportType}
            - Rules: ${rule}
            - Period: ${startDate} to ${endDate}
            - Mode: ${mode}
            - Match Duration: ${duration}
            
            Instructions:
            1. Length: 5-10 lines.
            2. Language: Arabic.
            3. Tone: Engaging and professional.
            4. The answer must be in english
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are an assistant writer of English texts for sports summaries." },
                { role: "user", content: prompt }
            ],
            temperature: 0.8,
        });

        const text = completion?.choices?.[0]?.message?.content?.trim();

        if (!text) {
            throw new Error("OpenAI returned an empty response");
        }

        return res.status(200).json({ success: true, text });
    } catch (error) {
        console.error("🔴 Detailed OpenAI Error:", error);
        return res.status(500).json({
            success: false,
            error: error?.message || "Failed to generate description",
        });
    }
};

module.exports = { generateResponse };