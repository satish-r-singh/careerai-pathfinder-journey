
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, User, Flag, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  project: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  milestones: number;
  completedMilestones: number;
}

interface TaskCardProps {
  task: Task;
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard = ({ task, onMoveTask }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{task.assignee}</span>
            </div>
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          {task.project && (
            <Badge variant="outline" className="text-xs">
              {task.project}
            </Badge>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {columns.map((col) => (
              col.id !== task.status && (
                <Button
                  key={col.id}
                  variant="ghost"
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => onMoveTask(task.id, col.id as Task['status'])}
                >
                  → {col.title}
                </Button>
              )
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete LinkedIn Profile Optimization',
      description: 'Update profile with new skills and project highlights',
      status: 'todo',
      priority: 'high',
      assignee: 'You',
      dueDate: '2024-01-15',
      project: 'Personal Branding'
    },
    {
      id: '2',
      title: 'Submit Application to TechCorp',
      description: 'Complete application for Senior Developer position',
      status: 'in-progress',
      priority: 'high',
      assignee: 'You',
      dueDate: '2024-01-12',
      project: 'Job Applications'
    },
    {
      id: '3',
      title: 'Prepare for Technical Interview',
      description: 'Practice coding challenges and system design',
      status: 'review',
      priority: 'medium',
      assignee: 'You',
      dueDate: '2024-01-18',
      project: 'Interview Prep'
    },
    {
      id: '4',
      title: 'Network with Industry Professionals',
      description: 'Reach out to 5 professionals in target companies',
      status: 'done',
      priority: 'medium',
      assignee: 'You',
      project: 'Networking'
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Personal Branding',
      description: 'Build and enhance professional brand',
      progress: 65,
      milestones: 4,
      completedMilestones: 2
    },
    {
      id: '2',
      name: 'Job Applications',
      description: 'Apply to target positions',
      progress: 40,
      milestones: 8,
      completedMilestones: 3
    },
    {
      id: '3',
      name: 'Interview Prep',
      description: 'Prepare for upcoming interviews',
      progress: 80,
      milestones: 5,
      completedMilestones: 4
    },
    {
      id: '4',
      name: 'Networking',
      description: 'Build professional network',
      progress: 90,
      milestones: 3,
      completedMilestones: 3
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    project: '',
    dueDate: ''
  });

  const columns = [
    { id: 'todo', title: 'To Do', icon: Clock, color: 'bg-gray-50 border-gray-200' },
    { id: 'in-progress', title: 'In Progress', icon: AlertTriangle, color: 'bg-blue-50 border-blue-200' },
    { id: 'review', title: 'Review', icon: Flag, color: 'bg-yellow-50 border-yellow-200' },
    { id: 'done', title: 'Done', icon: CheckCircle, color: 'bg-green-50 border-green-200' }
  ];

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
        assignee: 'You'
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: '',
        dueDate: ''
      });
      setIsAddingTask(false);
    }
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <div className="space-y-6">
      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="premium-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
              <CardDescription className="text-xs">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{project.completedMilestones}/{project.milestones} milestones</span>
                  <Badge variant="secondary" className="text-xs">
                    {project.milestones - project.completedMilestones} left
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <Card className="premium-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text">Project Kanban Board</CardTitle>
              <CardDescription>Use the move buttons to change task status</CardDescription>
            </div>
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new task for your job search project</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="project">Project</Label>
                    <Input
                      id="project"
                      value={newTask.project}
                      onChange={(e) => setNewTask({...newTask, project: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>
                      Add Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => {
              const Icon = column.icon;
              const columnTasks = tasks.filter(task => task.status === column.id);
              
              return (
                <div 
                  key={column.id} 
                  className={`rounded-lg border-2 ${column.color} p-4 min-h-[400px]`}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon className="w-5 h-5" />
                    <h3 className="font-semibold">{column.title}</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onMoveTask={moveTask}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;
