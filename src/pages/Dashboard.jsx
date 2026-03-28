import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Sun, Moon, Maximize2, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import DigitalClock from '../components/orenstein/DigitalClock';
import ActiveTerminal from '../components/orenstein/ActiveTerminal';
import Sidebar from '../components/orenstein/Sidebar';

import AppCard from '../components/orenstein/AppCard';
import AppModal from '../components/orenstein/AppModal';
import WsModal from '../components/orenstein/WsModal';
import WorkspaceSettings from '../components/orenstein/WorkspaceSettings';
import AppViewer from '../components/orenstein/AppViewer';
import AppsPanel from '../components/orenstein/AppsPanel';
import KernelNotes from '../components/orenstein/KernelNotes';
import CategorySettings from '../components/orenstein/CategorySettings';
import CategoryModal from '../components/orenstein/CategoryModal';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("Aplicações");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeApp, setActiveApp] = useState(null);
  const [activeWsId, setActiveWsId] = useState(null);
  const [collapsedSectors, setCollapsedSectors] = useState({});

  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [wsToEdit, setWsToEdit] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const queryClient = useQueryClient();

  // --- DATA FETCHING ---
  const { data: workspaces = [], isLoading: wsLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => base44.entities.Workspace.list('-created_date'),
    initialData: [],
  });

  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ['apps'],
    queryFn: () => base44.entities.AppAsset.list('-created_date'),
    initialData: [],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list('order_index'),
    initialData: [],
  });

  // Auto-select first workspace
  React.useEffect(() => {
    if (!activeWsId && workspaces.length > 0) {
      setActiveWsId(workspaces[0].id);
    }
  }, [workspaces, activeWsId]);

  // --- MUTATIONS ---
  const createWsMutation = useMutation({
    mutationFn: (data) => base44.entities.Workspace.create(data),
    onSuccess: (newWs) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setActiveWsId(newWs.id);
      setIsWsModalOpen(false);
      setWsToEdit(null);
    },
  });

  const updateWsMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Workspace.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsWsModalOpen(false);
      setWsToEdit(null);
    },
  });

  const deleteWsMutation = useMutation({
    mutationFn: (id) => base44.entities.Workspace.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: ['apps'] });
    },
  });

  const createAppMutation = useMutation({
    mutationFn: (data) => base44.entities.AppAsset.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setIsAppModalOpen(false);
      setAppToEdit(null);
    },
  });

  const updateAppMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AppAsset.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setIsAppModalOpen(false);
      setAppToEdit(null);
    },
  });

  const deleteAppMutation = useMutation({
    mutationFn: (id) => base44.entities.AppAsset.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['apps'] }),
  });

  const archiveAppMutation = useMutation({
    mutationFn: ({ id, isArchived }) => base44.entities.AppAsset.update(id, { is_archived: isArchived }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] });
      setActiveApp(null);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data) => base44.entities.Category.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Category.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => base44.entities.Category.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // --- DERIVED STATE ---
  const currentWorkspace = useMemo(() =>
    workspaces.find(ws => ws.id === activeWsId) || workspaces[0] || { name: 'Carregando...', icon_key: 'Briefcase' }
  , [workspaces, activeWsId]);

  const archivedApps = useMemo(() => {
    return apps.filter(app => app.workspace_id === activeWsId && app.is_archived);
  }, [apps, activeWsId]);

  // --- HANDLERS ---
  const toggleSectorCollapse = (sectorName) => setCollapsedSectors(prev => ({ ...prev, [sectorName]: !prev[sectorName] }));

  const handleOpenNewWindow = (e) => {
    e?.preventDefault();
    const urlToOpen = activeApp ? activeApp.url : window.location.href;
    window.open(urlToOpen, '_blank', 'noopener,noreferrer')?.focus();
  };

  const triggerNewApp = () => {
    setAppToEdit(null);
    setActiveApp(null);
    setIsAppModalOpen(true);
  };

  const handleEditApp = (app) => {
    setAppToEdit(app);
    setIsAppModalOpen(true);
  };

  const handleDeleteApp = (id) => {
    if (activeApp?.id === id) setActiveApp(null);
    deleteAppMutation.mutate(id);
  };

  const handleArchiveApp = (id, isArchived) => {
    archiveAppMutation.mutate({ id, isArchived });
  };

  const handleSaveApp = (formData, editing) => {
    if (editing) {
      updateAppMutation.mutate({ id: editing.id, data: formData });
    } else {
      createAppMutation.mutate({ ...formData, workspace_id: activeWsId });
      setCollapsedSectors(prev => ({ ...prev, [formData.category]: false }));
    }
    setActiveTab("Aplicações");
  };

  const handleSaveWorkspace = (formData, editing) => {
    if (editing) {
      updateWsMutation.mutate({ id: editing.id, data: { name: formData.name, description: formData.description, icon_key: formData.icon_key, color: formData.color } });
    } else {
      const maxOrder = Math.max(...workspaces.map(w => w.order_index || 0), -1);
      createWsMutation.mutate({ name: formData.name, description: formData.description, icon_key: formData.icon_key, color: formData.color, order_index: maxOrder + 1 });
    }
  };

  const handleToggleFavorite = (id, isFavorite) => {
    updateWsMutation.mutate({ id, data: { is_favorite: isFavorite } });
  };

  const handleReorderWorkspace = (reorderedList) => {
    // Persiste sem invalidar cache durante updates em massa (evita race condition)
    reorderedList.forEach((ws, index) => {
      base44.entities.Workspace.update(ws.id, { order_index: index });
    });
    // Só invalida uma vez no final
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    }, 500);
  };

  const handleDeleteWorkspace = (e, id) => {
    e?.stopPropagation();
    if (workspaces.length <= 1) return;
    deleteWsMutation.mutate(id);
    if (activeWsId === id) {
      const next = workspaces.find(w => w.id !== id);
      if (next) setActiveWsId(next.id);
    }
  };

  const triggerEditWorkspace = (e, ws) => {
    e?.stopPropagation();
    setWsToEdit(ws);
    setIsWsModalOpen(true);
  };

  const handleSaveCategory = (formData, editing) => {
    if (editing) {
      updateCategoryMutation.mutate({ id: editing.id, data: formData });
    } else {
      const maxOrder = Math.max(...categories.map(c => c.order_index || 0), -1);
      createCategoryMutation.mutate({ ...formData, order_index: maxOrder + 1 });
    }
  };

  const handleDeleteCategory = (e, id) => {
    e?.stopPropagation();
    deleteCategoryMutation.mutate(id);
  };

  const triggerEditCategory = (e, cat) => {
    e?.stopPropagation();
    setCategoryToEdit(cat);
    setIsCategoryModalOpen(true);
  };

  const handleReorderCategory = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= categories.length) return;
    const reordered = [...categories];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    
    reordered.forEach((cat, index) => {
      updateCategoryMutation.mutate({ id: cat.id, data: { order_index: index } });
    });
  };

  return (
    <div className={`flex h-screen transition-colors duration-500 font-sans overflow-hidden selection:bg-blue-500/30 ${isDarkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          currentWorkspace={currentWorkspace}
          activeWsId={activeWsId}
          setActiveWsId={setActiveWsId}
          workspaces={workspaces}
          apps={apps}
          collapsedSectors={collapsedSectors}
          toggleSectorCollapse={toggleSectorCollapse}
          triggerNewApp={triggerNewApp}
          onReorderWorkspace={handleReorderWorkspace}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className={`p-0 w-full sm:w-80 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
          <Sidebar
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }}
            activeApp={activeApp}
            setActiveApp={(app) => { setActiveApp(app); setIsSidebarOpen(false); }}
            currentWorkspace={currentWorkspace}
            activeWsId={activeWsId}
            setActiveWsId={(id) => { setActiveWsId(id); setIsSidebarOpen(false); }}
            workspaces={workspaces}
            apps={apps}
            collapsedSectors={collapsedSectors}
            toggleSectorCollapse={toggleSectorCollapse}
            triggerNewApp={() => { triggerNewApp(); setIsSidebarOpen(false); }}
            onReorderWorkspace={handleReorderWorkspace}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className={`h-16 lg:h-24 backdrop-blur-3xl border-b flex items-center justify-between px-4 sm:px-8 lg:px-12 z-20 ${isDarkMode ? 'bg-slate-950/20 border-slate-800/50' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-3 sm:gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className={`lg:hidden p-2 rounded-xl transition-all ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Menu className="w-6 h-6" />
            </button>
            {activeApp ? (
              <button onClick={() => setActiveApp(null)} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border rounded-full transition-all font-black text-[10px] sm:text-xs uppercase italic tracking-widest ${isDarkMode ? 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100'}`}>
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Voltar ao Painel</span><span className="sm:hidden">Voltar</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 pt-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className={`text-sm sm:text-xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Orenstein AI</h2>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 sm:p-3.5 rounded-full border transition-all duration-500 flex items-center gap-3 group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 shadow-xl shadow-amber-500/5' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 shadow-lg'}`} title={isDarkMode ? "Visão Clara" : "Visão Noturna"}>
              {isDarkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />}
            </button>
            <div className="hidden sm:block">
              <DigitalClock isDarkMode={isDarkMode} />
            </div>
            <button onClick={handleOpenNewWindow} className={`hidden sm:flex items-center gap-3 px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-full text-xs font-black transition-all shadow-xl uppercase tracking-widest ${isDarkMode ? 'bg-white text-slate-950 hover:bg-blue-50 shadow-white/10' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/10'}`}>
              <Maximize2 className="w-4 h-4" /> <span className="hidden lg:inline">Nova Janela</span>
            </button>
            <button onClick={handleOpenNewWindow} className={`sm:hidden p-2.5 rounded-full transition-all shadow-xl ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'}`}>
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 custom-scrollbar ${isDarkMode ? 'bg-gradient-to-b from-[#020617] to-slate-950' : 'bg-slate-50'}`}>
          {activeTab === "Aplicações" ? (
            activeApp ? (
              <AppViewer app={activeApp} isDarkMode={isDarkMode} onRefresh={() => setActiveApp(prev => ({...prev}))} onArchive={() => handleArchiveApp(activeApp.id, true)} onDelete={() => handleDeleteApp(activeApp.id)} />
            ) : (
              <AppsPanel
                isDarkMode={isDarkMode}
                activeWsId={activeWsId}
                setActiveWsId={setActiveWsId}
                workspaces={workspaces}
                apps={apps}
                onSelectApp={setActiveApp}
                onEditApp={handleEditApp}
                onDeleteApp={handleDeleteApp}
                onArchiveApp={handleArchiveApp}
              />
            )
          ) : activeTab === "Definições" ? (
            <div className="space-y-16">
              <div>
                <h2 className={`text-3xl font-black uppercase italic mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Workspaces</h2>
                <WorkspaceSettings isDarkMode={isDarkMode} workspaces={workspaces} activeWsId={activeWsId} onEdit={triggerEditWorkspace} onDelete={handleDeleteWorkspace} onCreateNew={() => { setWsToEdit(null); setIsWsModalOpen(true); }} onToggleFavorite={handleToggleFavorite} onReorder={handleReorderWorkspace} />
              </div>
              <div>
                <h2 className={`text-3xl font-black uppercase italic mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Categorias</h2>
                <CategorySettings isDarkMode={isDarkMode} categories={categories} onEdit={triggerEditCategory} onDelete={handleDeleteCategory} onCreateNew={() => { setCategoryToEdit(null); setIsCategoryModalOpen(true); }} onReorder={handleReorderCategory} />
              </div>
            </div>
          ) : activeTab === "Terminal" ? (
            <div className="max-w-4xl mx-auto"><ActiveTerminal workspaceName={currentWorkspace.name} isDarkMode={isDarkMode} /></div>
          ) : activeTab === "Notas" ? (
            <KernelNotes isDarkMode={isDarkMode} />
          ) : null}
        </div>
      </main>

      {/* MODALS */}
      <AppModal isDarkMode={isDarkMode} isOpen={isAppModalOpen} appToEdit={appToEdit} onClose={() => { setIsAppModalOpen(false); setAppToEdit(null); }} onSave={handleSaveApp} workspaces={workspaces} activeWsId={activeWsId} />
      <WsModal isDarkMode={isDarkMode} isOpen={isWsModalOpen} wsToEdit={wsToEdit} onClose={() => { setIsWsModalOpen(false); setWsToEdit(null); }} onSave={handleSaveWorkspace} />
      <CategoryModal isDarkMode={isDarkMode} isOpen={isCategoryModalOpen} categoryToEdit={categoryToEdit} onClose={() => { setIsCategoryModalOpen(false); setCategoryToEdit(null); }} onSave={handleSaveCategory} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(120,120,120,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(120,120,120,0.2); }
      `}</style>
    </div>
  );
}