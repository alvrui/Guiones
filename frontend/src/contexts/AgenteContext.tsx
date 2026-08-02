// AgenteContext for managing AI agent selection per section
import { createContext, useContext, useState, ReactNode } from "react";

interface AgenteContextType {
  agentesPorSeccion: Record<string, string>; // section -> agentId
  setAgenteSeleccionado: (seccion: string, agentId: string) => void;
  getAgenteSeleccionado: (seccion: string) => string | undefined;
}

const AgenteContext = createContext<AgenteContextType | undefined>(undefined);

interface AgenteProviderProps {
  children: ReactNode;
}

export const AgenteProvider = ({ children }: AgenteProviderProps) => {
  const [agentesPorSeccion, setAgentesPorSeccion] = useState<Record<string, string>>(() => {
    // Initialize from localStorage if available
    const saved = localStorage.getItem("agentesPorSeccion");
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage when agents change
  const setAgenteSeleccionado = (seccion: string, agentId: string) => {
    const nuevosAgentes = { ...agentesPorSeccion, [seccion]: agentId };
    setAgentesPorSeccion(nuevosAgentes);
    localStorage.setItem("agentesPorSeccion", JSON.stringify(nuevosAgentes));
  };

  const getAgenteSeleccionado = (seccion: string) => {
    return agentesPorSeccion[seccion];
  };

  return (
    <AgenteContext.Provider value={{ 
      agentesPorSeccion, 
      setAgenteSeleccionado, 
      getAgenteSeleccionado 
    }}>
      {children}
    </AgenteContext.Provider>
  );
};

export const useAgenteContext = () => {
  const context = useContext(AgenteContext);
  if (context === undefined) {
    throw new Error("useAgenteContext must be used within a AgenteProvider");
  }
  return context;
};
