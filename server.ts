import { GoogleGenAI, Type } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazily check GEMINI_API_KEY
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// AI Smart Packing Generator API
app.post("/api/ai-pack", async (req, res) => {
  try {
    const { destination, terrain, durationDays, climate, notes } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is missing on server.",
      });
    }

    const prompt = `You are PackPal's expert travel packing assistant.
Generate a comprehensive, expert-curated packing checklist for a trip:
Destination: ${destination || "General Destination"}
Terrain: ${terrain || "General Terrain"}
Duration: ${durationDays || 7} days
Climate: ${climate || "Variable"}
Additional Notes: ${notes || "None"}

Organize items into logical categories (e.g. "Essentials", "Clothing & Gear", "Electronics", "Personal Care & Hygiene").
Provide realistic, essential packing items with suggested quantities if applicable.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "You produce concise, travel-tested packing list suggestions in structured JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            overviewAdvice: { type: Type.STRING },
            categories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  icon: { type: Type.STRING, description: "Material symbol icon name like badge, hiking, cable, medical_services, dry, etc." },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        notes: { type: Type.STRING },
                      },
                      required: ["name"],
                    },
                  },
                },
                required: ["title", "items"],
              },
            },
          },
          required: ["suggestedTitle", "categories"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from AI model.");
    }

    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating packing list:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate AI packing list.",
    });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PackPal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
