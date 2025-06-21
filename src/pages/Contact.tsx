
import { useState } from "react";
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
import { Mail, Linkedin, Github, MapPin, Send, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { usePersistentStorage } from "@/hooks/usePersistentStorage";
import emailjs from '@emailjs/browser';

interface ContactMethodData {
  id: number;
  iconName: string;
  title: string;
  value: string;
  href: string;
  color: string;
}

interface ContactMethod extends ContactMethodData {
  icon: any;
}

const Contact = () => {
  const { isEditMode, isAuthenticated } = useEditModeContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactMethod | null>(null);
  const [contactForm, setContactForm] = useState({
    title: '',
    value: '',
    href: '',
    color: 'blue',
    iconName: 'Mail'
  });
  const { toast } = useToast();

  emailjs.init("55CVjW3UXMY9RvWEj");

  const iconOptions = [
    { name: 'Mail', component: Mail },
    { name: 'Linkedin', component: Linkedin },
    { name: 'Github', component: Github },
    { name: 'MapPin', component: MapPin },
  ];

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.name === iconName);
    return iconOption ? iconOption.component : Mail;
  };

  const defaultContactMethodsData: ContactMethodData[] = [
    {
      id: 1,
      iconName: 'Mail',
      title: "Email",
      value: "dineshkumar22106007@gmail.com",
      href: "mailto:dineshkumar22106007@gmail.com",
      color: "blue"
    },
    {
      id: 2,
      iconName: 'Linkedin',
      title: "LinkedIn",
      value: "Connect with me",
      href: "https://linkedin.com",
      color: "blue"
    },
    {
      id: 3,
      iconName: 'Github',
      title: "GitHub",
      value: "View my repositories",
      href: "https://github.com",
      color: "gray"
    },
    {
      id: 4,
      iconName: 'MapPin',
      title: "Location",
      value: "Tamil Nadu, India",
      href: "#",
      color: "green"
    }
  ];

  const [contactMethodsData, setContactMethodsData] = usePersistentStorage<ContactMethodData[]>('contact_methods', defaultContactMethodsData);

  // Convert stored data to contact methods with icon components
  const contactMethods: ContactMethod[] = contactMethodsData.map(method => ({
    ...method,
    icon: getIconComponent(method.iconName)
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        "service_mityeeo",
        "template_o8jbcbs",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_name: "Dinesh Kumar",
        }
      );

      console.log('Email sent successfully:', result);
      
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Failed to send email:', error);
      
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditContact = (contact: ContactMethod) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to modify contact methods.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingContact(contact);
    setContactForm({
      title: contact.title,
      value: contact.value,
      href: contact.href,
      color: contact.color,
      iconName: contact.iconName
    });
    setIsEditContactOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to delete contact methods.",
        variant: "destructive",
      });
      return;
    }
    
    setContactMethodsData(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Method Deleted",
      description: "The contact method has been successfully removed.",
    });
  };

  const handleAddContact = () => {
    if (!isEditMode || !isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please login as admin and enable edit mode to add contact methods.",
        variant: "destructive",
      });
      return;
    }
    
    setContactForm({
      title: '',
      value: '',
      href: '',
      color: 'blue',
      iconName: 'Mail'
    });
    setIsAddContactOpen(true);
  };

  const handleSaveContact = () => {
    if (!contactForm.title.trim() || !contactForm.value.trim()) {
      toast({
        title: "Error",
        description: "Title and value are required.",
        variant: "destructive",
      });
      return;
    }

    const contactData: Omit<ContactMethodData, 'id'> = {
      title: contactForm.title.trim(),
      value: contactForm.value.trim(),
      href: contactForm.href.trim(),
      color: contactForm.color,
      iconName: contactForm.iconName
    };

    if (editingContact) {
      setContactMethodsData(prev => prev.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...contactData }
          : contact
      ));
      toast({
        title: "Contact Method Updated",
        description: "The contact method has been successfully updated.",
      });
    } else {
      const newContact: ContactMethodData = {
        ...contactData,
        id: Math.max(...contactMethodsData.map(c => c.id), 0) + 1
      };
      setContactMethodsData(prev => [...prev, newContact]);
      toast({
        title: "Contact Method Added",
        description: "The new contact method has been successfully added.",
      });
    }

    setIsEditContactOpen(false);
    setIsAddContactOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Let's Connect
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to collaborate on exciting projects or discuss opportunities? I'd love to hear from you!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center">
                  <Send className="mr-3 h-6 w-6 text-blue-600" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="Your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full"
                        placeholder="your.email@example.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="What's this about?"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Tell me about your project or opportunity..."
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white disabled:opacity-50"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-gray-900">
                      Get in Touch
                    </CardTitle>
                    {isEditMode && isAuthenticated && (
                      <Button
                        onClick={handleAddContact}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Contact
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    I'm always excited to discuss new opportunities, collaborate on innovative projects, 
                    or simply connect with fellow tech enthusiasts. Whether you have a project in mind, 
                    want to explore potential partnerships, or just want to say hello, don't hesitate to reach out!
                  </p>
                  
                  <div className="space-y-4">
                    {contactMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div key={method.id} className="relative group">
                          <a
                            href={method.href}
                            className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors w-full"
                          >
                            <div className={`p-3 rounded-full mr-4 bg-gradient-to-r ${
                              method.color === 'blue' ? 'from-blue-400 to-blue-600' :
                              method.color === 'gray' ? 'from-gray-400 to-gray-600' :
                              'from-green-400 to-green-600'
                            } text-white`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {method.title}
                              </div>
                              <div className="text-gray-600">{method.value}</div>
                            </div>
                          </a>
                          {isEditMode && isAuthenticated && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditContact(method);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteContact(method.id);
                                }}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">&lt; 24h</div>
                      <div className="text-sm text-gray-600">Email Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">100%</div>
                      <div className="text-sm text-gray-600">Response Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">
                    Current Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Open for new projects</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Currently available for freelance projects, internships, and full-time opportunities. 
                    Let's discuss how we can work together!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Contact Method Modal */}
      <Dialog open={isEditContactOpen || isAddContactOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditContactOpen(false);
          setIsAddContactOpen(false);
          setEditingContact(null);
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContact ? 'Edit Contact Method' : 'Add Contact Method'}</DialogTitle>
            <DialogDescription>
              {editingContact ? 'Update contact method details' : 'Add a new way for people to contact you'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-title" className="text-right">Title</Label>
              <Input
                id="contact-title"
                value={contactForm.title}
                onChange={(e) => setContactForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
                placeholder="e.g., Email, Phone, LinkedIn"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-value" className="text-right">Value</Label>
              <Input
                id="contact-value"
                value={contactForm.value}
                onChange={(e) => setContactForm(prev => ({ ...prev, value: e.target.value }))}
                className="col-span-3"
                placeholder="Display text"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-href" className="text-right">Link</Label>
              <Input
                id="contact-href"
                value={contactForm.href}
                onChange={(e) => setContactForm(prev => ({ ...prev, href: e.target.value }))}
                className="col-span-3"
                placeholder="URL or link"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-color" className="text-right">Color</Label>
              <select
                id="contact-color"
                value={contactForm.color}
                onChange={(e) => setContactForm(prev => ({ ...prev, color: e.target.value }))}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="blue">Blue</option>
                <option value="gray">Gray</option>
                <option value="green">Green</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact-icon" className="text-right">Icon</Label>
              <select
                id="contact-icon"
                value={contactForm.iconName}
                onChange={(e) => setContactForm(prev => ({ ...prev, iconName: e.target.value }))}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {iconOptions.map(option => (
                  <option key={option.name} value={option.name}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditContactOpen(false);
              setIsAddContactOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact}>
              {editingContact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;
