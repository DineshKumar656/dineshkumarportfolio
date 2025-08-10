import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Database, Cpu, Users, Sparkles, Brain, Layers, Rocket, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategoryData {
  title: string;
  skills: Skill[];
}

// Separate icon mapping that won't be serialized
const categoryIcons = {
  programming: Code,
  tools: Database,
  iot: Cpu,
  soft: Users,
};

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("programming");
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [editingSkill, setEditingSkill] = useState<{ categoryKey: string; skillIndex: number; skill: Skill } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", level: 0 });
  const [addForm, setAddForm] = useState({ name: "", level: 0, category: "" });
  const { toast } = useToast();
  const { isEditMode } = useEditModeContext();

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use persistent storage for skills data only (without icons)
  const [skillCategoriesData, setSkillCategoriesData] = usePersistentStorage<Record<string, SkillCategoryData>>('portfolio_skills', {
    programming: {
      title: "Programming Languages",
      skills: [
        { name: "Python", level: 90 },
        { name: "SQL", level: 85 },
        { name: "C++", level: 80 },
        { name: "MATLAB", level: 75 },
        { name: "Excel",Level: 100},
      ]
    },
    tools: {
      title: "Tools & Platforms",
      skills: [
        { name: "Power BI", level: 88 },
        { name: "Tableau", level: 82 },
        { name: "Excel (AI)", level: 90 },
        { name: "Firebase", level: 85 },
        { name: "Flask", level: 80 },
        { name: "Blynk", level: 85 },
        { name: "ThingSpeak", level: 83 },
      ]
    },
    iot: {
      title: "IoT/AI Frameworks",
      skills: [
        { name: "ESP32", level: 87 },
        { name: "NodeMCU", level: 85 },
        { name: "OpenWeatherMap API", level: 80 },
        { name: "Telegram Bot API", level: 82 },
      ]
    },
    soft: {
      title: "Soft Skills",
      skills: [
        { name: "Team Management", level: 85 },
        { name: "Communication", level: 90 },
        { name: "Presentation", level: 88 },
        { name: "Problem Solving", level: 92 },
      ]
    }
  });

  const handleEditSkill = (categoryKey: string, skillIndex: number) => {
    if (!isEditMode) {
      toast({
        title: "Edit Mode Disabled",
        description: "Please enable edit mode to modify content.",
        variant: "destructive",
      });
      return;
    }

    const skill = skillCategoriesData[categoryKey].skills[skillIndex];
    setEditingSkill({ categoryKey, skillIndex, skill });
    setEditForm({ name: skill.name, level: skill.level });
    setIsEditModalOpen(true);
  };

  const handleDeleteSkill = (categoryKey: string, skillIndex: number) => {
    if (!isEditMode) {
      toast({
        title: "Edit Mode Disabled",
        description: "Please enable edit mode to modify content.",
        variant: "destructive",
      });
      return;
    }

    const skill = skillCategoriesData[categoryKey].skills[skillIndex];
    setSkillCategoriesData(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        skills: prev[categoryKey].skills.filter((_, index) => index !== skillIndex)
      }
    }));
    
    toast({
      title: "Skill Deleted",
      description: `${skill.name} has been removed from ${skillCategoriesData[categoryKey].title}.`,
    });
  };

  const handleSaveEdit = () => {
    if (!editingSkill) return;

    if (!editForm.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (editForm.level < 0 || editForm.level > 100) {
      toast({
        title: "Error",
        description: "Skill level must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setSkillCategoriesData(prev => ({
      ...prev,
      [editingSkill.categoryKey]: {
        ...prev[editingSkill.categoryKey],
        skills: prev[editingSkill.categoryKey].skills.map((skill, index) =>
          index === editingSkill.skillIndex
            ? { name: editForm.name.trim(), level: editForm.level }
            : skill
        )
      }
    }));

    toast({
      title: "Skill Updated",
      description: `${editForm.name} has been updated successfully.`,
    });

    setIsEditModalOpen(false);
    setEditingSkill(null);
    setEditForm({ name: "", level: 0 });
  };

  const handleAddSkill = () => {
    if (!addForm.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    if (addForm.level < 0 || addForm.level > 100) {
      toast({
        title: "Error",
        description: "Skill level must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    if (!addForm.category) {
      toast({
        title: "Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    setSkillCategoriesData(prev => ({
      ...prev,
      [addForm.category]: {
        ...prev[addForm.category],
        skills: [...prev[addForm.category].skills, { name: addForm.name.trim(), level: addForm.level }]
      }
    }));

    toast({
      title: "Skill Added",
      description: `${addForm.name} has been added to ${skillCategoriesData[addForm.category].title}.`,
    });

    setIsAddModalOpen(false);
    setAddForm({ name: "", level: 0, category: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/25 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-white/20 to-pink-200/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.4}px)`,
            top: '-10%',
            right: '-10%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-l from-white/15 to-purple-200/15 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * 0.3}px)`,
            top: '40%',
            left: '-15%'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-br from-red-200/20 to-white/10 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.3}px)`,
            bottom: '10%',
            right: '20%'
          }}
        />
      </div>
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced hero section */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Brain className="h-8 w-8 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-lg tracking-wide uppercase">Technical Arsenal</span>
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 relative">
              <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                Skills
              </span>
              <span className="text-white"> & Expertise</span>
              
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                A comprehensive toolkit spanning programming, IoT, AI, and interpersonal skills
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Layers className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Multi-Domain</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Rocket className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Rapid Learning</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Innovation-Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div className={`flex flex-wrap justify-center gap-4 mb-8 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {Object.entries(skillCategoriesData).map(([key, category]) => {
              const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all transform hover:scale-105 ${
                    activeCategory === key
                      ? 'bg-white text-purple-600 shadow-xl scale-105'
                      : 'bg-white/20 text-white hover:bg-white/30 shadow-lg backdrop-blur-sm'
                  }`}
                >
                  <IconComponent className="mr-2 h-5 w-5" />
                  {category.title}
                </button>
              );
            })}
          </div>

          {/* Add New Skill Button - Only show in edit mode */}
          {isEditMode && (
            <div className="text-center mb-8">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Skill
              </Button>
            </div>
          )}

          {/* Skills Display */}
          <Card className={`shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-1000 delay-500 hover:scale-105 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-2xl">
                {React.createElement(categoryIcons[activeCategory as keyof typeof categoryIcons], {
                  className: "mr-3 h-8 w-8"
                })}
                {skillCategoriesData[activeCategory].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {skillCategoriesData[activeCategory].skills.map((skill, index) => (
                  <div key={`${skill.name}-${index}`} className="space-y-2 group">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">{skill.level}%</Badge>
                        {/* Edit controls only show in edit mode */}
                        {isEditMode && (
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditSkill(activeCategory, index)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteSkill(activeCategory, index)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.level}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Skills Overview */}
          <div className={`mt-12 grid md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">4+</div>
                <div className="text-gray-700">Programming Languages</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
                <div className="text-gray-700">Tools & Platforms</div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
                <div className="text-gray-700">Major Projects</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Skill Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Update the skill name and proficiency level.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-name" className="text-right">
                Name
              </Label>
              <Input
                id="skill-name"
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Enter skill name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skill-level" className="text-right">
                Level (%)
              </Label>
              <Input
                id="skill-level"
                type="number"
                min="0"
                max="100"
                value={editForm.level}
                onChange={(e) => setEditForm(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                className="col-span-3"
                placeholder="0-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Skill Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Add a new skill to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-skill-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-skill-name"
                value={addForm.name}
                onChange={(e) => setAddForm(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-3"
                placeholder="Enter skill name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-skill-level" className="text-right">
                Level (%)
              </Label>
              <Input
                id="new-skill-level"
                type="number"
                min="0"
                max="100"
                value={addForm.level}
                onChange={(e) => setAddForm(prev => ({ ...prev, level: parseInt(e.target.value) || 0 }))}
                className="col-span-3"
                placeholder="0-100"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-skill-category" className="text-right">
                Category
              </Label>
              <Select value={addForm.category} onValueChange={(value) => setAddForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(skillCategoriesData).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Skills;
