import { NextResponse } from "next/server";

const prompts = [
  {
    test: (input: string) => /summarize|summary|synthesis/i.test(input),
    reply:
      "Here is a tight synthesis: capture the key themes, highlight blockers, and define one tactical next step. Tag the summary for resurfacing during weekly review."
  },
  {
    test: (input: string) => /plan|agenda|schedule/i.test(input),
    reply:
      "Drafting an adaptive plan: prioritize your top three outcomes, shape the supporting tasks, and schedule focus blocks. Use reminders to create accountability loops."
  },
  {
    test: (input: string) => /idea|brainstorm/i.test(input),
    reply:
      "Let's ideate: explore adjacent possibilities, capture rapid-fire thoughts as atomic notes, and link them to existing knowledge for future synthesis."
  }
];

export async function POST(request: Request) {
  const { prompt } = await request.json();
  const input: string = typeof prompt === "string" ? prompt : "";
  const fallback =
    "I captured that. Let me know if you want a summary, plan, or brainstorm rooted in your workspace.";
  const match = prompts.find((candidate) => candidate.test(input));
  const reply = match
    ? match.reply
    : `${fallback} Prompt noted: ${input.slice(0, 140)}`;
  return NextResponse.json({ reply });
}
