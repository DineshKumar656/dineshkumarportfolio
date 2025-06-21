
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Cpu, Brain, Settings, Presentation, Database, Sparkles, Wrench, Lightbulb, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";

interface ServiceData {
  id: number;
  iconName: string; // Store icon name instead of component
  title: string;
  description: string;
  features: string[];
  color: string;
}

interface Service extends ServiceData {
  icon: any; // For backwards compatibility with existing code
}

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const { isEditMode } = useEditModeContext();

  const iconOptions = [
    { name: 'BarChart3', component: BarChart3 },
    { name: 'Cpu', component: Cpu },
    { name: 'Brain', component: Brain },
    { name: 'Settings', component: Settings },
    { name: 'Presentation', component: Presentation },
    { name: 'Database', component: Database }
  ];

  const getIconComponent = (iconName: string) => {
    return iconOptions.find(icon => icon.name === iconName)?.component || Settings;
  };

  const colorOptions = ['blue', 'green', 'purple', 'orange', 'pink', 'indigo'];

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

  // Use persistent storage for service data (without component references)
  const [serviceData, setServiceData] = usePersistentStorage<ServiceData[]>('portfolio_services', [
    {
      id: 1,
      iconName: 'BarChart3',
      title: "Data Visualization with BI Tools",
      description: "Transform raw data into compelling visual stories using Power BI, Tableau, and advanced Excel features.",
      features: [
        "Interactive dashboards and reports",
        "Real-time data monitoring",
        "Custom KPI tracking",
        "Automated reporting systems"
      ],
      color: "blue"
    },
    {
      id: 2,
      iconName: 'Cpu',
      title: "IoT & Sensor-Based Development",
      description: "Design and develop intelligent IoT solutions with real-time monitoring and cloud integration.",
      features: [
        "ESP32/NodeMCU programming",
        "Sensor integration and calibration",
        "Cloud connectivity (Firebase, Blynk)",
        "Mobile app integration"
      ],
      color: "green"
    },
    {
      id: 3,
      iconName: 'Brain',
      title: "AI Integration for Smart Systems",
      description: "Implement AI and machine learning algorithms to create intelligent decision-making systems.",
      features: [
        "Predictive analytics implementation",
        "AI model development and training",
        "Natural language processing",
        "Computer vision applications"
      ],
      color: "purple"
    },
    {
      id: 4,
      iconName: 'Settings',
      title: "Tech-Enabled Automation",
      description: "Build automated systems that streamline processes and improve operational efficiency.",
      features: [
        "Process automation solutions",
        "API development and integration",
        "Workflow optimization",
        "System monitoring and alerts"
      ],
      color: "orange"
    },
    {
      id: 5,
      iconName: 'Presentation',
      title: "AI-Enhanced Presentations",
      description: "Create impactful presentations and reports enhanced with AI-generated insights and visuals.",
      features: [
        "Data-driven storytelling",
        "Interactive presentation elements",
        "AI-powered content optimization",
        "Professional design and layout"
      ],
      color: "pink"
    },
    {
      id: 6,
      iconName: 'Database',
      title: "Database Design & Analytics",
      description: "Design efficient databases and implement analytics solutions for data-driven decision making.",
      features: [
        "Database architecture and design",
        "SQL query optimization",
        "Data pipeline development",
        "Performance analytics"
      ],
      color: "indigo"
    }
  ]);

  // Convert service data to services with icon components
  const services: Service[] = serviceData.map(data => ({
    ...data,
    icon: getIconComponent(data.iconName)
  }));

  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    features: '',
    color: 'blue',
    iconName: 'Settings'
  });

  const handleEditService = (service: Service) => {
    if (!isEditMode) {
      toast({
        title: "Edit Mode Disabled",
        description: "Please enable edit mode to modify content.",
        variant: "destructive",
      });
      return;
    }

    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      features: service.features.join('\n'),
      color: service.color,
      iconName: service.iconName
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteService = (id: number) => {
    if (!isEditMode) {
      toast({
        title: "Edit Mode Disabled",
        description: "Please enable edit mode to modify content.",
        variant: "destructive",
      });
      return;
    }

    setServiceData(prev => prev.filter(service => service.id !== id));
    toast({
      title: "Service Deleted",
      description: "The service has been successfully removed.",
    });
  };

  const handleSaveService = () => {
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newServiceData: ServiceData = {
      title: serviceForm.title.trim(),
      description: serviceForm.description.trim(),
      features: serviceForm.features.split('\n').map(f => f.trim()).filter(f => f),
      color: serviceForm.color,
      iconName: serviceForm.iconName,
      id: editingService ? editingService.id : Math.max(...serviceData.map(s => s.id)) + 1
    };

    if (editingService) {
      setServiceData(prev => prev.map(service => 
        service.id === editingService.id 
          ? newServiceData
          : service
      ));
      toast({
        title: "Service Updated",
        description: "The service has been successfully updated.",
      });
    } else {
      setServiceData(prev => [...prev, newServiceData]);
      toast({
        title: "Service Added",
        description: "The new service has been successfully added.",
      });
    }

    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setEditingService(null);
    setServiceForm({
      title: '',
      description: '',
      features: '',
      color: 'blue',
      iconName: 'Settings'
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
      indigo: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-blue-500 to-indigo-600 relative overflow-hidden">
      <Navigation />
      
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
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
          className="absolute w-72 h-72 bg-gradient-to-br from-gray-200/20 to-white/10 rounded-full blur-3xl animate-pulse delay-2000 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.3}px)`,
            bottom: '10%',
            right: '20%'
          }}
        />
      </div>
      
      <div className="pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced hero section */}
          <div className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Wrench className="h-8 w-8 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-lg tracking-wide uppercase">Professional Services</span>
              <Wrench className="h-8 w-8 text-white animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 relative">
              <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-100 bg-clip-text text-transparent">
                What I Can Offer
              </span>
              <br />
              <span className="text-white">Across Domains</span>
              
              {/* Decorative underline */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full"></div>
            </h1>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                Comprehensive technology solutions spanning data analytics, IoT development, and AI integration
              </p>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Lightbulb className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Innovative Solutions</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Cutting-Edge Tech</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Settings className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Custom Integration</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <Card 
                  key={service.id}
                  className={`group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border-0 bg-white/90 backdrop-blur-sm transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${getColorClasses(service.color)} text-white mb-4 w-fit group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      {/* Edit controls only show in edit mode */}
                      {isEditMode && (
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditService(service)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-gray-700 transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-700">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(service.color)} mr-3 mt-2 flex-shrink-0`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full bg-gradient-to-r ${getColorClasses(service.color)} text-white border-0 transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add New Service Button - Only show in edit mode */}
          {isEditMode && (
            <div className="text-center mb-8">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Service
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className={`mt-16 text-center transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Ready to Build Something Amazing?
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Let's collaborate to bring your ideas to life with cutting-edge technology solutions
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start a Project
                  </Button>
                  <Button variant="outline" className="px-8 py-3 text-lg border-2 border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Schedule Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Service Modal */}
      <Dialog open={isEditModalOpen || isAddModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditModalOpen(false);
          setIsAddModalOpen(false);
          setEditingService(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService ? 'Update service details' : 'Add a new service to your offerings'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-title" className="text-right">Title</Label>
              <Input
                id="service-title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="Service title"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="service-description" className="text-right mt-2">Description</Label>
              <Textarea
                id="service-description"
                value={serviceForm.description}
                onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                placeholder="Service description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="service-features" className="text-right mt-2">Features</Label>
              <Textarea
                id="service-features"
                value={serviceForm.features}
                onChange={(e) => setServiceForm(prev => ({ ...prev, features: e.target.value }))}
                className="col-span-3"
                placeholder="One feature per line"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-icon" className="text-right">Icon</Label>
              <Select value={serviceForm.iconName} onValueChange={(value) => setServiceForm(prev => ({ ...prev, iconName: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.name} value={icon.name}>
                      {icon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-color" className="text-right">Color</Label>
              <Select value={serviceForm.color} onValueChange={(value) => setServiceForm(prev => ({ ...prev, color: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setIsAddModalOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveService}>
              {editingService ? 'Update Service' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
