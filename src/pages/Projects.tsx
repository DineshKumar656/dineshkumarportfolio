
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Github, Droplets, Sprout, TrafficCone, Truck, Bot, Sparkles, Zap, Code2, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { useProjectStorage, Project } from "@/hooks/useProjectStorage";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { isEditMode, isAuthenticated } = useEditModeContext();
  const { projects, addProject, updateProject, deleteProject } = useProjectStorage();

  const iconOptions = [
    { name: 'Sprout', component: Sprout },
    { name: 'Droplets', component: Droplets },
    { name: 'TrafficCone', component: TrafficCone },
    { name: 'Truck', component: Truck },
    { name: 'Bot', component: Bot },
    { name: 'Code2', component: Code2 },
    { name: 'Zap', component: Zap }
  ];

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    briefDescription: '',
    tech: '',
    demoUrl: '',
    githubUrl: '',
    featured: false,
    iconName: 'Code2',
    image: '',
    video: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProjectForm(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProjectForm(prev => ({ ...prev, video: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProject = (project: Project) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to modify projects.",
        variant: "destructive",
      });
      return;
    }

    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      briefDescription: project.briefDescription,
      tech: project.tech.join(', '),
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      featured: project.featured,
      iconName: project.iconName,
      image: project.image || '',
      video: project.video || ''
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (id: number) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to delete projects.",
        variant: "destructive",
      });
      return;
    }

    deleteProject(id);
    toast({
      title: "Project Deleted",
      description: "The project has been successfully removed.",
    });
  };

  const handleAddProject = () => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to add projects.",
        variant: "destructive",
      });
      return;
    }
    setIsAddModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }
    
    const projectData = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      longDescription: projectForm.longDescription.trim(),
      briefDescription: projectForm.briefDescription.trim(),
      tech: projectForm.tech.split(',').map(t => t.trim()).filter(t => t),
      demoUrl: projectForm.demoUrl.trim(),
      githubUrl: projectForm.githubUrl.trim(),
      featured: projectForm.featured,
      iconName: projectForm.iconName,
      image: projectForm.image || "/api/placeholder/400/250",
      video: projectForm.video
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
      toast({
        title: "Project Updated",
        description: "The project has been successfully updated.",
      });
    } else {
      addProject(projectData);
      toast({
        title: "Project Added",
        description: "The new project has been successfully added.",
      });
    }

    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setEditingProject(null);
    setProjectForm({
      title: '',
      description: '',
      longDescription: '',
      briefDescription: '',
      tech: '',
      demoUrl: '',
      githubUrl: '',
      featured: false,
      iconName: 'Code2',
      image: '',
      video: ''
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(icon => icon.name === iconName);
    return iconOption ? iconOption.component : Code2;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-200/30 rotate-45 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-emerald-200/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-green-300/20 rotate-12 animate-pulse delay-500"></div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced hero section */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Sparkles className="h-8 w-8 text-green-600 animate-pulse" />
              <span className="text-green-600 font-semibold text-lg tracking-wide uppercase">Portfolio</span>
              <Sparkles className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 relative">
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Projects
              </span>
              <span className="text-gray-900"> Portfolio</span>
              
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">
                Innovative solutions spanning IoT, AI, and smart systems development
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Code2 className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 font-medium">Full-Stack Development</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Zap className="h-5 w-5 text-emerald-600" />
                  <span className="text-gray-700 font-medium">IoT Solutions</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Bot className="h-5 w-5 text-teal-600" />
                  <span className="text-gray-700 font-medium">AI Integration</span>
                </div>
              </div>
            </div>
          </div>

          {isEditMode && isAuthenticated && (
            <div className="text-center mb-8">
              <Button
                onClick={handleAddProject}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Project
              </Button>
            </div>
          )}

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {projects.map((project) => {
              const IconComponent = getIconComponent(project.iconName);
              return (
                <Card 
                  key={project.id} 
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 ${
                    project.featured ? 'lg:col-span-2 xl:col-span-1 ring-2 ring-green-200' : ''
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.featured && (
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                            ⭐ Featured
                          </Badge>
                        )}
                        {isEditMode && isAuthenticated && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditProject(project);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project.id);
                              }}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-4 flex items-center justify-center group-hover:from-green-50 group-hover:to-emerald-50 transition-all duration-300 border border-gray-200 overflow-hidden">
                      {project.image && project.image !== "/api/placeholder/400/250" ? (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <IconComponent className="h-16 w-16 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                      )}
                    </div>
                    
                    {project.briefDescription && (
                      <p className="text-sm text-green-600 font-medium mb-2 italic">
                        {project.briefDescription}
                      </p>
                    )}
                    
                    <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech.length > 3 && (
                        <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                          +{project.tech.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        Demo
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300">
                        <Github className="mr-1 h-3 w-3" />
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Project Modal */}
          {selectedProject && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-2xl text-gray-900 flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                        {React.createElement(getIconComponent(selectedProject.iconName), {
                          className: "h-6 w-6 text-green-600"
                        })}
                      </div>
                      <span>{selectedProject.title}</span>
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      ✕
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center border border-green-100 overflow-hidden">
                      {selectedProject.image && selectedProject.image !== "/api/placeholder/400/250" ? (
                        <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        React.createElement(getIconComponent(selectedProject.iconName), {
                          className: "h-20 w-20 text-green-500"
                        })
                      )}
                    </div>
                    {selectedProject.video && (
                      <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center border border-green-100 overflow-hidden">
                        <video src={selectedProject.video} controls className="w-full h-full object-cover rounded-xl" />
                      </div>
                    )}
                  </div>
                  
                  {selectedProject.briefDescription && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Brief Overview:</h4>
                      <p className="text-green-600 font-medium italic">{selectedProject.briefDescription}</p>
                    </div>
                  )}
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                    {selectedProject.longDescription}
                  </p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg">Technologies Used:</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                    <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 transition-all duration-300">
                      <Github className="mr-2 h-4 w-4" />
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      <Dialog open={isEditModalOpen || isAddModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditModalOpen(false);
          setIsAddModalOpen(false);
          setEditingProject(null);
        }
      }}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              {editingProject ? 'Update project details' : 'Add a new project to your portfolio'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-title" className="text-right">Title</Label>
              <Input
                id="project-title"
                value={projectForm.title}
                onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Project title"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="project-brief" className="text-right mt-2">Brief Description</Label>
              <Input
                id="project-brief"
                value={projectForm.briefDescription}
                onChange={(e) => setProjectForm(prev => ({ ...prev, briefDescription: e.target.value }))}
                className="col-span-3"
                placeholder="Short one-liner about the project"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="project-description" className="text-right mt-2">Description</Label>
              <Textarea
                id="project-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Short description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="project-long-description" className="text-right mt-2">Long Description</Label>
              <Textarea
                id="project-long-description"
                value={projectForm.longDescription}
                onChange={(e) => setProjectForm(prev => ({ ...prev, longDescription: e.target.value }))}
                className="col-span-3"
                placeholder="Detailed description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-image" className="text-right">Project Image</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="project-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {projectForm.image && (
                  <div className="w-32 h-20 border rounded overflow-hidden">
                    <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-video" className="text-right">Project Video</Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="project-video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />
                {projectForm.video && (
                  <div className="w-32 h-20 border rounded overflow-hidden">
                    <video src={projectForm.video} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-tech" className="text-right">Technologies</Label>
              <Input
                id="project-tech"
                value={projectForm.tech}
                onChange={(e) => setProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                className="col-span-3"
                placeholder="React, Node.js, MongoDB (comma-separated)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-demo" className="text-right">Demo URL</Label>
              <Input
                id="project-demo"
                value={projectForm.demoUrl}
                onChange={(e) => setProjectForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                className="col-span-3"
                placeholder="https://demo.example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-github" className="text-right">GitHub URL</Label>
              <Input
                id="project-github"
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                className="col-span-3"
                placeholder="https://github.com/username/repo"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-featured" className="text-right">Featured</Label>
              <div className="col-span-3">
                <Switch
                  id="project-featured"
                  checked={projectForm.featured}
                  onCheckedChange={(checked) => setProjectForm(prev => ({ ...prev, featured: checked }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setIsAddModalOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
