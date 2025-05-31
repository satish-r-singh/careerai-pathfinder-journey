
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
    const { ikigaiData, industryData, profileData, numberOfProjects = 4, existingProjects = [] } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    // Create a context string from user data
    const context = `
User's Ikigai Data:
- Passions: ${ikigaiData.passion?.join(', ') || 'Not specified'}
- Mission/Values: ${ikigaiData.mission?.join(', ') || 'Not specified'}
- Professional Skills: ${ikigaiData.profession?.join(', ') || 'Not specified'}
- Market Opportunities: ${ikigaiData.vocation?.join(', ') || 'Not specified'}

${industryData ? `Industry Research: ${JSON.stringify(industryData).substring(0, 500)}...` : ''}

${profileData ? `
Background: ${profileData.background || 'Not specified'}
Experience: ${profileData.experience || 'Not specified'}
Goals: ${profileData.goals?.join(', ') || 'Not specified'}
` : ''}

${existingProjects.length > 0 ? `
Projects the user wants to keep:
${existingProjects.map(p => `- ${p.name} (ID: ${p.id})`).join('\n')}

Please generate ${numberOfProjects} NEW projects that are different from the existing ones.
` : ''}
`;

    const prompt = `Based on the user's career transition profile below, generate ${numberOfProjects} personalized AI project options that align with their interests, skills, and career goals.

${context}

For each project, provide:
1. A unique ID (kebab-case) - make sure it doesn't conflict with existing project IDs
2. Project name
3. Detailed description (2-3 sentences)
4. Difficulty level (Beginner/Intermediate/Advanced)
5. Duration estimate
6. Required skills (4-6 skills)
7. A brief reasoning for why this project fits their profile

Make the projects diverse in scope and difficulty. Consider their passions, technical background, and career aspirations. Focus on practical AI applications that would be impressive to potential employers.

${existingProjects.length > 0 ? 'IMPORTANT: Make sure the new projects are completely different from the existing ones the user wants to keep.' : ''}

Respond with a JSON object in this exact format:
{
  "projects": [
    {
      "id": "project-id",
      "name": "Project Name",
      "description": "Detailed description...",
      "difficulty": "Intermediate",
      "duration": "4-6 weeks",
      "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
      "reasoning": "Why this project fits their profile..."
    }
  ]
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
            content: 'You are an AI career advisor specializing in creating personalized project recommendations for people transitioning into AI careers. Always respond with valid JSON.'
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
    
    console.log('Generated projects response:', content);
    
    try {
      const projectsData = JSON.parse(content);
      
      // Add default icon mapping since we can't pass actual icon components through JSON
      const iconMapping = ['Users', 'Target', 'Lightbulb', 'Code'];
      projectsData.projects = projectsData.projects.map((project: any, index: number) => ({
        ...project,
        iconName: iconMapping[index % iconMapping.length]
      }));
      
      return new Response(JSON.stringify(projectsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

  } catch (error: any) {
    console.error('Error in generate-personalized-projects function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
