import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { scene } = await req.json();

    if (!scene || typeof scene !== "string") {
      return Response.json({ error: "Missing scene" }, { status: 400 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const basePrompt = `A fictional blonde muse, elegant and curvy, wearing a luxurious evening gown, fully clothed, tasteful and romantic. Cinematic lighting, high-fashion editorial style, confident and alluring presence. Dark luxury aesthetic. This is an original fictional character, not a real person.`;

    const fullPrompt = `${basePrompt}\nScene and mood: ${scene}`;

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
      quality: "high"
    });

    const b64 = result.data?.[0]?.b64_json;

    if (!b64) {
      return Response.json({ error: "No image returned" }, { status: 502 });
    }

    return Response.json({ b64 });
  } catch (err) {
    return Response.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
