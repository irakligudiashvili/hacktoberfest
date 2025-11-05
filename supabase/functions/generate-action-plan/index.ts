import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BiomarkerData {
  wbc?: number;
  rbc?: number;
  hemoglobin?: number;
  hematocrit?: number;
  platelets?: number;
  glucose?: number;
  creatinine?: number;
  egfr?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  alt?: number;
  albumin?: number;
  totalCholesterol?: number;
  ldl?: number;
  hdl?: number;
  triglycerides?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { biomarkerData } = await req.json() as { biomarkerData: BiomarkerData };
    
    if (!biomarkerData) {
      return new Response(
        JSON.stringify({ error: 'No biomarker data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Generating action plan for biomarker data:', biomarkerData);

    // Create a detailed prompt with biomarker context
    const biomarkerContext = Object.entries(biomarkerData)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const prompt = `You are a health advisor. Based on these biomarker results: ${biomarkerContext}

Generate a 7-day personalized action plan. For EACH day, provide:
1. Diet Tips (specific foods to eat or avoid based on the biomarkers)
2. Meal Suggestion (specific meal recommendation)
3. Supplement (specific supplement with dosage if applicable)
4. Exercise (specific exercise type and duration)
5. Lifestyle Tip (one actionable lifestyle change)

Focus on biomarkers that are outside optimal ranges. Provide variety across the week while maintaining therapeutic goals.

Return ONLY valid JSON in this exact format:
{
  "days": [
    {
      "day": 0,
      "dietTip": "string",
      "mealSuggestion": "string",
      "supplement": "string",
      "exercise": "string",
      "lifestyleTip": "string",
      "targetBiomarkers": ["biomarker1", "biomarker2"]
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a medical advisor providing personalized health recommendations. Always respond with valid JSON only." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response:', content);

    // Parse the JSON response
    let actionPlan;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      actionPlan = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(actionPlan),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-action-plan function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
