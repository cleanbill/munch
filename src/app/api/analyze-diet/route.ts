import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Missing or invalid API Key." }, { status: 401 });
    }
    const apiKey = authHeader.split(' ')[1];
    const ai = new GoogleGenAI({ apiKey });

    const { eaterProfile, meals } = await req.json();

    const isVeg = eaterProfile?.isVegetarian ? 'They are VEGETARIAN.' : '';
    const ageInfo = eaterProfile?.age ? `They are ${eaterProfile.age} years old.` : '';
    const dislikes = eaterProfile?.dislikes?.length ? `They DISLIKE: ${eaterProfile.dislikes.join(', ')}.` : '';
    const focus = eaterProfile?.focusAreas?.length ? `Focus areas for their nutrition: ${eaterProfile.focusAreas.join(', ')}.` : '';
    const training = eaterProfile?.trainingDays?.length ? `They train on: ${eaterProfile.trainingDays.join(', ')}.` : '';

    const systemPrompt = `You are an expert sports and cognitive nutritionist AI.
Your job is to analyze a week's worth of dinner plans for a specific individual and provide a critical but encouraging nutritional audit.

### Eater Profile: ${eaterProfile?.name || 'Unknown'}
${ageInfo}
${isVeg}
${dislikes}
${focus}
${training}

Analyze the provided planned meals based on their specific profile, ensuring they are meeting their nutritional needs (especially on training days, or addressing their specific focus areas).

Output your analysis strictly in Markdown format. Use emojis, bullet points, and headers to make it readable and engaging.
Keep the analysis concise (under 200 words). If they are missing key nutrients or variety, politely warn them.

Here are the meals planned for ${eaterProfile?.name || 'Unknown'} this week:`;

    const userPrompt = `
Eater: ${eaterProfile?.name || 'Unknown'}
Meals:
${meals.map((m: any) => `- ${m.date}: ${m.meal}`).join('\n')}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ]
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    return NextResponse.json({ analysis: response.text });

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate dietary analysis." }, { status: 500 });
  }
}
