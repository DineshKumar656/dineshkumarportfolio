
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Certificate {
  title: string;
  organization: string;
  date: string;
  type: string;
  description: string;
  skills: string[];
  status: string;
  imageUrl?: string;
  pdfUrl?: string;
}

interface CertificateViewerProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateViewer = ({ certificate, isOpen, onClose }: CertificateViewerProps) => {
  const [imageError, setImageError] = useState(false);

  if (!certificate) return null;

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      "Professional": "bg-green-100 text-green-800",
      "Specialized": "bg-purple-100 text-purple-800",
      "Government": "bg-orange-100 text-orange-800",
      "Virtual": "bg-pink-100 text-pink-800"
    };
    return colorMap[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{certificate.title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Certificate Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Certificate Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">{certificate.organization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{certificate.date}</span>
                </div>
                <Badge className={getTypeColor(certificate.type)}>
                  {certificate.type}
                </Badge>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Skills Acquired</h3>
              <div className="flex flex-wrap gap-2">
                {certificate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{certificate.description}</p>
          </div>

          {/* Certificate Image/Preview */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Certificate Preview</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              {certificate.imageUrl && !imageError ? (
                <img 
                  src={certificate.imageUrl} 
                  alt={`${certificate.title} Certificate`}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Award className="h-16 w-16 text-gray-400" />
                  <div>
                    <p className="text-gray-500 mb-2">Certificate preview not available</p>
                    <p className="text-sm text-gray-400">Upload a certificate image to see it here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t">
            {certificate.pdfUrl && (
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Certificate
              </Button>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Verify Certificate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateViewer;
