
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, BookOpen, Target, Users, Globe, Lightbulb } from 'lucide-react';
import { LearningPlan as LearningPlanType } from '@/utils/learningPlanGeneration';

interface LearningPlanProps {
  projectName: string;
  learningPlan: LearningPlanType;
}

const LearningPlan = ({ projectName, learningPlan }: LearningPlanProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>AI-Generated Learning Plan</span>
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
              <div className="text-sm text-green-600">{learningPlan.overview.estimatedDuration}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="font-semibold text-purple-800">Weekly Commitment</div>
              <div className="text-sm text-purple-600">{learningPlan.overview.weeklyCommitment}</div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Learning Progression:</h4>
            <p className="text-sm text-gray-600">{learningPlan.overview.difficultyProgression}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Learning Phases</h3>
        {learningPlan.phases.map((phase) => (
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
            <CardContent className="space-y-4">
              {phase.focusSkills.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm mb-2">Focus Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {phase.focusSkills.map((skill, index) => (
                      <Badge key={index} className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h5 className="font-medium text-sm mb-2">Learning Objectives:</h5>
                <ul className="space-y-1">
                  {phase.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Target className="w-3 h-3 mt-1 text-blue-500" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Key Activities:</h5>
                <ul className="space-y-1">
                  {phase.keyActivities.map((activity, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Clock className="w-3 h-3 mt-1 text-gray-400" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-sm mb-2">Milestones:</h5>
                <ul className="space-y-1">
                  {phase.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-3 h-3 mt-1 text-green-500" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-2">
                <div>
                  <h6 className="font-medium text-xs mb-1 text-blue-600">Tutorials</h6>
                  <ul className="space-y-1">
                    {phase.resources.tutorials.map((tutorial, index) => (
                      <li key={index} className="text-xs text-gray-600">• {tutorial}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-xs mb-1 text-purple-600">Documentation</h6>
                  <ul className="space-y-1">
                    {phase.resources.documentation.map((doc, index) => (
                      <li key={index} className="text-xs text-gray-600">• {doc}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h6 className="font-medium text-xs mb-1 text-green-600">Practice</h6>
                  <ul className="space-y-1">
                    {phase.resources.practice.map((practice, index) => (
                      <li key={index} className="text-xs text-gray-600">• {practice}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <span>Building in Public Strategy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Recommended Platforms:</h5>
              <div className="flex flex-wrap gap-2 mb-4">
                {learningPlan.buildingInPublic.platforms.map((platform, index) => (
                  <Badge key={index} variant="outline">{platform}</Badge>
                ))}
              </div>
              
              <h5 className="font-medium text-sm mb-2">Content Ideas:</h5>
              <ul className="space-y-1">
                {learningPlan.buildingInPublic.contentIdeas.map((idea, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <Lightbulb className="w-3 h-3 mt-1 text-yellow-500" />
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-sm mb-2">Milestone Sharing:</h5>
              <ul className="space-y-1 mb-4">
                {learningPlan.buildingInPublic.milestoneSharing.map((milestone, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <Globe className="w-3 h-3 mt-1 text-blue-500" />
                    <span>{milestone}</span>
                  </li>
                ))}
              </ul>
              
              <h5 className="font-medium text-sm mb-2">Networking Tips:</h5>
              <ul className="space-y-1">
                {learningPlan.buildingInPublic.networkingTips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <Users className="w-3 h-3 mt-1 text-purple-500" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Success Metrics & Additional Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-sm mb-2">Success Metrics:</h5>
              <ul className="space-y-1">
                {learningPlan.successMetrics.map((metric, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <Target className="w-3 h-3 mt-1 text-green-500" />
                    <span>{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-3">
              <div>
                <h6 className="font-medium text-xs mb-1 text-blue-600">Communities</h6>
                <div className="flex flex-wrap gap-1">
                  {learningPlan.additionalResources.communities.map((community, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{community}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h6 className="font-medium text-xs mb-1 text-purple-600">Tools</h6>
                <div className="flex flex-wrap gap-1">
                  {learningPlan.additionalResources.tools.map((tool, index) => (
                    <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{tool}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <h6 className="font-medium text-xs mb-1 text-green-600">Recommended Books</h6>
                <div className="flex flex-wrap gap-1">
                  {learningPlan.additionalResources.books.map((book, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{book}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPlan;
