
import React, { useState } from 'react';
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
import { Switch } from "@/components/ui/switch";
import { Lock, Unlock, LogOut, Shield } from "lucide-react";
import { useEditModeContext } from "@/contexts/EditModeContext";
import { useToast } from "@/hooks/use-toast";

const EditModeToggle = () => {
  const { isEditMode, isAuthenticated, authenticate, logout, toggleEditMode } = useEditModeContext();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleAuthenticate = () => {
    if (authenticate(password)) {
      setIsAuthDialogOpen(false);
      setPassword('');
      toast({
        title: "Authentication Successful",
        description: "You can now enable edit mode to modify content.",
      });
    } else {
      toast({
        title: "Authentication Failed", 
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "Edit mode has been disabled and you've been logged out.",
    });
  };

  // Show Admin Login button when not authenticated - BOTTOM LEFT CORNER
  if (!isAuthenticated) {
    return (
      <>
        <Button
          onClick={() => setIsAuthDialogOpen(true)}
          variant="default"
          size="lg"
          className="fixed bottom-6 left-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm animate-pulse"
        >
          <Shield className="h-5 w-5 mr-2" />
          🔐 Admin Login
        </Button>

        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Admin Authentication Required</DialogTitle>
              <DialogDescription className="text-center">
                Enter the admin password to access edit mode and modify content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3 border-2"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuthenticate()}
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAuthDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAuthenticate} className="bg-blue-600 hover:bg-blue-700">
                🔓 Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show Edit Mode controls when authenticated - BOTTOM LEFT CORNER
  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center space-x-3 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-2xl border-2 border-gray-200">
      <div className="flex items-center space-x-2">
        {isEditMode ? (
          <Unlock className="h-4 w-4 text-green-600" />
        ) : (
          <Lock className="h-4 w-4 text-gray-600" />
        )}
        <Label htmlFor="edit-mode" className="text-sm font-medium">
          Edit Mode
        </Label>
        <Switch
          id="edit-mode"
          checked={isEditMode}
          onCheckedChange={toggleEditMode}
        />
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="h-8 px-3"
      >
        <LogOut className="h-3 w-3 mr-1" />
        Logout
      </Button>
    </div>
  );
};

export default EditModeToggle;
