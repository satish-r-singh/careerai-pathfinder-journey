
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, BookOpen, Target, Users } from 'lucide-react';

interface LearningPlanProps {
  projectName: string;
  skills: string[];
  difficulty: string;
}

const LearningPlan = ({ projectName, skills, difficulty }: LearningPlanProps) => {
  const getDifficultyWeeks = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 4;
      case 'Intermediate': return 6;
      case 'Advanced': return 8;
      default: return 6;
    }
  };

  const getPhases = (skills: string[], weeks: number) => {
    const phaseLength = Math.ceil(weeks / 3);
    return [
      {
        phase: 1,
        title: "Foundation & Setup",
        duration: `Weeks 1-${phaseLength}`,
        skills: skills.slice(0, 2),
        activities: [
          "Set up development environment",
          "Learn basic concepts and syntax",
          "Complete introductory tutorials",
          "Build simple practice exercises"
        ]
      },
      {
        phase: 2,
        title: "Core Development",
        duration: `Weeks ${phaseLength + 1}-${phaseLength * 2}`,
        skills: skills.slice(2, 4),
        activities: [
          "Implement core project features",
          "Apply best practices and patterns",
          "Handle data processing and storage",
          "Build user interface components"
        ]
      },
      {
        phase: 3,
        title: "Advanced Features & Polish",
        duration: `Weeks ${phaseLength * 2 + 1}-${weeks}`,
        skills: skills.slice(4),
        activities: [
          "Implement advanced functionality",
          "Optimize performance and user experience",
          "Add testing and documentation",
          "Deploy and share your project"
        ]
      }
    ];
  };

  const weeks = getDifficultyWeeks(difficulty);
  const phases = getPhases(skills, weeks);

  const resources = [
    {
      type: "Documentation",
      items: ["Official documentation for each technology", "API references and guides"]
    },
    {
      type: "Online Courses",
      items: ["Platform-specific tutorials (YouTube, Coursera, Udemy)", "Interactive coding platforms"]
    },
    {
      type: "Practice",
      items: ["Coding challenges and exercises", "Small projects to reinforce learning"]
    },
    {
      type: "Community",
      items: ["Stack Overflow for troubleshooting", "Discord/Reddit communities for support"]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Learning Plan Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-800">Project</div>
              <div className="text-sm text-blue-600">{projectName}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-800">Duration</div>
              <div className="text-sm text-green-600">{weeks} weeks</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">Difficulty</div>
              <div className="text-sm text-purple-600">{difficulty}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Skills You'll Learn:</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Learning Phases</h3>
        {phases.map((phase) => (
          <Card key={phase.phase}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {phase.phase}
                  </div>
                  <span>{phase.title}</span>
                </span>
                <Badge variant="outline">{phase.duration}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {phase.skills.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-sm mb-2">Focus Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {phase.skills.map((skill, index) => (
                      <Badge key={index} className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h5 className="font-medium text-sm mb-2">Key Activities:</h5>
                <ul className="space-y-1">
                  {phase.activities.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Clock className="w-3 h-3 mt-1 text-gray-400" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Recommended Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="space-y-2">
                <h5 className="font-medium text-sm">{resource.type}</h5>
                <ul className="space-y-1">
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <Users className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Building in Public Tips</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Share your daily progress and challenges on social media</li>
                <li>• Document your learning process with blog posts or videos</li>
                <li>• Join relevant communities and engage with other learners</li>
                <li>• Ask for feedback and help when you get stuck</li>
                <li>• Celebrate small wins and milestones publicly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPlan;
