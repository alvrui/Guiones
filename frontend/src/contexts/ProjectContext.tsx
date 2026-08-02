// ProjectContext for sharing project state across the application
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Proyecto } from "../types";

interface ProjectContextType {
  proyectoActual: Proyecto | null;
  setProyectoActual: (proyecto: Proyecto | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const [proyectoActual, setProyectoActual] = useState<Proyecto | null>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("proyectoActual");
    return saved ? JSON.parse(saved) : null;
  });

  // Save to localStorage when project changes
  useEffect(() => {
    if (proyectoActual) {
      localStorage.setItem("proyectoActual", JSON.stringify(proyectoActual));
    } else {
      localStorage.removeItem("proyectoActual");
    }
  }, [proyectoActual]);

  return (
    <ProjectContext.Provider value={{ proyectoActual, setProyectoActual }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
