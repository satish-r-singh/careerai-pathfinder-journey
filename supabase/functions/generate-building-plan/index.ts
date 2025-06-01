
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
    const { project, learningPlan } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const prompt = `Create a personalized "Building in Public" strategy for the following AI project:

Project Details:
- Name: ${project.name}
- Description: ${project.description}
- Difficulty: ${project.difficulty}
- Duration: ${project.duration}
- Required Skills: ${project.skills.join(', ')}

Learning Plan Context:
${learningPlan ? `
- Duration: ${learningPlan.overview?.estimatedDuration || 'Not specified'}
- Weekly Commitment: ${learningPlan.overview?.weeklyCommitment || 'Not specified'}
- Number of Phases: ${learningPlan.phases?.length || 0}
- Focus Areas: ${learningPlan.phases?.map(p => p.title).join(', ') || 'Not specified'}
` : 'No learning plan provided'}

Create a comprehensive building in public strategy that includes:

1. **Platform Recommendations**: Best platforms for this type of project and target audience
2. **Content Strategy**: Specific types of content to share throughout the learning journey
3. **Posting Schedule**: Realistic posting frequency and timing recommendations
4. **Milestone Ideas**: Creative ways to celebrate and share major milestones
5. **Networking Tips**: Specific strategies for connecting with others in this field
6. **Content Templates**: Example formats for different types of updates

Make the strategy specific to the project type, considering the technical complexity and target audience. Focus on authentic sharing that builds both personal brand and genuine connections.

Respond with a JSON object in this exact format:
{
  "platforms": ["platform1", "platform2", "platform3"],
  "contentStrategy": [
    "content type 1 description",
    "content type 2 description",
    "content type 3 description"
  ],
  "postingSchedule": "Detailed schedule description with frequency and timing",
  "milestoneIdeas": [
    "milestone celebration idea 1",
    "milestone celebration idea 2",
    "milestone celebration idea 3"
  ],
  "networkingTips": [
    "networking tip 1",
    "networking tip 2",
    "networking tip 3"
  ],
  "contentTemplates": {
    "progress_update": "Template for sharing progress",
    "milestone_post": "Template for milestone celebrations",
    "learning_insight": "Template for sharing key learnings"
  }
}`;

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
            content: 'You are an expert in building personal brands and online presence for tech professionals. Create engaging, authentic building-in-public strategies that help people share their learning journey effectively.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Generated building in public strategy:', content);
    
    try {
      const buildingStrategy = JSON.parse(content);
      return new Response(JSON.stringify(buildingStrategy), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

  } catch (error: any) {
    console.error('Error in generate-building-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
