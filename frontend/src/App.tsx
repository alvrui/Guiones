// Main App component with routing and layout
import { useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProjectPage } from "./pages/ProjectPage";
import { CharactersPage } from "./pages/CharactersPage";
import { NarrativesPage } from "./pages/NarrativesPage";
import { PlotsPage } from "./pages/PlotsPage";
import { StructurePage } from "./pages/StructurePage";
import { GraphPage } from "./pages/GraphPage";
import { NotificationContainer } from "./components/Notification";
import { NotificationProvider, useNotifications } from "./contexts/NotificationContext";
import { useProject } from "./hooks/useProject";
import { useGlobalActions } from "./hooks/useGlobalActions";

// Sidebar component
const Sidebar = ({
  onExport,
  onImport,
  onSaveAll,
  isSaving,
}: {
  onExport: () => void;
  onImport: () => void;
  onSaveAll: () => void;
  isSaving: boolean;
}) => {
  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle import button click
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Guiones</h1>
        <p className="text-sm text-gray-500">Creador de guiones con IA</p>
      </div>
      
      <nav className="space-y-2">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Navegaci\u00f3n
        </div>
        <a
          href="/"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udcc1</span>
          <span>Proyectos</span>
        </a>
        <a
          href="/personajes"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udc65</span>
          <span>Personajes</span>
        </a>
        <a
          href="/narrativas"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udcd6</span>
          <span>Narrativas</span>
        </a>
        <a
          href="/tramas"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83c\udfad</span>
          <span>Tramas</span>
        </a>
        <a
          href="/estructura"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udcdc</span>
          <span>Estructura</span>
        </a>
        <a
          href="/grafo"
          className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udd17</span>
          <span>Grafo</span>
        </a>
      </nav>

      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Acciones
        </div>
        <button
          onClick={onSaveAll}
          disabled={isSaving}
          className={`w-full flex items-center justify-center gap-2 p-2 text-white rounded transition-colors ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSaving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span>\ud83d\udcbe</span>
              <span>Guardar Todo</span>
            </>
          )}
        </button>
        
        {/* Hidden file input for import */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
        
        <button
          onClick={handleImportClick}
          className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udce5</span>
          <span>Importar</span>
        </button>
        
        <button
          onClick={onExport}
          className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
        >
          <span>\ud83d\udce4</span>
          <span>Exportar</span>
        </button>
      </div>
    </div>
  );
};

// Main content area
const MainContent = () => {
  const { proyectoActual } = useProject();
  const { addNotification } = useNotifications();

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
          <p className="font-medium">\u26a0\ufe0f Selecciona un proyecto primero</p>
          <p className="text-sm mt-1">
            Ve a la pesta\u00f1a "Proyectos" y selecciona o crea un proyecto para poder trabajar con {window.location.pathname.substring(1)}.
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
        notifications={[]}
        onDismiss={() => {}}
      />
    </div>
  );
};

// Inner App component that uses the notification context
const InnerApp = () => {
  const { proyectoActual } = useProject();
  const { addNotification } = useNotifications();
  const { exportProject, importProject, saveAll, loading: actionsLoading, error } = useGlobalActions();

  // Show error notifications
  useCallback(() => {
    if (error) {
      addNotification("error", error);
    }
  }, [error, addNotification]);

  // Handle export
  const handleExport = useCallback(async () => {
    if (!proyectoActual) {
      addNotification("warning", "Selecciona un proyecto primero");
      return;
    }

    const blob = await exportProject(proyectoActual.id);
    if (blob) {
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${proyectoActual.titulo.replace(/\s+/g, "_")}_guion.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification("success", `Proyecto "${proyectoActual.titulo}" exportado correctamente`);
    }
  }, [proyectoActual, exportProject, addNotification]);

  // Handle import
  const handleImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const proyecto = await importProject(file);
    if (proyecto) {
      addNotification("success", `Proyecto "${proyecto.titulo}" importado correctamente`);
      // Reload the page to see the new project
      setTimeout(() => window.location.reload(), 1500);
    }
    
    // Reset file input
    event.target.value = "";
  }, [importProject, addNotification]);

  // Handle save all
  const handleSaveAll = useCallback(async () => {
    await saveAll();
    addNotification("success", "Todos los cambios guardados correctamente");
  }, [saveAll, addNotification]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onExport={handleExport}
        onImport={handleImport}
        onSaveAll={handleSaveAll}
        isSaving={actionsLoading}
      />
      <MainContent />
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <NotificationProvider>
        <InnerApp />
      </NotificationProvider>
    </Router>
  );
};

export default App;
