
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
    const { projects, projectProgress, platform } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Create project progress summary
    const progressSummary = projects.map((project: any) => {
      const progress = projectProgress[project.id];
      return {
        name: project.name,
        description: project.description,
        difficulty: project.difficulty,
        skills: project.skills,
        hasLearningPlan: progress.learningPlan,
        hasBuildingPlan: progress.buildingPlan
      };
    }).filter((p: any) => p.hasLearningPlan || p.hasBuildingPlan);

    const prompt = `Create engaging "build in public" social media posts based on the following AI project progress:

Projects in Progress:
${progressSummary.map((p: any) => `
- ${p.name}: ${p.description}
  - Difficulty: ${p.difficulty}
  - Skills: ${p.skills.join(', ')}
  - Learning Plan: ${p.hasLearningPlan ? 'Created ✅' : 'Not started'}
  - Building Plan: ${p.hasBuildingPlan ? 'Created ✅' : 'Not started'}
`).join('\n')}

Platform Requirements:
- Platform: ${platform}
${platform === 'linkedin' || platform === 'both' ? '- LinkedIn: Professional, engaging, 1-3 paragraphs, include relevant hashtags' : ''}
${platform === 'twitter' || platform === 'both' ? '- X (formerly Twitter): Concise, under 280 characters, engaging, include 2-3 relevant hashtags' : ''}

Create authentic posts that:
1. Show genuine progress and learning
2. Include specific technical details about the projects
3. Mention challenges and breakthroughs
4. Use a personal, authentic tone
5. Include call-to-action to engage the community
6. Reference the AI-driven nature of the learning journey

${platform === 'both' ? 'Generate both LinkedIn and X versions.' : `Generate a ${platform === 'twitter' ? 'X' : platform} post.`}

Respond with a JSON object in this format:
${platform === 'both' ? `{
  "linkedinPost": "LinkedIn post content here",
  "twitterPost": "X post content here"
}` : platform === 'linkedin' ? `{
  "linkedinPost": "LinkedIn post content here"
}` : `{
  "twitterPost": "X post content here"
}`}`;

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
            content: 'You are an expert social media content creator who helps developers share their learning journey authentically. Create engaging build-in-public posts that showcase progress, learning, and community engagement. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    console.log('Generated daily posts:', content);
    
    // Clean up the response - remove markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    try {
      const posts = JSON.parse(content);
      return new Response(JSON.stringify(posts), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw content:', content);
      throw new Error('Invalid response format from AI');
    }

  } catch (error: any) {
    console.error('Error in generate-daily-posts function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
