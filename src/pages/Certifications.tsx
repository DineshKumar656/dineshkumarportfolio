import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Award, ExternalLink, Sparkles, Trophy, Star, Target, Eye, Upload, Plus, Edit, Trash2 } from "lucide-react";
import CertificateViewer from "@/components/CertificateViewer";
import CertificateUpload from "@/components/CertificateUpload";
import CertificateEdit from "@/components/CertificateEdit";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

const Certifications = () => {
  const { isEditMode, isAuthenticated } = useEditModeContext();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const { toast } = useToast();
  
  const defaultCertifications = [
    {
      title: "Full Stack Development Certification",
      organization: "TechAcademy Pro",
      date: "2024",
      type: "Professional",
      description: "Comprehensive full-stack development training covering modern web technologies",
      skills: ["React", "Node.js", "TypeScript", "Database Design"],
      status: "Completed"
    },
    {
      title: "Data Analytics Certification",
      organization: "NoviTech",
      date: "2024",
      type: "Professional",
      description: "Comprehensive training in data analysis techniques and statistical methods",
      skills: ["SQL", "Python", "Statistics", "Data Visualization"],
      status: "Completed"
    },
    {
      title: "Power BI Certification",
      organization: "Newton School & OfficeMaster",
      date: "2023",
      type: "Professional",
      description: "Advanced Power BI dashboard creation and business intelligence solutions",
      skills: ["Power BI", "DAX", "Data Modeling", "Business Intelligence"],
      status: "Completed"
    },
    {
      title: "AI Tools & ChatGPT Mastery",
      organization: "be10x",
      date: "2023",
      type: "Specialized",
      description: "Expertise in leveraging AI tools for productivity and automation",
      skills: ["AI Tools", "ChatGPT", "Automation", "Prompt Engineering"],
      status: "Completed"
    },
    {
      title: "Web Readiness Certification",
      organization: "Study Comrade x Startup India",
      date: "2023",
      type: "Government",
      description: "Digital readiness and web technologies for startups and entrepreneurs",
      skills: ["Web Development", "Digital Marketing", "Startup Ecosystem"],
      status: "Completed"
    },
    {
      title: "Excel with AI",
      organization: "OfficeMaster",
      date: "2023",
      type: "Professional",
      description: "Advanced Excel techniques enhanced with AI capabilities",
      skills: ["Excel", "AI Integration", "Data Analysis", "Automation"],
      status: "Completed"
    },
    {
      title: "Business Visualization",
      organization: "Forage",
      date: "2023",
      type: "Virtual",
      description: "Virtual experience in business data visualization and reporting",
      skills: ["Data Visualization", "Business Analytics", "Reporting"],
      status: "Completed"
    }
  ];

  const [certifications, setCertifications] = usePersistentStorage('portfolio_certifications', defaultCertifications);

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

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      "Internship": "bg-blue-100 text-blue-800",
      "Professional": "bg-green-100 text-green-800",
      "Specialized": "bg-purple-100 text-purple-800",
      "Government": "bg-orange-100 text-orange-800",
      "Virtual": "bg-pink-100 text-pink-800"
    };
    return colorMap[type] || "bg-gray-100 text-gray-800";
  };

  const handleViewCertificate = (cert: any) => {
    setSelectedCertificate(cert);
    setIsViewerOpen(true);
  };

  const handleEditCertificate = (cert: any, index: number) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to edit certificates.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingCertificate({ ...cert, index });
    setIsEditOpen(true);
  };

  const handleUpdateCertificate = (updatedCertificate: any) => {
    const index = editingCertificate?.index;
    if (index !== undefined) {
      setCertifications(prev => {
        const newCerts = [...prev];
        newCerts[index] = updatedCertificate;
        return newCerts;
      });
      toast({
        title: "Certificate updated",
        description: "The certificate has been updated successfully"
      });
    }
  };

  const handleDeleteCertificate = (index: number) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to delete certificates.",
        variant: "destructive",
      });
      return;
    }
    
    setCertifications(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Certificate deleted",
      description: "The certificate has been removed successfully"
    });
  };

  const handleUploadCertificate = (newCertificate: any) => {
    setCertifications(prev => [newCertificate, ...prev]);
    toast({
      title: "Certificate added",
      description: "The new certificate has been added successfully"
    });
  };

  const handleAddCertificate = () => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to add certificates.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploadOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(22)].map((_, i) => (
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
        
        {/* Interactive gradient orbs */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-white/20 to-purple-200/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.4}px)`,
            top: '-10%',
            right: '-10%'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-l from-white/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.4}px, ${mousePosition.y * 0.3}px)`,
            top: '40%',
            left: '-15%'
          }}
        />
        <div 
          className="absolute w-72 h-72 bg-gradient-to-br from-pink-200/20 to-white/10 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000 ease-out"
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
              <Trophy className="h-8 w-8 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-lg tracking-wide uppercase">Achievements</span>
              <Trophy className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 relative">
              <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Certifications
              </span>
              <br />
              <span className="text-white">& Training</span>
              
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-44 h-1 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full"></div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                Continuous learning and professional development across emerging technologies
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Star className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Verified Skills</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Target className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Industry-Ready</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Continuous Growth</span>
                </div>
              </div>

              {/* Upload Certificate Button - Only show in edit mode */}
              {isEditMode && isAuthenticated && (
                <Button 
                  onClick={handleAddCertificate}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Certificate
                </Button>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className={`grid md:grid-cols-4 gap-6 mb-12 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Card className="text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{certifications.length}</div>
                <div className="text-gray-700">Total Certifications</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">5</div>
                <div className="text-gray-700">Organizations</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">2024</div>
                <div className="text-gray-700">Latest Completion</div>
              </CardContent>
            </Card>
            <Card className="text-center shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">15+</div>
                <div className="text-gray-700">Skills Acquired</div>
              </CardContent>
            </Card>
          </div>

          {/* Certifications Timeline */}
          <div className="space-y-8">
            {certifications.map((cert, index) => (
              <Card 
                key={index}
                className={`group hover:scale-102 transition-all duration-300 shadow-lg hover:shadow-xl border-0 bg-white/90 backdrop-blur-sm transform ${
                  isVisible ? 'translate-x-0 opacity-100' : `${index % 2 === 0 ? '-translate-x-12' : 'translate-x-12'} opacity-0`
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {cert.title}
                        </CardTitle>
                        <p className="text-lg text-gray-600 font-medium">{cert.organization}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getTypeColor(cert.type)}>
                        {cert.type}
                      </Badge>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="mr-1 h-4 w-4" />
                        {cert.date}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {cert.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs bg-indigo-50 text-indigo-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={cert.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {cert.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewCertificate(cert)}
                        className="flex items-center hover:scale-105 transform duration-200"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      {isEditMode && isAuthenticated && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCertificate(cert, index)}
                            className="flex items-center hover:scale-105 transform duration-200"
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCertificate(index)}
                            className="flex items-center hover:scale-105 transform duration-200 text-red-600 hover:text-red-800 border-red-300 hover:border-red-500"
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Delete
                          </Button>
                        </>
                      )}
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors text-sm hover:scale-105 transform duration-200">
                        <ExternalLink className="mr-1 h-4 w-4" />
                        Verify
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Goals */}
          <Card className={`mt-16 shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform transition-all duration-1000 delay-1000 hover:scale-105 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center flex items-center justify-center">
                <Target className="h-8 w-8 mr-3" />
                Upcoming Learning Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300">
                    <Award className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Advanced AI/ML</h3>
                  <p className="text-gray-600 text-sm">Deep learning frameworks and neural networks</p>
                </div>
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cloud Computing</h3>
                  <p className="text-gray-600 text-sm">AWS, Azure, and cloud architecture</p>
                </div>
                <div className="text-center group hover:scale-105 transition-all duration-300">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">DevOps</h3>
                  <p className="text-gray-600 text-sm">CI/CD, containerization, and automation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateViewer
        certificate={selectedCertificate}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedCertificate(null);
        }}
      />

      {/* Certificate Upload Modal */}
      <CertificateUpload
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadCertificate}
      />

      {/* Certificate Edit Modal */}
      <CertificateEdit
        certificate={editingCertificate}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingCertificate(null);
        }}
        onUpdate={handleUpdateCertificate}
      />
    </div>
  );
};

export default Certifications;
