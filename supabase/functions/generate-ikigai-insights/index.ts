
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ikigaiData } = await req.json();
    console.log('Received ikigaiData:', ikigaiData);

    if (!openAIApiKey) {
      console.error('OpenAI API key is missing');
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = `
    Analyze the following Ikigai discovery data and provide insights:

    ${ikigaiData}

    Please provide a JSON response with the following structure:
    {
      "summary": "A 2-3 sentence summary of the person's career direction and purpose",
      "sentiment": "Overall sentiment (Positive/Optimistic, Neutral/Balanced, or Concerned/Needs Focus)",
      "keyThemes": ["theme1", "theme2", "theme3"] (3-5 key themes from their responses),
      "recommendations": ["rec1", "rec2", "rec3"] (3-4 actionable recommendations for their AI career journey)
    }

    Focus on AI career opportunities and how their Ikigai aligns with the AI industry.
    `;

    console.log('Making OpenAI API call...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert career counselor and AI industry analyst. Provide insightful, actionable career guidance based on Ikigai principles. Always respond with valid JSON only, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    console.log('OpenAI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response data:', data);
    
    const content = data.choices[0].message.content;
    console.log('OpenAI content:', content);
    
    // Parse the JSON response
    let insights;
    try {
      insights = JSON.parse(content);
      console.log('Successfully parsed insights:', insights);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Content that failed to parse:', content);
      
      // Fallback if JSON parsing fails
      insights = {
        summary: "Your Ikigai responses show a thoughtful approach to career planning with clear interests and goals.",
        sentiment: "Positive/Optimistic",
        keyThemes: ["Career Growth", "Purpose-Driven Work", "AI Interest"],
        recommendations: [
          "Continue exploring AI roles that align with your passions",
          "Build relevant skills through online courses and projects",
          "Network with professionals in your areas of interest"
        ]
      };
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ikigai-insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
