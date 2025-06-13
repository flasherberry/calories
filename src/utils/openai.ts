import OpenAI from 'openai';
import { NutritionInfo } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeFoodImage(imageBase64: string): Promise<NutritionInfo> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and provide nutritional information. 
              Look for:
              1. Food items visible in the image
              2. Estimated portion sizes
              3. Nutrition labels if visible
              4. Calculate estimated calories
              
              Respond in JSON format:
              {
                "name": "food name",
                "calories": estimated_calories_number,
                "protein": grams_if_identifiable,
                "carbs": grams_if_identifiable,
                "fat": grams_if_identifiable,
                "confidence": confidence_score_0_to_1
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    console.log(content);
    if (!content) throw new Error('No response from OpenAI');

    // Extract JSON from markdown code blocks if present
    let jsonString = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    }

    const nutritionInfo = JSON.parse(jsonString.trim()) as NutritionInfo;
    return nutritionInfo;
  } catch (error) {
    console.error('Error analyzing food image:', error);
    return {
      name: 'Unknown Food',
      calories: 200,
      confidence: 0.1
    };
  }
}

export function calculateDailyCalorieGoal(
  currentWeight: number,
  targetWeight: number,
  goalType: 'lose' | 'gain' | 'maintain',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' = 'moderate'
): number {
  const baseBMR = 1500;
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  };

  const maintenanceCalories = baseBMR * activityMultipliers[activityLevel];

  switch (goalType) {
    case 'lose':
      return Math.round(maintenanceCalories - 500);
    case 'gain':
      return Math.round(maintenanceCalories + 500);
    case 'maintain':
    default:
      return Math.round(maintenanceCalories);
  }
}