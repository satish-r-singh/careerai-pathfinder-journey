
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    const { ikigaiData, userId } = await req.json();
    console.log('Received ikigai data:', ikigaiData);
    console.log('User ID:', userId);

    if (!ikigaiData || !userId) {
      return new Response(
        JSON.stringify({ error: 'Ikigai data and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has research results
    const { data: existingResearch, error: fetchError } = await supabase
      .from('industry_research')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing research:', fetchError);
      throw fetchError;
    }

    // If existing research found and it's recent (less than 7 days old), return it
    if (existingResearch) {
      const researchAge = Date.now() - new Date(existingResearch.created_at).getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (researchAge < sevenDaysInMs) {
        console.log('Returning existing research results');
        return new Response(JSON.stringify({ research: existingResearch.research_data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
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

You MUST respond with valid JSON in the exact format below. Do not include any text before or after the JSON:

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
}

Please provide at least 3-5 industries with 2-3 AI roles each.`;

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
            content: 'You are an expert career counselor and industry analyst specializing in AI careers. You MUST respond with valid JSON only. Do not include any explanatory text outside the JSON structure.' 
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
    
    let generatedContent = data.choices[0].message.content.trim();
    
    // Clean up the response to ensure it's valid JSON
    if (generatedContent.startsWith('```json')) {
      generatedContent = generatedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    
    if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    // Try to parse as JSON
    let researchResults;
    try {
      researchResults = JSON.parse(generatedContent);
      console.log('Successfully parsed JSON response');
    } catch (e) {
      console.log('Failed to parse as JSON, creating fallback structure');
      console.error('JSON parse error:', e);
      console.log('Raw content:', generatedContent);
      
      // Create a fallback structure if JSON parsing fails
      researchResults = {
        content: generatedContent,
        type: 'text'
      };
    }

    // Save research results to database
    if (existingResearch) {
      // Update existing research
      const { error: updateError } = await supabase
        .from('industry_research')
        .update({
          research_data: researchResults,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating research:', updateError);
        throw updateError;
      }
    } else {
      // Insert new research
      const { error: insertError } = await supabase
        .from('industry_research')
        .insert({
          user_id: userId,
          research_data: researchResults
        });

      if (insertError) {
        console.error('Error inserting research:', insertError);
        throw insertError;
      }
    }

    console.log('Research results saved to database');

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
