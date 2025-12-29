const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "send prompt, please" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            text: text
        });
    } catch (error) {
        console.error("Gemini Controller Error:", error);
        res.status(500).json({
            success: false,
            error: "error in Gemini"
        });
    }
};

module.exports = {
    generateResponse
};