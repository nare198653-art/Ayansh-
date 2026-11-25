import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '20mb' }));

// Initialize shared GoogleGenAI client with user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint 1: Generate 5-page outline and rhymes with gemini-3.8-flash
app.post('/api/coloring-book/generate-plan', async (req: Request, res: Response) => {
  try {
    const { theme, childName, ageGroup } = req.body;
    if (!theme || !childName) {
      res.status(400).json({ error: 'Theme and child name are required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(200).json({
        warning: 'No GEMINI_API_KEY set. Using local generator.',
        useFallback: true,
      });
      return;
    }

    const prompt = `Create a 5-page children's coloring book outline for a child named "${childName}" with the theme "${theme}".
Target age level: ${ageGroup || 'kids (ages 5-8)'}.

Requirements:
1. Cover Title: A catchy, joyful title highlighting the child's name and theme (e.g., "${childName}'s Space Dinosaurs Adventure").
2. Cover Subtitle: A sweet subtitle.
3. 5 distinct, sequential coloring pages that tell a fun mini-adventure.
4. For each page:
   - title: Short, playful title (3-5 words)
   - sceneDescription: Clear visual scene description specifying simple shapes, cute characters, and fun activities.
   - rhymeCaption: A delightful 2-line rhyming poem suitable for printing at the bottom of the coloring page.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a professional children\'s book author and illustrator assistant. You create wholesome, delightful, age-appropriate coloring book concepts.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverTitle: { type: Type.STRING },
            coverSubtitle: { type: Type.STRING },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  sceneDescription: { type: Type.STRING },
                  rhymeCaption: { type: Type.STRING },
                },
                required: ['pageNumber', 'title', 'sceneDescription', 'rhymeCaption'],
              },
            },
          },
          required: ['coverTitle', 'coverSubtitle', 'pages'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const plan = JSON.parse(jsonText);
    res.json(plan);
  } catch (error: any) {
    res.status(200).json({
      useFallback: true,
      error: error?.message || 'Plan generation fallback activated',
    });
  }
});

// Cache quota state to avoid hammering the API repeatedly when free tier is active
let isQuotaExceeded = false;
let quotaResetTime = 0;

// Endpoint 2: Generate thick-line art image using gemini-3-pro-image-preview
app.post('/api/coloring-book/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, theme, childName, imageSize = '1K', pageIndex } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(200).json({
        warning: 'No GEMINI_API_KEY set. Using vector art engine.',
        useFallback: true,
      });
      return;
    }

    // Check if quota was recently exceeded (cache for 15 minutes)
    const now = Date.now();
    if (isQuotaExceeded && now < quotaResetTime) {
      res.status(200).json({
        useFallback: true,
        quotaExceeded: true,
        warning: 'Free-tier Gemini image quota reached. Using vector line art engine.',
      });
      return;
    }

    const resolution = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';
    const cleanPrompt = `${prompt} Clean black and white line art coloring page only, bold thick black outlines, pure white background, no grayscale, no shading, no crosshatching, no color, no solid black filled backgrounds, empty spaces inside outlines ready for coloring with crayons. High contrast clean line illustration.`;

    // Try gemini-3-pro-image-preview first, followed by available image models
    const modelsToTry = [
      'gemini-3-pro-image-preview',
      'gemini-3-pro-image',
      'gemini-nano-banana-2.1',
      'gemini-3.1-flash-lite-image',
    ];

    for (const model of modelsToTry) {
      try {
        const config: any = {
          imageConfig: {
            aspectRatio: '3:4',
            ...(model !== 'gemini-3.1-flash-lite-image' ? { imageSize: resolution } : {}),
          },
        };

        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [{ text: cleanPrompt }],
          },
          config,
        });

        // Find image part in candidates
        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            isQuotaExceeded = false;
            res.json({ imageUrl, modelUsed: model, resolution });
            return;
          }
        }
      } catch (err: any) {
        // Detect 429 / RESOURCE_EXHAUSTED
        const errMsg = err?.message || '';
        const is429 = err?.status === 'RESOURCE_EXHAUSTED' || err?.code === 429 || errMsg.includes('quota') || errMsg.includes('429');
        if (is429) {
          isQuotaExceeded = true;
          quotaResetTime = Date.now() + 15 * 60 * 1000;
          // Return immediately to avoid repeated doomed requests for other models
          res.status(200).json({
            useFallback: true,
            quotaExceeded: true,
            warning: 'Gemini image generation requires a billing-enabled key in Settings > Secrets. Using vector art engine.',
          });
          return;
        }
      }
    }

    // Default graceful fallback
    res.status(200).json({
      useFallback: true,
      warning: 'Using built-in vector coloring page.',
    });
  } catch (error: any) {
    res.status(200).json({
      useFallback: true,
      warning: 'Image generation fallback activated.',
    });
  }
});

// Endpoint 3: Multi-turn Chat interface with Gemini
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, taskType = 'general' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.json({
        reply: "Hi there! I'm Barnaby the Coloring Studio Dragon! Once you configure your Gemini API key in Settings > Secrets, I can help you brainstorm unlimited magical coloring themes, write bedtime rhymes, and customize every page of your book! In the meantime, try generating a book with the 'Space Dinosaurs' theme above!",
      });
      return;
    }

    // Role-based model selection as specified in requirements
    let modelName = 'gemini-3.8-flash';
    if (taskType === 'complex') {
      modelName = 'gemini-4-argon';
    } else if (taskType === 'fast') {
      modelName = 'gemini-3.1-flash-lite';
    }

    const systemInstruction = `You are Barnaby the Coloring Studio Dragon, an imaginative and joyful illustrator companion.
Your roles:
1. Brainstorm creative, whimsical coloring book themes and storylines for children (e.g., Space Dinosaurs, Mermaid Detectives, Ninja Bunnies).
2. Write charming 2-line rhyming captions for any coloring book page.
3. Suggest fun, printable activity ideas or bedtime stories based on the child's coloring book.
Keep your replies warm, playful, concise (under 120 words), and formatted with gentle cheerfulness. You love crayons, creativity, and inspiring little artists!`;

    // Reconstruct history for multi-turn chat
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
      },
    });

    // Populate previous turns
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.text });
      }
    }

    const latestMessage = messages[messages.length - 1]?.text || 'Hello Barnaby!';
    const response = await chat.sendMessage({ message: latestMessage });

    res.json({
      reply: response.text || 'Keep coloring and creating wonders!',
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: error?.message || 'Chat error',
      reply: "Oops, Barnaby's crayon broke! Please try sending your message again.",
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ColorCraft Studio server running at http://0.0.0.0:${port}`);
  });
}

startServer();
