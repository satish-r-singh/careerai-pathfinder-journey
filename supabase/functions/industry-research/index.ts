
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Industry research function called');
    
    const { ikigaiData } = await req.json();
    console.log('Received ikigai data:', ikigaiData);

    if (!ikigaiData) {
      return new Response(
        JSON.stringify({ error: 'Ikigai data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Based on the following Ikigai discovery results, provide comprehensive industry research and career recommendations:

PASSIONS (What You Love):
${ikigaiData.passion?.join('\n') || 'Not specified'}

MISSION (What the World Needs):
${ikigaiData.mission?.join('\n') || 'Not specified'}

PROFESSION (What You're Good At):
${ikigaiData.profession?.join('\n') || 'Not specified'}

VOCATION (What You Can Be Paid For):
${ikigaiData.vocation?.join('\n') || 'Not specified'}

Please provide:
1. Top 5 industries that align with these insights
2. Specific AI-related roles within each industry
3. Market trends and growth opportunities
4. Required skills and qualifications
5. Salary ranges and career progression paths
6. Companies or organizations to research

Format the response as structured JSON with the following format:
{
  "industries": [
    {
      "name": "Industry Name",
      "alignment_score": 95,
      "description": "Why this industry aligns with your Ikigai",
      "ai_roles": [
        {
          "title": "Role Title",
          "description": "Role description",
          "required_skills": ["skill1", "skill2"],
          "salary_range": "$80k - $120k",
          "growth_outlook": "High"
        }
      ],
      "market_trends": ["trend1", "trend2"],
      "target_companies": ["Company A", "Company B"]
    }
  ],
  "next_steps": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ],
  "skill_gaps": [
    "Skills to develop based on analysis"
  ]
}`;

    console.log('Sending request to OpenAI');

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
            content: 'You are an expert career counselor and industry analyst specializing in AI careers. Provide detailed, actionable insights based on Ikigai principles.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const generatedContent = data.choices[0].message.content;
    
    // Try to parse as JSON, fallback to structured text if needed
    let researchResults;
    try {
      researchResults = JSON.parse(generatedContent);
    } catch (e) {
      console.log('Failed to parse as JSON, using structured text format');
      researchResults = {
        content: generatedContent,
        type: 'text'
      };
    }

    return new Response(JSON.stringify({ research: researchResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in industry-research function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
