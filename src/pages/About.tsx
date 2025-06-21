
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { GraduationCap, Calendar, MapPin, Sparkles, Target, Heart, Zap, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

interface AboutContent {
  title: string;
  description: string;
  journeyText: string[];
  education: {
    degree: string;
    institution: string;
    period: string;
    description: string;
  };
  shortTermGoals: string[];
  longTermGoals: string[];
}

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string>("");
  const { toast } = useToast();
  const { isEditMode, isAuthenticated } = useEditModeContext();

  const defaultAboutContent: AboutContent = {
    title: "About Me",
    description: "Passionate about bridging the gap between hardware and software to create intelligent solutions",
    journeyText: [
      "As a final-year Electronics and Communication Engineering student, I've developed a unique perspective that combines hardware expertise with modern software development. My passion lies in creating smart systems that can monitor, analyze, and respond to real-world conditions.",
      "Through various projects involving IoT sensors, AI analytics, and data visualization, I've gained hands-on experience in building end-to-end solutions. From developing smart irrigation systems to creating AI-powered conversation bots, I enjoy tackling challenges that require both technical depth and creative problem-solving.",
      "My goal is to become a cross-domain professional who can seamlessly integrate electronics, artificial intelligence, and data science to build impactful solutions that make a difference in people's lives."
    ],
    education: {
      degree: "B.E in Electronics and Communication Engineering",
      institution: "P.T. Lee Chengalvaraya Naicker College of Engineering & Technology",
      period: "2022 - 2026",
      description: "Currently pursuing my final year with a focus on IoT systems, embedded programming, and AI integration in hardware applications."
    },
    shortTermGoals: [
      "Master advanced AI/ML frameworks",
      "Develop industry-ready IoT solutions",
      "Contribute to open-source projects",
      "Build a strong professional network"
    ],
    longTermGoals: [
      "Lead innovative tech solutions",
      "Bridge academia and industry",
      "Mentor emerging engineers",
      "Create sustainable smart systems"
    ]
  };

  const [aboutContent, setAboutContent] = usePersistentStorage<AboutContent>(
    'portfolio_about_content', 
    defaultAboutContent
  );

  const [editForm, setEditForm] = useState<any>({});

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

  const handleEditSection = (section: string) => {
    if (!isAuthenticated || !isEditMode) {
      toast({
        title: "Authentication Required",
        description: "Please login as admin and enable edit mode to make changes.",
        variant: "destructive",
      });
      return;
    }

    setEditingSection(section);
    
    switch (section) {
      case 'header':
        setEditForm({
          title: aboutContent.title,
          description: aboutContent.description
        });
        break;
      case 'journey':
        setEditForm({
          journeyText: aboutContent.journeyText.join('\n\n')
        });
        break;
      case 'education':
        setEditForm(aboutContent.education);
        break;
      case 'goals':
        setEditForm({
          shortTermGoals: aboutContent.shortTermGoals.join('\n'),
          longTermGoals: aboutContent.longTermGoals.join('\n')
        });
        break;
    }
    
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    let updatedContent = { ...aboutContent };

    switch (editingSection) {
      case 'header':
        updatedContent = {
          ...updatedContent,
          title: editForm.title,
          description: editForm.description
        };
        break;
      case 'journey':
        updatedContent = {
          ...updatedContent,
          journeyText: editForm.journeyText.split('\n\n').filter((text: string) => text.trim())
        };
        break;
      case 'education':
        updatedContent = {
          ...updatedContent,
          education: editForm
        };
        break;
      case 'goals':
        updatedContent = {
          ...updatedContent,
          shortTermGoals: editForm.shortTermGoals.split('\n').filter((goal: string) => goal.trim()),
          longTermGoals: editForm.longTermGoals.split('\n').filter((goal: string) => goal.trim())
        };
        break;
    }

    setAboutContent(updatedContent);

    toast({
      title: "Content Updated",
      description: "Your about section has been successfully saved.",
    });

    setIsEditModalOpen(false);
    setEditingSection("");
    setEditForm({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Interactive gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-white/20 to-blue-200/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.3}px)`,
            top: '-15%',
            right: '-15%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-l from-white/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.4}px)`,
            top: '50%',
            left: '-20%'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-br from-purple-200/20 to-white/10 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.2}px)`,
            bottom: '5%',
            right: '15%'
          }}
        />
      </div>
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced hero section */}
          <div className={`text-center mb-16 transform transition-all duration-1000 relative group ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {isAuthenticated && isEditMode && (
              <Button
                onClick={() => handleEditSection('header')}
                size="sm"
                variant="outline"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Heart className="h-8 w-8 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-lg tracking-wide uppercase">Personal Story</span>
              <Heart className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 relative">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                {aboutContent.title.split(' ')[0]}
              </span>
              <span className="text-white"> {aboutContent.title.split(' ').slice(1).join(' ')}</span>
              
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                {aboutContent.description}
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Goal-Oriented</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Innovation-Driven</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Creative Problem Solver</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Education Card */}
            <Card className={`shadow-xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-1000 delay-300 hover:scale-105 hover:shadow-2xl group ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}>
              <CardHeader className="relative">
                {isAuthenticated && isEditMode && (
                  <Button
                    onClick={() => handleEditSection('education')}
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <CardTitle className="flex items-center text-2xl text-gray-900">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mr-4">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {aboutContent.education.degree}
                  </h3>
                  <p className="text-gray-700 mb-2 font-medium">
                    {aboutContent.education.institution}
                  </p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{aboutContent.education.period}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {aboutContent.education.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bio Card */}
            <Card className={`shadow-xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-1000 delay-500 hover:scale-105 hover:shadow-2xl group ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}>
              <CardHeader className="relative">
                {isAuthenticated && isEditMode && (
                  <Button
                    onClick={() => handleEditSection('journey')}
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg mr-3">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  My Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aboutContent.journeyText.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Goals & Aspirations */}
            <Card className={`shadow-xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-1000 delay-700 hover:scale-105 hover:shadow-2xl group ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}>
              <CardHeader className="relative">
                {isAuthenticated && isEditMode && (
                  <Button
                    onClick={() => handleEditSection('goals')}
                    size="sm"
                    variant="outline"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  Goals & Aspirations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                    <h4 className="text-lg font-semibold text-green-700 flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Short-term Goals
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {aboutContent.shortTermGoals.map((goal, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></div>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                    <h4 className="text-lg font-semibold text-blue-700 flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Long-term Vision
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {aboutContent.longTermGoals.map((goal, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingSection === 'header' ? 'Header' : editingSection === 'journey' ? 'Journey' : editingSection === 'education' ? 'Education' : 'Goals'}</DialogTitle>
            <DialogDescription>
              Update your about section content.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingSection === 'header' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </>
            )}
            
            {editingSection === 'journey' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="journey" className="text-right mt-2">Journey Text</Label>
                <Textarea
                  id="journey"
                  value={editForm.journeyText || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, journeyText: e.target.value }))}
                  className="col-span-3"
                  rows={10}
                  placeholder="Separate paragraphs with double line breaks"
                />
              </div>
            )}

            {editingSection === 'education' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="degree" className="text-right">Degree</Label>
                  <Input
                    id="degree"
                    value={editForm.degree || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, degree: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="institution" className="text-right">Institution</Label>
                  <Input
                    id="institution"
                    value={editForm.institution || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, institution: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="period" className="text-right">Period</Label>
                  <Input
                    id="period"
                    value={editForm.period || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, period: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edu-description" className="text-right mt-2">Description</Label>
                  <Textarea
                    id="edu-description"
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </>
            )}

            {editingSection === 'goals' && (
              <>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="short-goals" className="text-right mt-2">Short-term Goals</Label>
                  <Textarea
                    id="short-goals"
                    value={editForm.shortTermGoals || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, shortTermGoals: e.target.value }))}
                    className="col-span-3"
                    rows={4}
                    placeholder="One goal per line"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="long-goals" className="text-right mt-2">Long-term Goals</Label>
                  <Textarea
                    id="long-goals"
                    value={editForm.longTermGoals || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, longTermGoals: e.target.value }))}
                    className="col-span-3"
                    rows={4}
                    placeholder="One goal per line"
                  />
                </div>
              </>
            )}
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
    </div>
  );
};

export default About;
