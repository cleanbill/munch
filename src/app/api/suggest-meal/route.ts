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

    const { historicalMeals, ingredients, eaterProfile, dayOfWeek } = await req.json();

    const isVeg = eaterProfile?.isVegetarian ? 'They are VEGETARIAN.' : '';
    const ageInfo = eaterProfile?.age ? `They are ${eaterProfile.age} years old.` : '';
    const dislikes = eaterProfile?.dislikes?.length ? `They DISLIKE: ${eaterProfile.dislikes.join(', ')}.` : '';
    const focus = eaterProfile?.focusAreas?.length ? `Focus areas for their nutrition: ${eaterProfile.focusAreas.join(', ')}.` : '';
    const training = eaterProfile?.trainingDays?.includes(dayOfWeek) ? `IMPORTANT: Today (${dayOfWeek}) is a TRAINING DAY for them. Suggest a meal optimized for sports recovery and energy replenishment.` : '';

    const systemPrompt = `You are a specialized sports and cognitive nutritionist AI.
Your job is to suggest exactly one highly nutritious meal for a specific family member based on their profile and the day of the week.

### Eater Profile: ${eaterProfile?.name || 'Unknown'}
${ageInfo}
${isVeg}
${dislikes}
${focus}
${training}

### Critical Rules:
1. THE MONDAY RULE: If it is Monday, Quorn spaghetti is typically for Mick and Claire, and Bacon spaghetti is for Cory and Finn. You should stick to this tradition if it's Monday and matches their name.
2. Review the provided 'Historical Meals' to ensure your new suggestion provides dietary variety (unless it is Monday, then follow rule 1).
3. Review the 'Available Ingredients' and utilize them if possible.
4. You are currently generating a meal specifically for: ${eaterProfile?.name || 'Unknown'} on a ${dayOfWeek}.
5. Output a creative, appetizing meal name, a single representative emoji (as a small image), a list of required ingredients, and a step-by-step recipe.
6. Provide a brief 1-2 sentence explanation of why this meal is optimal for them based on their profile.

Output your response strictly as a JSON object with this structure:
{
  "mealName": "Name of the dish",
  "emoji": "🍲",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "recipe": "1. Step one... 2. Step two...",
  "explanation": "Brief explanation"
}
`;

    const userPrompt = `
Eater: ${eaterProfile?.name || 'Unknown'}
Day of Week: ${dayOfWeek}

Historical Meals:
${JSON.stringify(historicalMeals, null, 2)}

Available Ingredients:
${JSON.stringify(ingredients, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const jsonResponse = JSON.parse(response.text);
    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate meal suggestion." }, { status: 500 });
  }
}
