import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Sun, Moon, Maximize2 } from 'lucide-react';

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

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("Aplicações");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeApp, setActiveApp] = useState(null);
  const [activeWsId, setActiveWsId] = useState(null);
  const [collapsedSectors, setCollapsedSectors] = useState({});

  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [wsToEdit, setWsToEdit] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState(null);

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

  // --- DERIVED STATE ---
  const currentWorkspace = useMemo(() =>
    workspaces.find(ws => ws.id === activeWsId) || workspaces[0] || { name: 'Carregando...', icon_key: 'Briefcase' }
  , [workspaces, activeWsId]);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesWs = app.workspace_id === activeWsId;
      const matchesCategory = activeCategory === "Todos" || app.category === activeCategory;
      const matchesSearch = app.title?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesWs && matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, apps, activeWsId]);

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

  const handleSaveApp = (formData, editing) => {
    if (editing) {
      updateAppMutation.mutate({ id: editing.id, data: formData });
    } else {
      createAppMutation.mutate({ ...formData, workspace_id: activeWsId });
    }
    setActiveCategory(formData.category);
    setActiveTab("Aplicações");
  };

  const handleSaveWorkspace = (formData, editing) => {
    if (editing) {
      updateWsMutation.mutate({ id: editing.id, data: { name: formData.name, description: formData.description } });
    } else {
      createWsMutation.mutate({ name: formData.name, description: formData.description, icon_key: 'LayoutGrid' });
    }
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

  return (
    <div className={`flex h-screen transition-colors duration-500 font-sans overflow-hidden selection:bg-blue-500/30 ${isDarkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
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
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* HEADER */}
        <header className={`h-24 backdrop-blur-3xl border-b flex items-center justify-between px-12 z-20 ${isDarkMode ? 'bg-slate-950/20 border-slate-800/50' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-6">
            {activeApp ? (
              <button onClick={() => setActiveApp(null)} className={`flex items-center gap-3 px-6 py-3 border rounded-full transition-all font-black text-xs uppercase italic tracking-widest ${isDarkMode ? 'text-blue-400 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20' : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100'}`}>
                <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
              </button>
            ) : (
              <div className="flex items-center gap-3 pt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <h2 className={`text-xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Orenstein AI</h2>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3.5 rounded-full border transition-all duration-500 flex items-center gap-3 group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800 shadow-xl shadow-amber-500/5' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 shadow-lg'}`} title={isDarkMode ? "Visão Clara" : "Visão Noturna"}>
              {isDarkMode ? <Sun className="w-5 h-5 fill-current" /> : <Moon className="w-5 h-5 fill-current" />}
            </button>
            <DigitalClock isDarkMode={isDarkMode} />
            <button onClick={handleOpenNewWindow} className={`flex items-center gap-3 px-8 py-3.5 rounded-full text-xs font-black transition-all shadow-xl uppercase tracking-widest ${isDarkMode ? 'bg-white text-slate-950 hover:bg-blue-50 shadow-white/10' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/10'}`}>
              <Maximize2 className="w-4 h-4" /> Nova Janela
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className={`flex-1 overflow-y-auto p-12 custom-scrollbar ${isDarkMode ? 'bg-gradient-to-b from-[#020617] to-slate-950' : 'bg-slate-50'}`}>
          {activeTab === "Aplicações" ? (
            activeApp ? (
              <AppViewer app={activeApp} isDarkMode={isDarkMode} onRefresh={() => setActiveApp(prev => ({...prev}))} />
            ) : (
              <AppsPanel isDarkMode={isDarkMode} activeCategory={activeCategory} setActiveCategory={setActiveCategory} filteredApps={filteredApps} onSelectApp={setActiveApp} onEditApp={handleEditApp} onDeleteApp={handleDeleteApp} />
            )
          ) : activeTab === "Definições" ? (
            <WorkspaceSettings isDarkMode={isDarkMode} workspaces={workspaces} activeWsId={activeWsId} onEdit={triggerEditWorkspace} onDelete={handleDeleteWorkspace} onCreateNew={() => { setWsToEdit(null); setIsWsModalOpen(true); }} />
          ) : activeTab === "Terminal" ? (
            <div className="max-w-4xl mx-auto"><ActiveTerminal workspaceName={currentWorkspace.name} isDarkMode={isDarkMode} /></div>
          ) : activeTab === "Notas" ? (
            <KernelNotes isDarkMode={isDarkMode} />
          ) : null}
        </div>
      </main>

      {/* MODALS */}
      <AppModal isDarkMode={isDarkMode} isOpen={isAppModalOpen} appToEdit={appToEdit} onClose={() => { setIsAppModalOpen(false); setAppToEdit(null); }} onSave={handleSaveApp} />
      <WsModal isDarkMode={isDarkMode} isOpen={isWsModalOpen} wsToEdit={wsToEdit} onClose={() => { setIsWsModalOpen(false); setWsToEdit(null); }} onSave={handleSaveWorkspace} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(120,120,120,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(120,120,120,0.2); }
      `}</style>
    </div>
  );
}