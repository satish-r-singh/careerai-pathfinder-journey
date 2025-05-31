
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
    const { project, userProfile, ikigaiData } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const prompt = `Create a personalized learning plan for the following AI project:

Project Details:
- Name: ${project.name}
- Description: ${project.description}
- Difficulty: ${project.difficulty}
- Duration: ${project.duration}
- Required Skills: ${project.skills.join(', ')}
- Why it fits the user: ${project.reasoning}

User Background:
${userProfile ? `
- Background: ${userProfile.background || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Goals: ${userProfile.goals?.join(', ') || 'Not specified'}
` : 'User profile not available'}

User's Ikigai Profile:
${ikigaiData ? `
- Passions: ${ikigaiData.passion?.join(', ') || 'Not specified'}
- Mission/Values: ${ikigaiData.mission?.join(', ') || 'Not specified'}
- Professional Skills: ${ikigaiData.profession?.join(', ') || 'Not specified'}
- Market Opportunities: ${ikigaiData.vocation?.join(', ') || 'Not specified'}
` : 'Ikigai data not available'}

Create a comprehensive learning plan that includes:

1. **Learning Overview**: Customized duration based on user's experience and project complexity
2. **Learning Phases**: 3-4 phases with specific focus areas, milestones, and activities tailored to this project
3. **Skill Development Path**: Progression from basic to advanced concepts specific to the required technologies
4. **Resources**: Curated list of learning materials, tutorials, and practice exercises
5. **Building in Public Strategy**: Specific suggestions for documenting and sharing progress for this particular project
6. **Success Metrics**: How to measure progress and validate learning

Make the plan specific to the project's technologies and the user's learning style. Consider their existing skills and tailor the difficulty progression accordingly.

Respond with a JSON object in this exact format:
{
  "overview": {
    "estimatedDuration": "X weeks",
    "weeklyCommitment": "X hours per week",
    "difficultyProgression": "Description of how difficulty increases"
  },
  "phases": [
    {
      "phase": 1,
      "title": "Phase Title",
      "duration": "Weeks X-Y",
      "focusSkills": ["skill1", "skill2"],
      "learningObjectives": ["objective1", "objective2"],
      "keyActivities": ["activity1", "activity2"],
      "milestones": ["milestone1", "milestone2"],
      "resources": {
        "tutorials": ["resource1", "resource2"],
        "documentation": ["doc1", "doc2"],
        "practice": ["exercise1", "exercise2"]
      }
    }
  ],
  "buildingInPublic": {
    "platforms": ["platform1", "platform2"],
    "contentIdeas": ["idea1", "idea2"],
    "milestoneSharing": ["what to share at each milestone"],
    "networkingTips": ["tip1", "tip2"]
  },
  "successMetrics": [
    "metric1",
    "metric2"
  ],
  "additionalResources": {
    "communities": ["community1", "community2"],
    "tools": ["tool1", "tool2"],
    "books": ["book1", "book2"]
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
            content: 'You are an expert AI learning advisor who creates personalized learning plans for AI professionals. Always respond with valid JSON that matches the requested format exactly.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('Generated learning plan response:', content);
    
    try {
      const learningPlan = JSON.parse(content);
      return new Response(JSON.stringify(learningPlan), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

  } catch (error: any) {
    console.error('Error in generate-learning-plan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
