
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (certificate: any) => void;
}

const CertificateUpload = ({ isOpen, onClose, onUpload }: CertificateUploadProps) => {
  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    date: "",
    type: "Professional",
    description: "",
    skills: "",
    imageFile: null as File | null,
    pdfFile: null as File | null
  });
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (files: FileList | null, type: 'image' | 'pdf') => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validPdfTypes = ['application/pdf'];
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or JPG image",
        variant: "destructive"
      });
      return;
    }
    
    if (type === 'pdf' && !validPdfTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      [type === 'image' ? 'imageFile' : 'pdfFile']: file 
    }));
  };

  const addSkill = () => {
    if (formData.skills.trim() && !skillsList.includes(formData.skills.trim())) {
      setSkillsList(prev => [...prev, formData.skills.trim()]);
      setFormData(prev => ({ ...prev, skills: "" }));
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsList(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.organization || !formData.date) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create URLs for uploaded files (in a real app, you'd upload to a server)
    const imageUrl = formData.imageFile ? URL.createObjectURL(formData.imageFile) : undefined;
    const pdfUrl = formData.pdfFile ? URL.createObjectURL(formData.pdfFile) : undefined;

    const newCertificate = {
      title: formData.title,
      organization: formData.organization,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      skills: skillsList,
      status: "Completed",
      imageUrl,
      pdfUrl
    };

    onUpload(newCertificate);
    
    // Reset form
    setFormData({
      title: "",
      organization: "",
      date: "",
      type: "Professional",
      description: "",
      skills: "",
      imageFile: null,
      pdfFile: null
    });
    setSkillsList([]);
    
    toast({
      title: "Certificate uploaded",
      description: "Your certificate has been added successfully"
    });
    
    onClose();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files, 'image');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload New Certificate</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certificate Title *</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AWS Cloud Practitioner"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Organization *</label>
              <Input
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="e.g., Amazon Web Services"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="Professional">Professional</option>
                <option value="Specialized">Specialized</option>
                <option value="Government">Government</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the certification..."
              rows={3}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium mb-2">Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Add a skill..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Certificate Image</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => (e.preventDefault(), setDragOver(true))}
                onDragLeave={() => setDragOver(false)}
              >
                <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {formData.imageFile ? formData.imageFile.name : "Drag and drop an image, or click to select"}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files, 'image')}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PDF Certificate (Optional)</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(e.target.files, 'pdf')}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('pdf-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload PDF
                </Button>
                {formData.pdfFile && (
                  <span className="text-sm text-gray-600">{formData.pdfFile.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Upload Certificate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateUpload;
