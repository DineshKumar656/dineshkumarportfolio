import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Download, ArrowRight, Github, Linkedin, Mail, Sparkles, Code, Zap, Upload, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { useFileStorage } from "@/hooks/useFileStorage";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isMissionEditOpen, setIsMissionEditOpen] = useState(false);
  const [editingMission, setEditingMission] = useState("");
  const { toast } = useToast();
  const { isEditMode, isAuthenticated } = useEditModeContext();
  const { saveFile: saveResume, getLatestFile: getLatestResume, deleteFile: deleteResume, files: resumeFiles } = useFileStorage('portfolio_resume');
  
  const defaultMission = "Final-year ECE student passionate about smart systems, real-time IoT monitoring, and AI-based analytics. My goal is to become a cross-domain professional, using modern technology to solve real-world challenges.";
  const [missionText, setMissionText] = usePersistentStorage('portfolio_mission', defaultMission);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth * 100,
        y: e.clientY / window.innerHeight * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await saveResume(file);
        setIsResumeDialogOpen(false);
        toast({
          title: "Resume Uploaded",
          description: "Your resume has been uploaded and saved successfully!",
        });
      } catch (error) {
        console.error('Resume upload error:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload resume. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveResume = () => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to remove resume.",
        variant: "destructive",
      });
      return;
    }

    const latestResume = getLatestResume();
    if (latestResume) {
      deleteResume(latestResume.name);
      toast({
        title: "Resume Removed",
        description: "Your resume has been successfully removed.",
      });
    }
  };

  const handleDownloadResume = () => {
    const latestResume = getLatestResume();
    if (latestResume) {
      const link = document.createElement('a');
      link.href = latestResume.data;
      link.download = latestResume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Resume Downloaded",
        description: `Downloaded ${latestResume.name}`,
      });
    } else {
      if (isEditMode && isAuthenticated) {
        setIsResumeDialogOpen(true);
      } else {
        toast({
          title: "No Resume Available",
          description: "No resume has been uploaded yet.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveMission = () => {
    setMissionText(editingMission);
    setIsMissionEditOpen(false);
    toast({
      title: "Mission Updated",
      description: "Your mission statement has been updated successfully!",
    });
  };

  const handleEditMission = () => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to modify content.",
        variant: "destructive",
      });
      return;
    }
    setEditingMission(missionText);
    setIsMissionEditOpen(true);
  };

  const latestResume = getLatestResume();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background with mouse parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => <div key={i} className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }} />)}
        </div>
        
        {/* Interactive gradient orbs */}
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-300/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out" style={{
        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.3}px)`,
        top: '-10%',
        right: '-10%'
      }} />
        <div className="absolute w-80 h-80 bg-gradient-to-l from-purple-400/25 to-pink-300/25 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out" style={{
        transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.4}px)`,
        top: '40%',
        left: '-15%'
      }} />
        <div className="absolute w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-blue-300/15 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000 ease-out" style={{
        transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.2}px)`,
        bottom: '10%',
        right: '20%'
      }} />
      </div>

      <div className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Enhanced Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
              <div className="space-y-6">
                {/* Animated greeting */}
                <div className="flex items-center space-x-2 text-white/90">
                  <Sparkles className="h-6 w-6 animate-pulse text-blue-400" />
                  <span className="text-lg font-medium tracking-wide">Welcome to my digital space</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Hello, I'm
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 relative">
                    DINESH KUMAR S
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transform scale-x-0 animate-[scale-x-100_1s_ease-out_1s_forwards]"></div>
                  </span>
                </h1>
                
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 text-blue-300">
                      <Code className="h-5 w-5" />
                      <span className="text-lg font-medium">Tech Enthusiast</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Zap className="h-5 w-5" />
                      <span className="text-lg font-medium">Innovation Driver</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                  A tech enthusiast bridging Electronics, AI, and Data Science to build smart, impactful solutions.
                </p>
              </div>

              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative group">
                {isEditMode && isAuthenticated && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEditMission}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 border-white/30 hover:bg-white/20"
                  >
                    <Edit className="h-3 w-3 text-white" />
                  </Button>
                )}
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">My Mission</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {missionText}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleDownloadResume}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {latestResume ? 'Download Resume' : 'No Resume Available'}
                  </Button>
                  {isEditMode && isAuthenticated && latestResume && (
                    <Button
                      onClick={handleRemoveResume}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-200 hover:bg-red-900/20 px-3 py-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Link to="/projects">
                  <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    View Projects
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex space-x-8">
                <a href="https://linkedin.com" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                  <Linkedin className="h-8 w-8" />
                </a>
                <a href="https://github.com" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                  <Github className="h-8 w-8" />
                </a>
                <a href="mailto:dineshkumar22106007@gmail.com" className="text-white hover:text-blue-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1">
                  <Mail className="h-8 w-8" />
                </a>
              </div>
            </div>

            {/* Enhanced Right Content - Profile Image and Stats */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
              <div className="relative">
                {/* Enhanced Profile Image with tech-themed background */}
                <div className="w-80 h-80 mx-auto relative">
                  {/* Tech-themed background with code patterns */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-full opacity-90">
                    {/* Code pattern overlay */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10 flex items-center justify-center text-green-400/30 text-xs font-mono overflow-hidden">
                      <div className="absolute inset-0 flex flex-col justify-around text-[8px] leading-3 px-4 py-4 opacity-60">
                        <div>{'const developer = {'}</div>
                        <div>{'  name: "Dinesh",'}</div>
                        <div>{'  skills: ["React",'}</div>
                        <div>{'    "TypeScript",'}</div>
                        <div>{'    "AI/ML", "IoT"],'}</div>
                        <div>{'  passion: "Innovation"'}</div>
                        <div>{'};'}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Glowing border container */}
                  <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-white/5 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group">
                    {/* Animated glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
                    
                    {/* Profile photo with improved positioning for face visibility */}
                    <Avatar className="w-72 h-72 relative z-10 transition-all duration-300 group-hover:scale-105">
                      <AvatarImage 
                        src="https://i.postimg.cc/ydkbbV8L/340611df-121d-4a8b-941c-16d407ede5d5.png" 
                        alt="Dinesh Kumar S" 
                        className="object-cover rounded-full scale-[1.12] translate-y-[4px]"
                        style={{
                          objectPosition: '50% 23%',
                          objectFit: 'cover'
                        }} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-lg font-medium">
                        DK
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Rotating tech icons around the border */}
                    <div className="absolute inset-0 animate-spin" style={{
                      animationDuration: '20s'
                    }}>
                      <Code className="absolute top-4 left-1/2 transform -translate-x-1/2 h-4 w-4 text-blue-400" />
                      <Zap className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-yellow-400" />
                      <Sparkles className="absolute bottom-4 left-1/2 transform -translate-x-1/2 h-4 w-4 text-purple-400" />
                    </div>
                  </div>
                  
                  {/* Outer rotating border effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 animate-spin opacity-60" style={{
                    animationDuration: '8s'
                  }}></div>
                </div>

                {/* Enhanced Floating Stats Cards */}
                <Card className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-sm text-blue-600 font-medium">Cross-Domain</div>
                      <div className="font-bold text-gray-800 text-lg">Professional</div>
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mt-2"></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="absolute bottom-8 -left-10 bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="text-sm text-gray-600 font-medium">Great Projects</div>
                    </div>
                    <div className="font-bold text-2xl text-gray-800 mt-1">10+ Done</div>
                    <div className="text-xs text-green-600 font-medium">95% success rate</div>
                  </CardContent>
                </Card>

                <Card className="absolute bottom-20 -right-10 bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Google</div>
                        <div className="text-sm font-semibold text-gray-800">Certified Pro</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Enhanced scroll indicator */}
          <div className="text-center mt-16">
            <div className="inline-block animate-bounce">
              <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center relative">
                <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
              </div>
              <p className="text-white/70 text-sm mt-2 font-medium">Scroll to explore</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Upload Dialog - Only show in edit mode */}
      {isEditMode && isAuthenticated && (
        <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Resume</DialogTitle>
              <DialogDescription>
                Please upload your resume to enable the download feature.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="resume-upload" className="text-right">Resume</Label>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResumeDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Mission Edit Dialog - Only show in edit mode */}
      {isEditMode && isAuthenticated && (
        <Dialog open={isMissionEditOpen} onOpenChange={setIsMissionEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Mission Statement</DialogTitle>
              <DialogDescription>
                Update your personal mission statement.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="mission-text" className="text-right mt-2">Mission</Label>
                <Textarea
                  id="mission-text"
                  value={editingMission}
                  onChange={(e) => setEditingMission(e.target.value)}
                  className="col-span-3"
                  rows={5}
                  placeholder="Enter your mission statement..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMissionEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMission}>
                Save Mission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
