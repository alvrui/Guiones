// GraphView component for visualizing project relationships
import { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Proyecto, Personaje, Narrativa, Trama, EstructuraNarrativa, GraphNode, GraphLink } from "../types";

interface GraphViewProps {
  proyecto: Proyecto;
  personajes: Personaje[];
  narrativas: Narrativa[];
  tramas: Trama[];
  estructuras: EstructuraNarrativa[];
  className?: string;
}

// Color mapping for node types
const nodeColors: Record<string, string> = {
  proyecto: "#FF6B6B",    // Red
  personaje: "#4ECDC4",   // Teal
  narrativa: "#45B7D1",   // Blue
  trama: "#96CEB4",      // Green
  escena: "#FFEAA7",     // Yellow
};

// Color mapping for link types
const linkColors: Record<string, string> = {
  pertenece_a: "#777777",      // Gray
  involucra_a: "#4ECDC4",     // Teal
  referencia_a: "#FF6B6B",     // Red
};

export const GraphView = ({
  proyecto,
  personajes,
  narrativas,
  tramas,
  estructuras,
  className = "",
}: GraphViewProps) => {
  // Create nodes from all entities
  const nodes: GraphNode[] = useMemo(() => {
    const result: GraphNode[] = [];

    // Add project node
    result.push({
      id: proyecto.id,
      name: proyecto.titulo,
      type: "proyecto",
    });

    // Add character nodes
    personajes.forEach((p) => {
      result.push({
        id: p.id,
        name: p.nombre,
        type: "personaje",
      });
    });

    // Add narrative nodes
    narrativas.forEach((n) => {
      result.push({
        id: n.id,
        name: n.titulo,
        type: "narrativa",
      });
    });

    // Add plot nodes
    tramas.forEach((t) => {
      result.push({
        id: t.id,
        name: t.titulo,
        type: "trama",
      });
    });

    // Add scene nodes (only Escena type)
    estructuras.forEach((e) => {
      if (e.tipo === "Escena") {
        result.push({
          id: e.id,
          name: e.titulo,
          type: "escena",
        });
      }
    });

    return result;
  }, [proyecto, personajes, narrativas, tramas, estructuras]);

  // Create links between entities
  const links: GraphLink[] = useMemo(() => {
    const result: GraphLink[] = [];

    // Characters belong to project
    personajes.forEach((p) => {
      result.push({
        source: p.id,
        target: proyecto.id,
        type: "pertenece_a",
      });
    });

    // Narratives belong to project
    narrativas.forEach((n) => {
      result.push({
        source: n.id,
        target: proyecto.id,
        type: "pertenece_a",
      });
    });

    // Plots belong to project
    tramas.forEach((t) => {
      result.push({
        source: t.id,
        target: proyecto.id,
        type: "pertenece_a",
      });
    });

    // Scenes belong to project
    estructuras.forEach((e) => {
      result.push({
        source: e.id,
        target: proyecto.id,
        type: "pertenece_a",
      });
    });

    // Plots involve characters
    tramas.forEach((t) => {
      if (t.personajes_involucrados) {
        t.personajes_involucrados.forEach((personajeId) => {
          // Skip if it's a marker for deleted character
          if (!personajeId.startsWith("[PERSONAJE BORRADO")) {
            result.push({
              source: t.id,
              target: personajeId,
              type: "involucra_a",
            });
          }
        });
      }
    });

    // Narratives involve characters
    narrativas.forEach((n) => {
      if (n.personajes_involucrados) {
        n.personajes_involucrados.forEach((personajeId) => {
          if (!personajeId.startsWith("[PERSONAJE BORRADO")) {
            result.push({
              source: n.id,
              target: personajeId,
              type: "involucra_a",
            });
          }
        });
      }
    });

    // Scenes involve characters
    estructuras.forEach((e) => {
      if (e.tipo === "Escena" && e.personajes_involucrados) {
        e.personajes_involucrados.forEach((personajeId) => {
          if (!personajeId.startsWith("[PERSONAJE BORRADO")) {
            result.push({
              source: e.id,
              target: personajeId,
              type: "involucra_a",
            });
          }
        });
      }
    });

    // Scenes reference plots
    estructuras.forEach((e) => {
      if (e.tipo === "Escena" && e.elementos_narrativos) {
        e.elementos_narrativos.forEach((tramaId) => {
          if (!tramaId.startsWith("[TRAMA BORRADA")) {
            result.push({
              source: e.id,
              target: tramaId,
              type: "referencia_a",
            });
          }
        });
      }
    });

    // Plots reference subplots
    tramas.forEach((t) => {
      if (t.subtramas) {
        t.subtramas.forEach((subtramaId) => {
          if (!subtramaId.startsWith("[TRAMA BORRADA")) {
            result.push({
              source: t.id,
              target: subtramaId,
              type: "referencia_a",
            });
          }
        });
      }
    });

    return result;
  }, [proyecto, personajes, narrativas, tramas, estructuras]);

  // Node canvas object for custom rendering
  const nodeCanvasObject = (node: GraphNode, ctx: CanvasRenderingContext2D) => {
    // Draw node circle
    const color = nodeColors[node.type as keyof typeof nodeColors] || "#CCCCCC";
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, 10, 0, 2 * Math.PI);
    ctx.fill();

    // Draw node label
    ctx.fillStyle = "#333333";
    ctx.font = "10px Sans-Serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Truncate long names
    const maxLength = 20;
    const displayName = node.name.length > maxLength 
      ? node.name.substring(0, maxLength - 3) + "..." 
      : node.name;
    
    ctx.fillText(displayName, node.x || 0, (node.y || 0) + 15);
  };

  // Link canvas object for custom rendering
  const linkCanvasObject = (link: GraphLink, ctx: CanvasRenderingContext2D) => {
    const color = linkColors[link.type as keyof typeof linkColors] || "#999999";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(link.source.x || 0, link.source.y || 0);
    ctx.lineTo(link.target.x || 0, link.target.y || 0);
    ctx.stroke();

    // Draw arrow head
    if (link.source.x && link.source.y && link.target.x && link.target.y) {
      const headLength = 6;
      const angle = Math.atan2(
        (link.target.y || 0) - (link.source.y || 0),
        (link.target.x || 0) - (link.source.x || 0)
      );
      
      ctx.beginPath();
      ctx.moveTo(link.target.x || 0, link.target.y || 0);
      ctx.lineTo(
        (link.target.x || 0) - headLength * Math.cos(angle - Math.PI / 6),
        (link.target.y || 0) - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(link.target.x || 0, link.target.y || 0);
      ctx.lineTo(
        (link.target.x || 0) - headLength * Math.cos(angle + Math.PI / 6),
        (link.target.y || 0) - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
  };

  // Handle node click
  const handleNodeClick = (node: GraphNode) => {
    console.log("Node clicked:", node);
    // You can implement navigation or selection logic here
  };

  // Handle link click
  const handleLinkClick = (link: GraphLink) => {
    console.log("Link clicked:", link);
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {nodes.length > 0 && (
        <ForceGraph2D
          graphData={{ nodes, links }}
          nodeLabel="name"
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          onNodeClick={handleNodeClick}
          onLinkClick={handleLinkClick}
          nodePointerAreaPaint={(node, color) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x || 0, node.y || 0, 15, 0, 2 * Math.PI);
            ctx.fill();
          }}
          zoomToFit={500}
        />
      )}
      
      {nodes.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          <p>No hay datos para mostrar en el grafo</p>
        </div>
      )}
    </div>
  );
};

export default GraphView;
