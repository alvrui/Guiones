// Main App component with routing and layout
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProjectPage } from "./pages/ProjectPage";
import { CharactersPage } from "./pages/CharactersPage";
import { NarrativesPage } from "./pages/NarrativesPage";
import { PlotsPage } from "./pages/PlotsPage";
import { StructurePage } from "./pages/StructurePage";
import { GraphPage } from "./pages/GraphPage";
import { NotificationContainer } from "./components/Notification";
import { useProject } from "./hooks/useProject";

// Tab type
type Tab = "proyecto" | "personajes" | "narrativas" | "tramas" | "estructura" | "grafo";

// Sidebar component
const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guiones</h1>
        <p className="text-sm text-gray-500">Creador de guiones con IA</p>
      </div>
      
      <nav className="space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Navegación
        </div>
        <a
          href="/"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>📁</span>
          <span>Proyectos</span>
        </a>
        <a
          href="/personajes"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>👥</span>
          <span>Personajes</span>
        </a>
        <a
          href="/narrativas"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>📖</span>
          <span>Narrativas</span>
        </a>
        <a
          href="/tramas"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>🎭</span>
          <span>Tramas</span>
        </a>
        <a
          href="/estructura"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>📜</span>
          <span>Estructura</span>
        </a>
        <a
          href="/grafo"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>🔗</span>
          <span>Grafo</span>
        </a>
      </nav>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Acciones
        </div>
        <button className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors">
          <span>💾</span>
          <span>Guardar Todo</span>
        </button>
        <button className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors">
          <span>📥</span>
          <span>Importar</span>
        </button>
        <button className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors">
          <span>📤</span>
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
};

// Main content area
const MainContent = () => {
  const { proyectoActual } = useProject();
  const [notifications, setNotifications] = useState<{id: string; type: "success" | "error" | "info" | "warning"; message: string}[]>([]);

  // Add notification
  const addNotification = (type: "success" | "error" | "info" | "warning", message: string) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message }]);
  };

  // Dismiss notification
  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Check if we should show a warning about no project selected
  const showProjectWarning = !proyectoActual && (
    window.location.pathname !== "/" &&
    !window.location.pathname.startsWith("/proyecto")
  );

  return (
    <div className="flex-1 p-4 overflow-auto">
      {/* Project warning */}
      {showProjectWarning && (
        <div className="mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
          <p className="font-medium">⚠️ Selecciona un proyecto primero</p>
          <p className="text-sm mt-1">
            Ve a la pestaña "Proyectos" y selecciona o crea un proyecto para poder trabajar con {window.location.pathname.substring(1)}.
          </p>
        </div>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<ProjectPage />} />
        <Route path="/personajes" element={<CharactersPage />} />
        <Route path="/narrativas" element={<NarrativesPage />} />
        <Route path="/tramas" element={<PlotsPage />} />
        <Route path="/estructura" element={<StructurePage />} />
        <Route path="/grafo" element={<GraphPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <MainContent />
      </div>
    </Router>
  );
};

export default App;
