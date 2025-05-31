
import { ProjectOption } from '@/types/projects';
import { getIconComponent } from './iconUtils';

export const getDefaultProjects = (): ProjectOption[] => {
  return [
    {
      id: 'ai-chatbot',
      name: 'AI-Powered Customer Service Chatbot',
      description: 'Build an intelligent chatbot that can handle customer inquiries using natural language processing.',
      difficulty: 'Intermediate',
      duration: '4-6 weeks',
      skills: ['Python/JavaScript', 'OpenAI API', 'Frontend Development', 'Database Management'],
      icon: getIconComponent('Users'),
      iconName: 'Users',
      reasoning: 'A versatile project that demonstrates practical AI application in business contexts.'
    },
    {
      id: 'recommendation-engine',
      name: 'Personalized Recommendation Engine',
      description: 'Create a machine learning system that provides personalized recommendations for e-commerce or content.',
      difficulty: 'Advanced',
      duration: '6-8 weeks',
      skills: ['Machine Learning', 'Python', 'Data Analysis', 'Algorithm Design'],
      icon: getIconComponent('Target'),
      iconName: 'Target',
      reasoning: 'Showcases advanced ML skills and data-driven decision making capabilities.'
    },
    {
      id: 'ai-content-generator',
      name: 'AI Content Generation Tool',
      description: 'Develop a tool that uses AI to generate blog posts, social media content, or marketing copy.',
      difficulty: 'Beginner',
      duration: '3-4 weeks',
      skills: ['API Integration', 'Frontend Development', 'Content Strategy', 'UI/UX'],
      icon: getIconComponent('Lightbulb'),
      iconName: 'Lightbulb',
      reasoning: 'Great starting point for those new to AI development with immediate practical value.'
    },
    {
      id: 'data-analysis-dashboard',
      name: 'AI-Enhanced Data Analytics Dashboard',
      description: 'Build a dashboard that uses AI to provide insights and predictions from business data.',
      difficulty: 'Intermediate',
      duration: '5-7 weeks',
      skills: ['Data Visualization', 'Machine Learning', 'Database Design', 'Business Intelligence'],
      icon: getIconComponent('Code'),
      iconName: 'Code',
      reasoning: 'Combines technical skills with business acumen, valuable for many AI roles.'
    }
  ];
};
