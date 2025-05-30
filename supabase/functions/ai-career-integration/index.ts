
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ikigaiData, industryResearch, userId } = await req.json();

    if (!ikigaiData || !industryResearch || !userId) {
      return new Response(
        JSON.stringify({ error: 'Ikigai data, industry research, and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has a career roadmap
    const { data: existingRoadmap, error: fetchError } = await supabase
      .from('career_roadmaps')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing roadmap:', fetchError);
      throw fetchError;
    }

    // If existing roadmap found and it's recent (less than 7 days old), return it
    if (existingRoadmap) {
      const roadmapAge = Date.now() - new Date(existingRoadmap.created_at).getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      
      if (roadmapAge < sevenDaysInMs) {
        console.log('Returning existing career roadmap');
        return new Response(JSON.stringify({ roadmap: existingRoadmap.roadmap_data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const prompt = `Based on the following Ikigai discovery and industry research results, create a comprehensive AI career integration roadmap:

IKIGAI DATA:
${JSON.stringify(ikigaiData, null, 2)}

INDUSTRY RESEARCH:
${JSON.stringify(industryResearch, null, 2)}

You MUST respond with valid JSON in the exact format below:

{
  "overview": "A comprehensive summary of the career path that aligns with their Ikigai and the AI industry opportunities",
  "shortTermGoals": [
    {
      "title": "Goal title",
      "timeline": "3-6 months",
      "description": "Detailed description",
      "priority": "High|Medium|Low"
    }
  ],
  "longTermGoals": [
    {
      "title": "Goal title", 
      "timeline": "1-3 years",
      "description": "Detailed description",
      "impact": "Expected impact on career"
    }
  ],
  "skillDevelopmentPlan": [
    {
      "skill": "Skill name",
      "currentLevel": "Beginner|Intermediate|Advanced",
      "targetLevel": "Intermediate|Advanced|Expert", 
      "resources": ["Resource 1", "Resource 2"],
      "timeline": "Timeline to achieve"
    }
  ],
  "careerPath": [
    {
      "role": "Role title",
      "timeline": "Timeline to reach this role",
      "requirements": ["Requirement 1", "Requirement 2"],
      "preparationSteps": ["Step 1", "Step 2"]
    }
  ],
  "actionItems": [
    "Immediate actionable step 1",
    "Immediate actionable step 2"
  ]
}

Focus on creating a practical, actionable roadmap that bridges their personal Ikigai with real AI industry opportunities identified in the research.`;

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
            content: 'You are an expert AI career counselor who specializes in creating personalized career roadmaps. You MUST respond with valid JSON only.' 
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
    let generatedContent = data.choices[0].message.content.trim();
    
    // Clean up the response
    if (generatedContent.startsWith('```json')) {
      generatedContent = generatedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    }
    
    if (generatedContent.startsWith('```')) {
      generatedContent = generatedContent.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    let roadmapResults;
    try {
      roadmapResults = JSON.parse(generatedContent);
    } catch (e) {
      console.error('JSON parse error:', e);
      roadmapResults = {
        overview: generatedContent,
        shortTermGoals: [],
        longTermGoals: [],
        skillDevelopmentPlan: [],
        careerPath: [],
        actionItems: []
      };
    }

    // Save roadmap to database
    if (existingRoadmap) {
      const { error: updateError } = await supabase
        .from('career_roadmaps')
        .update({
          roadmap_data: roadmapResults,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating roadmap:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('career_roadmaps')
        .insert({
          user_id: userId,
          roadmap_data: roadmapResults
        });

      if (insertError) {
        console.error('Error inserting roadmap:', insertError);
        throw insertError;
      }
    }

    return new Response(JSON.stringify({ roadmap: roadmapResults }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-career-integration function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
