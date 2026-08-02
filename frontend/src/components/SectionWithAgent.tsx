// SectionWithAgent component - wrapper that adds agent selector to any section
import { ReactNode } from "react";
import { AgenteSelector } from "../pages/AgentesPage";
import { useAgenteContext } from "../contexts/AgenteContext";

interface SectionWithAgentProps {
  seccion: string;
  children: ReactNode;
  className?: string;
}

export const SectionWithAgent = ({
  seccion,
  children,
  className = "",
}: SectionWithAgentProps) => {
  const { getAgenteSeleccionado, setAgenteSeleccionado } = useAgenteContext();
  const agenteSeleccionadoId = getAgenteSeleccionado(seccion) || "";

  const handleAgentSelect = (agentId: string) => {
    setAgenteSeleccionado(seccion, agentId);
  };

  return (
    <div className={className}>
      {/* Agent Selector */}
      <div className="mb-4">
        <AgenteSelector
          seccion={seccion}
          agenteSeleccionadoId={agenteSeleccionadoId}
          onSelect={handleAgentSelect}
        />
      </div>
      
      {/* Children content */}
      {children}
    </div>
  );
};

export default SectionWithAgent;
