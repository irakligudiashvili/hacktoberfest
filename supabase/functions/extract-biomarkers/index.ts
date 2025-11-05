import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing file:', file.name, 'Type:', file.type);

    // Convert file to arrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in chunks to avoid call stack size exceeded error
    let binaryString = '';
    const chunkSize = 5000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      binaryString += String.fromCharCode(...chunk);
    }
    const base64 = btoa(binaryString);
    let text = '';

    // Get AI API key
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('AI service not configured');
    }

    // For text-based formats, extract text directly
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      text = new TextDecoder().decode(bytes);
    } else if (file.type.startsWith('image/')) {
      // For images, use AI vision to extract text
      console.log('Extracting text using AI vision...');
      
      const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extract all text content from this medical lab report. Return only the extracted text with all biomarker names and their numeric values, preserving the exact numbers. No commentary.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${file.type};base64,${base64}`
                  }
                }
              ]
            }
          ],
        }),
      });

      if (!extractResponse.ok) {
        const errorText = await extractResponse.text();
        console.error('AI extraction error:', extractResponse.status, errorText);
        throw new Error('Failed to extract text from image. Please ensure the image is clear and readable.');
      }

      const extractData = await extractResponse.json();
      text = extractData.choices[0].message.content;
    } else {
      throw new Error('Unsupported file format. Please upload an image (JPG/PNG), PDF, or text file.');
    }

    console.log('Extracted text length:', text.length);
    console.log('Analyzing biomarkers with AI...');

    // Use AI to extract biomarker values
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a medical data extraction assistant. Extract biomarker values from lab reports.
            
Return a JSON object with these exact field names (use null if not found):
{
  "wbc": number or null,
  "rbc": number or null,
  "hemoglobin": number or null,
  "hematocrit": number or null,
  "platelets": number or null,
  "glucose": number or null,
  "creatinine": number or null,
  "egfr": number or null,
  "sodium": number or null,
  "potassium": number or null,
  "calcium": number or null,
  "alt": number or null,
  "albumin": number or null,
  "totalCholesterol": number or null,
  "ldl": number or null,
  "hdl": number or null,
  "triglycerides": number or null
}

Only extract numeric values. Convert all units to standard values.
Return ONLY the JSON object, no other text.`
          },
          {
            role: 'user',
            content: `Extract biomarker values from this lab report:\n\n${text}`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI processing failed');
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    console.log('AI response:', aiContent);

    // Parse the JSON response
    let biomarkerData;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        biomarkerData = JSON.parse(jsonMatch[0]);
      } else {
        biomarkerData = JSON.parse(aiContent);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', aiContent);
      throw new Error('Failed to parse AI response');
    }

    // Remove null values
    const cleanedData = Object.fromEntries(
      Object.entries(biomarkerData).filter(([_, value]) => value !== null)
    );

    console.log('Extracted biomarkers:', cleanedData);

    return new Response(
      JSON.stringify({ success: true, data: cleanedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-biomarkers function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process document' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
