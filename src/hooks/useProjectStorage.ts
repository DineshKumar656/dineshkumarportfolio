
import { useState, useEffect } from 'react';

export interface Project {
  id: number;
  title: string;
  iconName: string;
  description: string;
  longDescription: string;
  briefDescription: string;
  tech: string[];
  image: string;
  video?: string;
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

export const useProjectStorage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Default projects data
  const defaultProjects: Project[] = [
    {
      id: 1,
      title: "Smart Irrigation System Using AI",
      iconName: "Sprout",
      description: "AI-powered irrigation system with Firebase integration and Telegram notifications for optimal crop watering.",
      longDescription: "Developed an intelligent irrigation system that uses AI algorithms to analyze soil moisture, weather data, and crop requirements. The system automatically controls water distribution and sends real-time updates via Telegram bot. Firebase backend ensures reliable data storage and synchronization.",
      briefDescription: "AI-powered smart irrigation with automated watering control",
      tech: ["Python", "AI/ML", "Firebase", "Telegram API", "IoT Sensors"],
      image: "/api/placeholder/400/250",
      demoUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "IoT Water Level Indicator",
      iconName: "Droplets",
      description: "Smart water level monitoring system with OLED display and Blynk cloud integration for remote monitoring.",
      longDescription: "Created a comprehensive water level monitoring solution using ultrasonic sensors, OLED displays, and cloud connectivity. Users can monitor water levels remotely through the Blynk mobile app and receive alerts when levels are critically low or high.",
      briefDescription: "Real-time water level monitoring with mobile alerts",
      tech: ["ESP32", "Blynk", "OLED", "Ultrasonic Sensors", "IoT"],
      image: "/api/placeholder/400/250",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 3,
      title: "Smart Traffic Light System",
      iconName: "TrafficCone",
      description: "Intelligent traffic management system using Wokwi simulation and ThingSpeak for traffic flow optimization.",
      longDescription: "Designed and simulated a smart traffic light system that adapts to real-time traffic conditions. The system uses sensors to detect vehicle density and adjusts light timing accordingly, reducing wait times and improving traffic flow efficiency.",
      briefDescription: "Adaptive traffic control system for improved flow",
      tech: ["Wokwi", "ThingSpeak", "Arduino", "Traffic Simulation", "IoT"],
      image: "/api/placeholder/400/250",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "Heavy Vehicle Monitoring",
      iconName: "Truck",
      description: "Real-time heavy vehicle tracking and monitoring system with ESP32, Blynk integration, and alert mechanisms.",
      longDescription: "Developed a comprehensive monitoring system for heavy vehicles including GPS tracking, speed monitoring, and maintenance alerts. The system provides real-time dashboards for fleet managers and automatic notifications for unusual activities.",
      briefDescription: "GPS-based fleet tracking with maintenance alerts",
      tech: ["ESP32", "Blynk", "GPS", "Sensors", "Fleet Management"],
      image: "/api/placeholder/400/250",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 5,
      title: "AI Conversation Bot",
      iconName: "Bot",
      description: "Intelligent chatbot built with Python featuring natural language processing and context-aware responses.",
      longDescription: "Created an advanced conversational AI bot using Python and natural language processing libraries. The bot can understand context, maintain conversation flow, and provide intelligent responses across various topics.",
      briefDescription: "Context-aware chatbot with NLP capabilities",
      tech: ["Python", "NLP", "Machine Learning", "Chatbot", "AI"],
      image: "/api/placeholder/400/250",
      demoUrl: "#",
      githubUrl: "#",
      featured: false
    }
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('portfolio_projects');
      if (stored) {
        const parsedProjects = JSON.parse(stored);
        setProjects(Array.isArray(parsedProjects) ? parsedProjects : defaultProjects);
      } else {
        setProjects(defaultProjects);
        localStorage.setItem('portfolio_projects', JSON.stringify(defaultProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setProjects(defaultProjects);
    }
  }, []);

  const saveProjects = (updatedProjects: Project[]) => {
    try {
      setProjects(updatedProjects);
      localStorage.setItem('portfolio_projects', JSON.stringify(updatedProjects));
      console.log('Projects saved successfully');
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Math.max(...projects.map(p => p.id), 0) + 1
    };
    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    return newProject;
  };

  const updateProject = (id: number, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    );
    saveProjects(updatedProjects);
  };

  const deleteProject = (id: number) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    saveProjects(updatedProjects);
  };

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    saveProjects
  };
};
