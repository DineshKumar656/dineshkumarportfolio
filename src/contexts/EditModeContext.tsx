
import React, { createContext, useContext } from 'react';
import { useEditMode } from '@/hooks/useEditMode';

interface EditModeContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  authenticate: (password: string) => boolean;
  logout: () => void;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const editModeHook = useEditMode();

  return (
    <EditModeContext.Provider value={editModeHook}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditModeContext = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditModeContext must be used within an EditModeProvider');
  }
  return context;
};
