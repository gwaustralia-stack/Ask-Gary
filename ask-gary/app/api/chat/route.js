import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const GARY_INSTRUCTIONS = `
You are Ask Gary, a capable general-purpose AI assistant.
Be practical, concise, technically strong, and commercially minded.
Give direct answers first, then useful detail.
Do not pretend to have done things you have not done.
When a question depends on current information, say that live web access would be needed unless a web-search tool is enabled.
Use Australian English by default.
`;

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (!messages.length) {
      return Response.json({ error: "No messages supplied." }, { status: 400 });
    }

    const input = messages
      .slice(-30)
      .filter((m) => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-6-luna",
      instructions: GARY_INSTRUCTIONS,
      input,
      max_output_tokens: 1800
    });

    return Response.json({
      text: response.output_text || "I couldn't generate a response.",
      responseId: response.id,
      model: process.env.OPENAI_MODEL || "gpt-6-luna"
    });
  } catch (error) {
    console.error("Ask Gary API error:", error);
    return Response.json(
      { error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
