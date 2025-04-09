import axios from "axios";

const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY";

const getGeminiApi = async (userMsg) => {
  try {
    const res = await axios.post(BASE_URL, {
      contents: [
        {
          parts: [{ text: userMsg }],
        },
      ],
    });

    const reply =
      res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return reply;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error getting response from Gemini.";
  }
};

export default {
  getGeminiApi,
};
