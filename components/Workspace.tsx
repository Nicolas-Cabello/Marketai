'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  Target, 
  TrendingUp, 
  Search,
  Rocket,
  Globe,
  Users,
  Layout as LayoutIcon,
  Mail,
  Instagram,
  Facebook,
  Zap,
  FileText,
  Share2,
  Calculator,
  Link as LinkIcon,
  Filter,
  BarChart3,
  Database
} from 'lucide-react';

interface WorkspaceProps {
  activeStep: number;
  onOwnerData?: (data: any) => void;
  setActiveStep?: (step: number) => void;
}

export default function Workspace({ activeStep, onOwnerData, setActiveStep }: WorkspaceProps) {
  const [budget, setBudget] = useState(1000);
  const [cpc, setCpc] = useState(0.5);
  const [convRate, setConvRate] = useState(2);
  const [avgSale, setAvgSale] = useState(100);

  // Estado para el Paso 1
  const [ownerData, setOwnerData] = useState<{
    id?: string;
    name: string;
    email: string;
    website: string;
    description: string;
  }>({
    name: '',
    email: '',
    website: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const visitors = budget / cpc;
  const sales = (visitors * convRate) / 100;
  const revenue = sales * avgSale;
  const roi = ((revenue - budget) / budget) * 100;

  const handleOwnerDataChange = (field: string, value: string) => {
    setOwnerData(prev => ({ ...prev, [field]: value }));
  };

  const saveOwnerData = async () => {
    if (!ownerData.name || !ownerData.email) {
      setSaveStatus('error');
      alert('Por favor, completa el nombre y el email antes de guardar.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/owners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      });

      if (response.ok) {
        const savedOwner = await response.json();
        setSaveStatus('success');
        setOwnerData(prev => ({ ...prev, id: savedOwner.id }));
        onOwnerData?.(savedOwner);
        
        // Verificar si es un nuevo owner o una actualización
        const isNewOwner = savedOwner.updatedAt === savedOwner.createdAt;
        alert(isNewOwner ? '¡Datos guardados exitosamente!' : '¡Datos actualizados exitosamente!');
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errorData = await response.json();
        setSaveStatus('error');
        alert(`Error: ${errorData.error || 'No se pudieron guardar los datos'}`);
      }
    } catch (error) {
      console.error('Error saving owner data:', error);
      setSaveStatus('error');
      alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  // Estado para el Paso 2
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [competitorData, setCompetitorData] = useState<any[]>([]);

  const addCompetitor = () => {
    if (newCompetitor.trim()) {
      setCompetitors(prev => [...prev, newCompetitor.trim()]);
      setNewCompetitor('');
    }
  };

  const removeCompetitor = (index: number) => {
    setCompetitors(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeCompetition = async () => {
    if (competitors.length === 0) {
      alert('Por favor, agrega al menos un competidor antes de escanear el mercado.');
      return;
    }

    if (!ownerData.id) {
      alert('Por favor, guarda tus datos en el Paso 1 antes de analizar la competencia.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/competition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.id,
          competitors,
          businessDescription: ownerData.description || '',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result);
        
        // Generar datos de competidores con scores realistas
        const mockCompetitorData = competitors.map((comp, index) => ({
          name: `Competidor ${String.fromCharCode(65 + index)}`,
          website: comp,
          score: Math.max(60, 92 - (index * 12)), // Scores entre 60-92
          status: index === 0 ? 'Líder' : index === 1 ? 'Creciendo' : 'Estable',
          description: `Análisis competitivo de ${comp}`,
          features: ['API REST', 'Analytics', 'Soporte 24/7', 'Cloud Native', 'Mobile First'],
        }));
        setCompetitorData(mockCompetitorData);
        
        // Mostrar mensaje de éxito
        alert('¡Análisis de competencia completado exitosamente!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'No se pudo completar el análisis'}`);
      }
    } catch (error) {
      console.error('Error analyzing competition:', error);
      alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Estado para el Paso 3
  const [customerFilters, setCustomerFilters] = useState({
    sector: '',
    location: '',
    idealCustomer: {
      age: '',
      income: '',
      interests: '',
      painPoints: '',
      goals: ''
    }
  });
  const [isSavingFilters, setIsSavingFilters] = useState(false);
  const [filtersSaveStatus, setFiltersSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFilterChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerFilters(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as any), [child]: value }
      }));
    } else {
      setCustomerFilters(prev => ({ ...prev, [field]: value }));
    }
  };

  const saveCustomerFilters = async () => {
    if (!ownerData.id) return;

    setIsSavingFilters(true);
    try {
      const response = await fetch('/api/filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.id,
          ...customerFilters,
        }),
      });

      if (response.ok) {
        setFiltersSaveStatus('success');
        setTimeout(() => setFiltersSaveStatus('idle'), 3000);
      } else {
        setFiltersSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving customer filters:', error);
      setFiltersSaveStatus('error');
    } finally {
      setIsSavingFilters(false);
    }
  };

  // Estado para el Paso 4
  const [searchParams, setSearchParams] = useState({
    sector: '',
    location: '',
    keywords: '',
    limit: 50
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const handleSearchParamChange = (field: string, value: string | number) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const searchLeads = async () => {
    if (!searchParams.sector && !searchParams.location && !searchParams.keywords) {
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });

      if (response.ok) {
        const result = await response.json();
        setSearchResults(result.leads || []);
      }
    } catch (error) {
      console.error('Error searching leads:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const exportSelectedLeads = () => {
    const selectedData = searchResults.filter(lead => selectedLeads.includes(lead.id));
    const csv = [
      ['Name', 'Email', 'Company', 'Position', 'Location', 'Industry'],
      ...selectedData.map(lead => [
        lead.name,
        lead.email,
        lead.company || '',
        lead.position || '',
        lead.location || '',
        lead.industry || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Estado para el Paso 5
  const [generatedAssets, setGeneratedAssets] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<string>('all');

  const generateAssets = async () => {
    if (!ownerData.id || !ownerData.description) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.id,
          businessDescription: ownerData.description,
          assetTypes: selectedAssetType === 'all' ? ['all'] : [selectedAssetType],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedAssets(result);
      }
    } catch (error) {
      console.error('Error generating assets:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Estado para el Paso 6
  const [socialStrategy, setSocialStrategy] = useState({
    channels: [] as string[],
    strategy: '',
    schedule: {
      frequency: 'weekly',
      bestTimes: ['10:00', '14:00', '18:00'],
      contentTypes: [] as string[]
    }
  });
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialSaveStatus, setSocialSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSocialChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSocialStrategy(prev => ({
        ...prev,
        [parent]: { ...(prev[parent as keyof typeof prev] as any), [child]: value }
      }));
    } else {
      setSocialStrategy(prev => ({ ...prev, [field]: value }));
    }
  };

  const toggleChannel = (channel: string) => {
    setSocialStrategy(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const toggleContentType = (contentType: string) => {
    setSocialStrategy(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        contentTypes: prev.schedule.contentTypes.includes(contentType)
          ? prev.schedule.contentTypes.filter(t => t !== contentType)
          : [...prev.schedule.contentTypes, contentType]
      }
    }));
  };

  const saveSocialStrategy = async () => {
    if (!ownerData.id) return;

    setIsSavingSocial(true);
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.id,
          ...socialStrategy,
        }),
      });

      if (response.ok) {
        setSocialSaveStatus('success');
        setTimeout(() => setSocialSaveStatus('idle'), 3000);
      } else {
        setSocialSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving social strategy:', error);
      setSocialSaveStatus('error');
    } finally {
      setIsSavingSocial(false);
    }
  };

  // Estado para el Paso 7
  const [prediction, setPrediction] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Estado para el Paso 8 - Optimización con IA
  const [optimizationResults, setOptimizationResults] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const optimizeWithAI = async () => {
    setIsOptimizing(true);
    
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calcular valores optimizados
    const recommendedCpc = (cpc * 0.8).toFixed(2);
    const recommendedConvRate = Math.min(convRate + 2, 10);
    const cpcSavings = (cpc - parseFloat(recommendedCpc)).toFixed(2);
    const convRateImprovement = recommendedConvRate - convRate;
    
    // Calcular nuevo ROI con valores optimizados
    const optimizedVisitors = budget / parseFloat(recommendedCpc);
    const optimizedSales = (optimizedVisitors * recommendedConvRate) / 100;
    const optimizedRevenue = optimizedSales * avgSale;
    const optimizedRoi = Math.round(((optimizedRevenue - budget) / budget) * 100);
    const roiImprovement = optimizedRoi - Math.round(roi);
    
    // Generar recomendaciones adicionales
    const recommendations = [
      `Reduce el CPC de $${cpc} a $${recommendedCpc} para aumentar visitantes en ${Math.round((optimizedVisitors / visitors - 1) * 100)}%`,
      `Mejora la tasa de conversión del ${convRate}% al ${recommendedConvRate}% para maximizar ingresos`,
      `Considera segmentar tu audiencia para mejorar el ROI en ${roiImprovement > 0 ? roiImprovement : 0} puntos porcentuales`,
      `Optimiza tu landing page para aumentar la conversión y reducir el costo por adquisición`
    ];
    
    setOptimizationResults({
      recommendedCpc,
      recommendedConvRate,
      cpcSavings,
      convRateImprovement,
      optimizedRoi,
      roiImprovement,
      recommendations
    });
    
    setIsOptimizing(false);
  };

  // Estado para el Paso 9
  const [trackData, setTrackData] = useState<any>(null);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);

  const loadTrackData = async () => {
    if (!ownerData.id) return;

    setIsLoadingTrack(true);
    try {
      const response = await fetch(`/api/track?ownerId=${ownerData.id}`);
      if (response.ok) {
        const data = await response.json();
        setTrackData(data);
      }
    } catch (error) {
      console.error('Error loading track data:', error);
    } finally {
      setIsLoadingTrack(false);
    }
  };

  // Estado para el Paso 10
  const [mapData, setMapData] = useState<any>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const loadMapData = async () => {
    if (!ownerData.id) return;

    setIsLoadingMap(true);
    try {
      const response = await fetch(`/api/map?ownerId=${ownerData.id}`);
      if (response.ok) {
        const data = await response.json();
        setMapData(data);
      }
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setIsLoadingMap(false);
    }
  };

  // Cargar datos del mapa cuando se accede al paso 10
  React.useEffect(() => {
    if (activeStep === 10 && ownerData.id && !mapData) {
      loadMapData();
    }
  }, [activeStep, ownerData.id]);

  // Cargar datos del track cuando se accede al paso 9
  React.useEffect(() => {
    if (activeStep === 9 && ownerData.id && !trackData) {
      loadTrackData();
    }
  }, [activeStep, ownerData.id]);

  const generatePrediction = async () => {
    if (!ownerData.id) return;

    setIsPredicting(true);
    try {
      // Recopilar todos los datos del negocio para la predicción
      const businessData = {
        owner: ownerData,
        customerFilters,
        competitors,
        socialStrategy,
        generatedAssets,
        searchResults
      };

      const response = await fetch('/api/prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId: ownerData.id,
          businessData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPrediction(result);
      }
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setIsPredicting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-12">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nombre Comercial *</label>
                <input 
                  type="text" 
                  placeholder="Ej: TechFlow Solutions" 
                  value={ownerData.name}
                  onChange={(e) => handleOwnerDataChange('name', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Email *</label>
                <input 
                  type="email" 
                  placeholder="contacto@empresa.com" 
                  value={ownerData.email}
                  onChange={(e) => handleOwnerDataChange('email', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">URL del Sitio Web</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={ownerData.website}
                  onChange={(e) => handleOwnerDataChange('website', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Descripción de Producto (IA Core)</label>
                <textarea 
                  rows={5} 
                  placeholder="Describe qué hace tu negocio único..." 
                  value={ownerData.description}
                  onChange={(e) => handleOwnerDataChange('description', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none" 
                />
              </div>
              <div className="pt-2">
                <button
                  onClick={saveOwnerData}
                  disabled={isSaving}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    isSaving 
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : saveStatus === 'success'
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : saveStatus === 'error'
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                      : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : saveStatus === 'success' ? (
                    <>
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Datos Guardados
                    </>
                  ) : saveStatus === 'error' ? (
                    <>
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Error al Guardar
                    </>
                  ) : (
                    <>
                  <div className="w-4 h-4 bg-white rounded-full" />
                  Guardar Información
                </>
                  )}
                </button>
              </div>
              <div className="pt-2">
                 <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 transition-colors cursor-pointer group bg-slate-900/40">
                    <div className="text-xs mb-2 group-hover:text-slate-300 transition-colors">Arrastra activos (PDF, PNG) para análisis de estilo</div>
                    <div className="text-xs opacity-50">Max 50MB</div>
                 </div>
              </div>
            </div>

            <div className="bg-slate-800/30 p-0 rounded-2xl border border-slate-700/50 flex flex-col overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pre-Análisis de Identidad</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-tighter tracking-widest">Sync OK</span>
               </div>
               <div className="p-8 space-y-8 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                      <Target className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5">Estilo Detectado: Minimalista Moderno</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Consistencia: 92%</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-500">Tono de Voz</span>
                      <span className="text-white">Profesional</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary w-3/4 border-r border-slate-900 shadow-[0_0_8px_rgba(0,163,255,0.4)]"></div>
                      <div className="h-full bg-secondary w-1/4 shadow-[0_0_8px_rgba(0,223,216,0.4)]"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {['#00A3FF', '#00DFD8', '#1E293B'].map((hex) => (
                      <div key={hex} className="h-14 rounded border border-slate-800 bg-slate-900/50 flex flex-col items-center justify-center gap-1 group hover:border-slate-600 transition-all cursor-pointer">
                        <span className="text-[9px] text-slate-600 font-bold font-mono group-hover:text-slate-400">{hex}</span>
                        <div className="w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: hex }} />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Análisis de Competencia</h2>
                  <p className="text-slate-400 text-sm">Monitorización en tiempo real de los KPIs de mercado de tus competidores directos.</p>
                </div>
                <button 
                  onClick={analyzeCompetition}
                  disabled={isAnalyzing || competitors.length === 0}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                    isAnalyzing || competitors.length === 0
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Search size={18} />
                  {isAnalyzing ? 'Analizando...' : 'Escanear Mercado'}
                </button>
              </div>

              {/* Agregar competidores */}
              <div className="mb-8">
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text"
                    placeholder="Agregar competidor (URL o nombre)"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
                    className="flex-1 bg-sidebar border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                  />
                  <button 
                    onClick={addCompetitor}
                    className="bg-primary px-4 py-3 rounded-xl font-bold text-white hover:scale-[1.02] transition-all"
                  >
                    Agregar
                  </button>
                </div>

                {/* Lista de competidores */}
                {competitors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {competitors.map((comp, index) => (
                      <div key={index} className="bg-slate-900/50 border border-slate-700 px-3 py-2 rounded-lg flex items-center gap-2">
                        <span className="text-sm text-slate-300">{comp}</span>
                        <button 
                          onClick={() => removeCompetitor(index)}
                          className="text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resultados del análisis */}
              {isAnalyzing && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 border border-primary/20 rounded-xl">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-primary font-bold">Analizando mercado...</span>
                  </div>
                </div>
              )}

              {!isAnalyzing && competitorData.length === 0 && competitors.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <div className="mb-4">
                    <Search className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                  </div>
                  <p className="text-sm">Agrega competidores para comenzar el análisis de mercado</p>
                </div>
              )}

              {!isAnalyzing && competitorData.length === 0 && competitors.length > 0 && (
                <div className="text-center py-12">
                  <button
                    onClick={analyzeCompetition}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
                  >
                    <Search size={18} />
                    Escanear Mercado Ahora
                  </button>
                </div>
              )}

              {competitorData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {competitorData.map((comp, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                          <BarChart3 className={cn("w-5 h-5", 
                            comp.score >= 85 ? 'text-primary' : 
                            comp.score >= 70 ? 'text-secondary' : 'text-slate-400')} 
                          />
                        </div>
                        <span className={cn("text-[9px] px-2 py-1 rounded border font-bold uppercase", 
                          comp.status === 'Líder' ? 'bg-primary/10 text-primary border-primary/20' : 
                          comp.status === 'Creciendo' ? 'bg-secondary/10 text-secondary border-secondary/20' : 
                          'bg-slate-700/30 text-slate-400 border-slate-600/50')}>
                          {comp.status}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{comp.name}</div>
                        <div className="text-xs text-slate-500 mb-3">{comp.website}</div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] text-slate-600 font-bold uppercase">Score</span>
                          <span className="text-lg font-black text-white">{comp.score}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-500 font-bold uppercase">Características:</div>
                          {comp.features.slice(0, 3).map((feature: string, idx: number) => (
                            <div key={idx} className="text-[10px] text-slate-400">• {feature}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gap Analysis */}
              {analysisResult && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4">Análisis de Oportunidades (Gap Analysis)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-secondary mb-2">Gaps Detectados</h4>
                      <ul className="space-y-1">
                        <li className="text-xs text-slate-400">• Falta de integración con terceros</li>
                        <li className="text-xs text-slate-400">• UI poco intuitiva</li>
                        <li className="text-xs text-slate-400">• Soporte limitado</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary mb-2">Oportunidades</h4>
                      <ul className="space-y-1">
                        <li className="text-xs text-slate-400">• Mejorar experiencia usuario</li>
                        <li className="text-xs text-slate-400">• Precios competitivos</li>
                        <li className="text-xs text-slate-400">• API integraciones</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 mb-2">Recomendaciones</h4>
                      <ul className="space-y-1">
                        <li className="text-xs text-slate-400">• Enfocarse en usabilidad</li>
                        <li className="text-xs text-slate-400">• Modelo de precios flexible</li>
                        <li className="text-xs text-slate-400">• Soporte 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full pb-12">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Definición de Producto</h2>
                <p className="text-slate-400 text-sm">Segmenta tu mercado y define el perfil de tu cliente ideal.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sector Industrial</label>
                  <select 
                    value={customerFilters.sector}
                    onChange={(e) => handleFilterChange('sector', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Selecciona un sector</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="salud">Salud</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="educacion">Educación</option>
                    <option value="retail">Retail</option>
                    <option value="manufactura">Manufactura</option>
                    <option value="servicios">Servicios</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Localización Geográfica</label>
                  <select 
                    value={customerFilters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Selecciona una región</option>
                    <option value="local">Local</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                    <option value="especifica">Región Específica</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Perfil del Cliente Ideal</h3>
                <p className="text-slate-400 text-sm">Define las características demográficas y psicográficas.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Rango de Edad</label>
                  <input 
                    type="text" 
                    placeholder="Ej: 25-45 años"
                    value={customerFilters.idealCustomer.age}
                    onChange={(e) => handleFilterChange('idealCustomer.age', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nivel de Ingresos</label>
                  <input 
                    type="text" 
                    placeholder="Ej: $30,000 - $60,000 anuales"
                    value={customerFilters.idealCustomer.income}
                    onChange={(e) => handleFilterChange('idealCustomer.income', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Intereses y Hobbies</label>
                  <textarea 
                    rows={3}
                    placeholder="Ej: Tecnología, deportes, lectura, viajes..."
                    value={customerFilters.idealCustomer.interests}
                    onChange={(e) => handleFilterChange('idealCustomer.interests', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Puntos de Dolor</label>
                  <textarea 
                    rows={3}
                    placeholder="¿Qué problemas resuelves para tus clientes?"
                    value={customerFilters.idealCustomer.painPoints}
                    onChange={(e) => handleFilterChange('idealCustomer.painPoints', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Objetivos y Metas</label>
                  <textarea 
                    rows={3}
                    placeholder="¿Qué quieren lograr tus clientes?"
                    value={customerFilters.idealCustomer.goals}
                    onChange={(e) => handleFilterChange('idealCustomer.goals', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none" 
                  />
                </div>

                <button
                  onClick={saveCustomerFilters}
                  disabled={isSavingFilters}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                    isSavingFilters 
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : filtersSaveStatus === 'success'
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : filtersSaveStatus === 'error'
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                      : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  {isSavingFilters ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : filtersSaveStatus === 'success' ? (
                    <>
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Perfil Guardado
                    </>
                  ) : filtersSaveStatus === 'error' ? (
                    <>
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Error al Guardar
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-white rounded-full" />
                      Guardar Perfil de Cliente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Búsqueda de Clientes</h2>
                  <p className="text-slate-400 text-sm">Encuentra leads potenciales usando filtros avanzados de sector y localización.</p>
                </div>
                <div className="flex gap-2">
                  {selectedLeads.length > 0 && (
                    <button 
                      onClick={exportSelectedLeads}
                      className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.02] flex items-center gap-2"
                    >
                      <FileText size={18} />
                      Exportar ({selectedLeads.length})
                    </button>
                  )}
                  <button 
                    onClick={searchLeads}
                    disabled={isSearching || (!searchParams.sector && !searchParams.location && !searchParams.keywords)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                      isSearching || (!searchParams.sector && !searchParams.location && !searchParams.keywords)
                        ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                        : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    <Search size={18} />
                    {isSearching ? 'Buscando...' : 'Buscar Leads'}
                  </button>
                </div>
              </div>

              {/* Filtros de búsqueda */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sector</label>
                  <select 
                    value={searchParams.sector}
                    onChange={(e) => handleSearchParamChange('sector', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Todos los sectores</option>
                    <option value="tecnologia">Tecnología</option>
                    <option value="salud">Salud</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="educacion">Educación</option>
                    <option value="retail">Retail</option>
                    <option value="manufactura">Manufactura</option>
                    <option value="servicios">Servicios</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Localización</label>
                  <select 
                    value={searchParams.location}
                    onChange={(e) => handleSearchParamChange('location', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">Todas las ubicaciones</option>
                    <option value="local">Local</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Keywords</label>
                  <input 
                    type="text" 
                    placeholder="Ej: CEO, CTO, Director..."
                    value={searchParams.keywords}
                    onChange={(e) => handleSearchParamChange('keywords', e.target.value)}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Límite</label>
                  <input 
                    type="number" 
                    min="10"
                    max="200"
                    value={searchParams.limit}
                    onChange={(e) => handleSearchParamChange('limit', parseInt(e.target.value))}
                    className="w-full bg-sidebar border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              {/* Resultados de búsqueda */}
              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Resultados Encontrados</h3>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-sm text-slate-400">
                        <input 
                          type="checkbox"
                          checked={selectedLeads.length === searchResults.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(searchResults.map(lead => lead.id));
                            } else {
                              setSelectedLeads([]);
                            }
                          }}
                          className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary"
                        />
                        Seleccionar todos
                      </label>
                      <span className="text-sm text-slate-400">
                        {selectedLeads.length} de {searchResults.length} seleccionados
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                    {searchResults.map((lead) => (
                      <div key={lead.id} className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-primary/50 transition-all">
                        <div className="flex items-start gap-4">
                          <input 
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={() => toggleLeadSelection(lead.id)}
                            className="mt-1 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-white">{lead.name}</h4>
                                <p className="text-sm text-slate-400">{lead.position} @ {lead.company}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
                                  {lead.confidence}% confianza
                                </span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                                  {lead.source}
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                              <div>
                                <span className="text-slate-500">Email:</span>
                                <span className="text-slate-300 ml-1">{lead.email}</span>
                              </div>
                              {lead.phone && (
                                <div>
                                  <span className="text-slate-500">Teléfono:</span>
                                  <span className="text-slate-300 ml-1">{lead.phone}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-500">Industria:</span>
                                <span className="text-slate-300 ml-1">{lead.industry}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Ubicación:</span>
                                <span className="text-slate-300 ml-1">{lead.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.length === 0 && !isSearching && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <Search className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Sin resultados</h3>
                  <p className="text-slate-400">Usa los filtros arriba para buscar leads potenciales</p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Generación de Activos</h2>
                  <p className="text-slate-400 text-sm">Crea contenido de marketing profesional impulsado por IA.</p>
                </div>
                <button 
                  onClick={generateAssets}
                  disabled={isGenerating || !ownerData.description}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                    isGenerating || !ownerData.description
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Zap size={18} />
                  {isGenerating ? 'Generando...' : 'Generar con IA'}
                </button>
              </div>

              {/* Selector de tipo de activo */}
              <div className="mb-8">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 block mb-2">Tipo de Activo</label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'marketIdeas', label: 'Ideas' },
                    { value: 'slogan', label: 'Eslogan' },
                    { value: 'logoConcept', label: 'Logo' },
                    { value: 'brochure', label: 'Folleto' },
                    { value: 'newsletter', label: 'Newsletter' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedAssetType(type.value)}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-medium transition-all",
                        selectedAssetType === type.value
                          ? "bg-primary text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activos generados */}
              {generatedAssets && generatedAssets.generatedContent && (
                <div className="space-y-6">
                  {/* Ideas de Mercado */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'marketIdeas') && generatedAssets.generatedContent.marketIdeas && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Target className="text-primary w-5 h-5" />
                          Ideas de Mercado
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.marketIdeas)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof generatedAssets.generatedContent.marketIdeas === 'string' 
                          ? generatedAssets.generatedContent.marketIdeas
                          : JSON.stringify(generatedAssets.generatedContent.marketIdeas, null, 2)
                        }
                      </div>
                    </div>
                  )}

                  {/* Eslogan */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'slogan') && generatedAssets.generatedContent.slogan && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FileText className="text-secondary w-5 h-5" />
                          Eslogan
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.slogan)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300">
                        <p className="text-xl font-bold text-primary mb-2">
                          {generatedAssets.generatedContent.slogan}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Concepto de Logo */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'logoConcept') && generatedAssets.generatedContent.logoConcept && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <LayoutIcon className="text-accent w-5 h-5" />
                          Concepto de Logo
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.logoConcept)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof generatedAssets.generatedContent.logoConcept === 'string' 
                          ? generatedAssets.generatedContent.logoConcept
                          : JSON.stringify(generatedAssets.generatedContent.logoConcept, null, 2)
                        }
                      </div>
                    </div>
                  )}

                  {/* Folleto */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'brochure') && generatedAssets.generatedContent.brochure && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <FileText className="text-emerald-400 w-5 h-5" />
                          Estructura de Folleto
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.brochure)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof generatedAssets.generatedContent.brochure === 'string' 
                          ? generatedAssets.generatedContent.brochure
                          : JSON.stringify(generatedAssets.generatedContent.brochure, null, 2)
                        }
                      </div>
                    </div>
                  )}

                  {/* Newsletter */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'newsletter') && generatedAssets.generatedContent.newsletter && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Mail className="text-rose-400 w-5 h-5" />
                          Template Newsletter
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.newsletter)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof generatedAssets.generatedContent.newsletter === 'string' 
                          ? generatedAssets.generatedContent.newsletter
                          : JSON.stringify(generatedAssets.generatedContent.newsletter, null, 2)
                        }
                      </div>
                    </div>
                  )}

                  {/* Banner */}
                  {(selectedAssetType === 'all' || selectedAssetType === 'banner') && generatedAssets.generatedContent.banner && (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Share2 className="text-amber-400 w-5 h-5" />
                          Ideas para Banner
                        </h3>
                        <button 
                          onClick={() => copyToClipboard(generatedAssets.generatedContent.banner)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof generatedAssets.generatedContent.banner === 'string' 
                          ? generatedAssets.generatedContent.banner
                          : JSON.stringify(generatedAssets.generatedContent.banner, null, 2)
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!generatedAssets && !isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <Zap className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Genera Activos de Marketing</h3>
                  <p className="text-slate-400">Usa la inteligencia artificial para crear contenido profesional</p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Generando Contenido...</h3>
                  <p className="text-slate-400">La IA está creando tus activos de marketing personalizados</p>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full pb-12">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">RSS & Social Media</h2>
                <p className="text-slate-400 text-sm">Configura canales de distribución automatizada para tu contenido.</p>
              </div>

              {/* Canales de distribución */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Canales de Distribución</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'rss', name: 'RSS Feed', icon: '📡' },
                    { id: 'facebook', name: 'Facebook', icon: '📘' },
                    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
                    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
                    { id: 'instagram', name: 'Instagram', icon: '📷' },
                    { id: 'youtube', name: 'YouTube', icon: '📺' },
                    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
                    { id: 'blog', name: 'Blog', icon: '📝' }
                  ].map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={cn(
                        "p-3 rounded-xl border transition-all flex items-center gap-2",
                        socialStrategy.channels.includes(channel.id)
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500"
                      )}
                    >
                      <span className="text-lg">{channel.icon}</span>
                      <span className="text-sm font-medium">{channel.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estrategia */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Estrategia de Contenido</h3>
                <textarea
                  rows={6}
                  placeholder="Describe tu estrategia de contenido y cómo planeas distribuirlo en los canales seleccionados..."
                  value={socialStrategy.strategy}
                  onChange={(e) => handleSocialChange('strategy', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none"
                />
              </div>

              <button
                onClick={saveSocialStrategy}
                disabled={isSavingSocial}
                className={cn(
                  "w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                  isSavingSocial 
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                    : socialSaveStatus === 'success'
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : socialSaveStatus === 'error'
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20"
                    : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {isSavingSocial ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : socialSaveStatus === 'success' ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full" />
                    Estrategia Guardada
                  </>
                ) : socialSaveStatus === 'error' ? (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full" />
                    Error al Guardar
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-white rounded-full" />
                    Guardar Estrategia
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Programación de Contenido</h3>
                <p className="text-slate-400 text-sm">Define la frecuencia y mejores momentos para publicar.</p>
              </div>

              {/* Frecuencia */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Frecuencia de Publicación</label>
                <select 
                  value={socialStrategy.schedule.frequency}
                  onChange={(e) => handleSocialChange('schedule.frequency', e.target.value)}
                  className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                >
                  <option value="daily">Diaria</option>
                  <option value="weekly">Semanal</option>
                  <option value="biweekly">Quincenal</option>
                  <option value="monthly">Mensual</option>
                </select>
              </div>

              {/* Mejores horarios */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Mejores Horarios para Publicar</label>
                <div className="grid grid-cols-3 gap-2">
                  {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        const times = socialStrategy.schedule.bestTimes;
                        handleSocialChange('schedule.bestTimes', 
                          times.includes(time)
                            ? times.filter(t => t !== time)
                            : [...times, time]
                        );
                      }}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-medium transition-all",
                        socialStrategy.schedule.bestTimes.includes(time)
                          ? "bg-primary text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipos de contenido */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Tipos de Contenido</label>
                <div className="space-y-2">
                  {[
                    { id: 'blog', name: 'Artículos de Blog', desc: 'Contenido largo y educativo' },
                    { id: 'video', name: 'Videos', desc: 'Tutoriales y demostraciones' },
                    { id: 'infographic', name: 'Infografías', desc: 'Contenido visual y datos' },
                    { id: 'case-study', name: 'Casos de Estudio', desc: 'Historias de éxito' },
                    { id: 'news', name: 'Noticias', desc: 'Actualizaciones del sector' },
                    { id: 'tips', name: 'Consejos', desc: 'Tips rápidos y útiles' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleContentType(type.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border transition-all text-left",
                        socialStrategy.schedule.contentTypes.includes(type.id)
                          ? "bg-primary/10 border-primary text-white"
                          : "bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{type.name}</div>
                          <div className="text-xs opacity-75">{type.desc}</div>
                        </div>
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2",
                          socialStrategy.schedule.contentTypes.includes(type.id)
                            ? "bg-primary border-primary"
                            : "border-slate-500"
                        )} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumen de estrategia */}
              <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-3">Resumen de Estrategia</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Canales seleccionados:</span>
                    <span className="text-slate-300">{socialStrategy.channels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frecuencia:</span>
                    <span className="text-slate-300">
                      {socialStrategy.schedule.frequency === 'daily' ? 'Diaria' :
                       socialStrategy.schedule.frequency === 'weekly' ? 'Semanal' :
                       socialStrategy.schedule.frequency === 'biweekly' ? 'Quincenal' : 'Mensual'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horarios óptimos:</span>
                    <span className="text-slate-300">{socialStrategy.schedule.bestTimes.length} momentos</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipos de contenido:</span>
                    <span className="text-slate-300">{socialStrategy.schedule.contentTypes.length} tipos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Predicción de Resultado</h2>
                  <p className="text-slate-400 text-sm">Análisis de probabilidad de éxito impulsado por inteligencia artificial.</p>
                </div>
                <button 
                  onClick={generatePrediction}
                  disabled={isPredicting || !ownerData.id}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                    isPredicting || !ownerData.id
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Target size={18} />
                  {isPredicting ? 'Analizando...' : 'Generar Predicción'}
                </button>
              </div>

              {/* Resultado de predicción */}
              {prediction && (
                <div className="space-y-6">
                  {/* Score principal */}
                  <div className="text-center py-8">
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-slate-700"></div>
                      <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-transparent border-t-primary border-r-secondary animate-spin"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white">{prediction.successRate}%</span>
                        <span className="text-sm text-slate-400 font-bold uppercase">Probabilidad de Éxito</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className={cn(
                        "inline-flex px-4 py-2 rounded-full text-sm font-bold",
                        prediction.successRate >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        prediction.successRate >= 60 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      )}>
                        {prediction.successRate >= 80 ? 'Alta Probabilidad de Éxito' :
                         prediction.successRate >= 60 ? 'Probabilidad Moderada' :
                         'Baja Probabilidad de Éxito'}
                      </span>
                    </div>
                  </div>

                  {/* Factores considerados */}
                  {prediction.analysis && prediction.analysis.factors && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <TrendingUp className="text-primary w-5 h-5" />
                          Factores Positivos
                        </h3>
                        <div className="space-y-3">
                          {[
                            'Propuesta de valor clara y diferenciada',
                            'Mercado objetivo bien definido',
                            'Estrategia de marketing sólida',
                            'Competencia analizada correctamente'
                          ].map((factor, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-sm text-slate-300">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                          <BarChart3 className="text-secondary w-5 h-5" />
                          Áreas de Mejora
                        </h3>
                        <div className="space-y-3">
                          {[
                            'Necesita mayor validación de mercado',
                            'Presupuesto de marketing limitado',
                            'Dependencia de pocos canales',
                            'Estrategia de precios por definir'
                          ].map((factor, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              <span className="text-sm text-slate-300">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Insights de la IA */}
                  {prediction.insights && (
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Globe className="text-accent w-5 h-5" />
                        Insights de la IA
                      </h3>
                      <div className="text-slate-300 whitespace-pre-wrap">
                        {typeof prediction.insights === 'string' 
                          ? prediction.insights
                          : JSON.stringify(prediction.insights, null, 2)
                        }
                      </div>
                    </div>
                  )}

                  {/* Recomendaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Rocket className="text-emerald-400 w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white mb-2">Optimizar</h4>
                      <p className="text-xs text-slate-400">Enfócate en los factores positivos y maximízalos</p>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Calculator className="text-amber-400 w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white mb-2">Medir</h4>
                      <p className="text-xs text-slate-400">Establece KPIs claros para seguimiento</p>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-rose-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Target className="text-rose-400 w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-white mb-2">Iterar</h4>
                      <p className="text-xs text-slate-400">Ajusta la estrategia basándote en resultados</p>
                    </div>
                  </div>
                </div>
              )}

              {!prediction && !isPredicting && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <Target className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Predicción de Éxito</h3>
                  <p className="text-slate-400">Usa IA para analizar la probabilidad de éxito de tu estrategia</p>
                </div>
              )}

              {isPredicting && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Analizando Estrategia...</h3>
                  <p className="text-slate-400">La IA está evaluando todos los factores para predecir tu éxito</p>
                </div>
              )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6 bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Parámetros de Campaña</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Presupuesto Inicial ($)</label>
                  <input 
                    type="number" 
                    value={budget} 
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full bg-sidebar border border-slate-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">CPC Estimado ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={cpc} 
                    onChange={(e) => setCpc(Number(e.target.value))}
                    className="w-full bg-sidebar border border-slate-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tasa de Conv. (%)</label>
                  <input 
                    type="number" 
                    value={convRate} 
                    onChange={(e) => setConvRate(Number(e.target.value))}
                    className="w-full bg-sidebar border border-slate-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Venta Promedio ($)</label>
                  <input 
                    type="number" 
                    value={avgSale} 
                    onChange={(e) => setAvgSale(Number(e.target.value))}
                    className="w-full bg-sidebar border border-slate-800 rounded-lg p-3 text-sm text-white focus:ring-1 focus:ring-primary outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Visitantes Est.', value: Math.round(visitors).toLocaleString(), color: 'slate-400' },
                  { label: 'Ventas Est.', value: Math.round(sales).toLocaleString(), color: 'secondary' },
                  { label: 'Ingresos Est.', value: `$${Math.round(revenue).toLocaleString()}`, color: 'primary' },
                  { label: 'Retorno (ROI)', value: `${Math.round(roi)}%`, color: roi >= 0 ? 'emerald-500' : 'rose-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className={cn("text-3xl font-black text-white", i === 3 && `text-${stat.color}`)}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Resultados de optimización con IA */}
              {optimizationResults && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 p-6 rounded-2xl">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                    Optimización con IA Activada
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">CPC Recomendado</p>
                        <p className="text-xl font-bold text-primary">${optimizationResults.recommendedCpc}</p>
                        <p className="text-xs text-slate-500">Ahorro: ${optimizationResults.cpcSavings}</p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Tasa de Conversión Óptima</p>
                        <p className="text-xl font-bold text-secondary">{optimizationResults.recommendedConvRate}%</p>
                        <p className="text-xs text-slate-500">Mejora: +{optimizationResults.convRateImprovement}%</p>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl">
                      <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">ROI Proyectado Optimizado</p>
                      <div className="flex items-center gap-4">
                        <p className="text-2xl font-bold text-emerald-500">{optimizationResults.optimizedRoi}%</p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-slate-400">vs</span>
                          <span className="text-sm text-slate-500">{Math.round(roi)}% actual</span>
                          <span className="text-xs text-emerald-500">(+{optimizationResults.roiImprovement}%)</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 uppercase tracking-widest">Recomendaciones Adicionales:</p>
                      <ul className="space-y-1">
                        {optimizationResults.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-slate-700/50 p-8 rounded-2xl text-center">
                 <p className="text-slate-400 text-sm mb-4 italic">"Basado en los parámetros actuales, tu ROI proyectado es {roi >= 0 ? 'Positivo' : 'Negativo'}. La IA puede optimizar estos valores para maximizar tus resultados."</p>
                 <button 
                   onClick={optimizeWithAI}
                   disabled={isOptimizing}
                   className={cn(
                     "bg-primary px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-primary/20 transition-all",
                     isOptimizing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                   )}
                 >
                   {isOptimizing ? (
                     <span className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       Optimizando...
                     </span>
                   ) : (
                     "Optimizar con IA"
                   )}
                 </button>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Trackreport & Historial</h2>
                  <p className="text-slate-400 text-sm">Seguimiento completo de tu progreso y métricas de rendimiento.</p>
                </div>
                <button 
                  onClick={loadTrackData}
                  disabled={isLoadingTrack || !ownerData.id}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                    isLoadingTrack || !ownerData.id
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <BarChart3 size={18} />
                  {isLoadingTrack ? 'Cargando...' : 'Actualizar Datos'}
                </button>
              </div>

              {trackData && (
                <div className="space-y-6">
                  {/* Métricas principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Target className="text-primary w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">{trackData.metrics.completionScore}%</span>
                      </div>
                      <h3 className="text-white font-bold mb-1">Completitud</h3>
                      <p className="text-slate-400 text-sm">Progreso total del workflow</p>
                    </div>

                    <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="text-secondary w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">{trackData.metrics.engagementScore}%</span>
                      </div>
                      <h3 className="text-white font-bold mb-1">Engagement</h3>
                      <p className="text-slate-400 text-sm">Nivel de actividad y participación</p>
                    </div>

                    <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Rocket className="text-accent w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black text-white">{trackData.metrics.potentialScore}%</span>
                      </div>
                      <h3 className="text-white font-bold mb-1">Potencial</h3>
                      <p className="text-slate-400 text-sm">Probabilidad de éxito combinada</p>
                    </div>
                  </div>

                  {/* Resumen de actividades */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Calculator className="text-primary w-5 h-5" />
                      Resumen de Actividades
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{trackData.summary.totalCompetitors}</div>
                        <div className="text-xs text-slate-400">Competidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{trackData.summary.totalLeads}</div>
                        <div className="text-xs text-slate-400">Leads</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{trackData.summary.totalAssets}</div>
                        <div className="text-xs text-slate-400">Activos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-400">{trackData.summary.hasSocialStrategy ? '✓' : '—'}</div>
                        <div className="text-xs text-slate-400">Estrategia Social</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-400">{trackData.metrics.totalActivities}</div>
                        <div className="text-xs text-slate-400">Total Actividades</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline de eventos */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Globe className="text-secondary w-5 h-5" />
                      Línea de Tiempo
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {trackData.timeline.map((event: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${event.color}20` }}
                          >
                            <span className="text-sm">{event.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold text-sm">{event.title}</h4>
                              <span className="text-xs text-slate-400">
                                {new Date(event.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-1">{event.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  {trackData.recommendations.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="text-amber-400 w-5 h-5" />
                        Recomendaciones
                      </h3>
                      <div className="space-y-3">
                        {trackData.recommendations.map((rec: any, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                              rec.priority === 'high' ? 'bg-rose-400' :
                              rec.priority === 'medium' ? 'bg-amber-400' :
                              'bg-emerald-400'
                            )}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-white font-bold text-sm">{rec.title}</h4>
                                <button 
                                  onClick={() => setActiveStep?.(rec.step)}
                                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                                >
                                  {rec.action}
                                </button>
                              </div>
                              <p className="text-slate-400 text-xs mt-1">{rec.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Últimos resultados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trackData.summary.latestPrediction && (
                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-2">Última Predicción</h3>
                        <div className="text-3xl font-black text-primary mb-1">
                          {trackData.summary.latestPrediction.successRate}%
                        </div>
                        <p className="text-slate-400 text-sm">Probabilidad de éxito</p>
                      </div>
                    )}
                    
                    {trackData.summary.latestRoiCalculation && (
                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-2">Último ROI</h3>
                        <div className="text-3xl font-black text-secondary mb-1">
                          {trackData.summary.latestRoiCalculation.roiPercentage}%
                        </div>
                        <p className="text-slate-400 text-sm">Retorno de inversión</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!trackData && !isLoadingTrack && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <BarChart3 className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Trackreport & Historial</h3>
                  <p className="text-slate-400">Visualiza tu progreso y métricas de rendimiento</p>
                </div>
              )}

              {isLoadingTrack && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cargando Datos...</h3>
                  <p className="text-slate-400">Analizando tu progreso y generando reportes</p>
                </div>
              )}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">API Endpoints & Configuración</h2>
                  <p className="text-slate-400 text-sm">Configuración de APIs y gestión de datos geolocalizados.</p>
                </div>
                <button 
                  onClick={loadMapData}
                  disabled={isLoadingMap || !ownerData.id}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2",
                    isLoadingMap || !ownerData.id
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Database size={18} />
                  {isLoadingMap ? 'Cargando...' : 'Cargar Datos'}
                </button>
              </div>

              {mapData && (
                <div className="space-y-6">
                  {/* Lista de leads geolocalizados */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Users className="text-secondary w-5 h-5" />
                      Leads Geolocalizados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mapData.leads && (mapData.leads as any[]).map((lead: any) => (
                        <div 
                          key={lead.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            selectedLead?.id === lead.id 
                              ? "bg-primary/10 border-primary/30" 
                              : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                          )}
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-bold text-sm">{lead.name}</h4>
                              <span className={cn(
                                "px-2 py-1 rounded text-xs font-bold",
                                lead.priority === 'high' ? "bg-rose-500/10 text-rose-400" :
                                lead.priority === 'medium' ? "bg-amber-500/10 text-amber-400" :
                                "bg-emerald-500/10 text-emerald-400"
                              )}>
                                {lead.priority}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs">{lead.company}</p>
                            <p className="text-slate-400 text-xs">{lead.position}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">📍</span>
                              <span className="text-slate-300">{lead.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">📧</span>
                              <span className="text-slate-300 truncate">{lead.email}</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                              <span className="text-xs text-slate-400">Score: {lead.score}/100</span>
                              <span className="text-xs text-slate-400">{lead.distance?.toFixed(1)} km</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* API Endpoints */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Globe className="text-accent w-5 h-5" />
                      API Endpoints Configurados
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Geocoding</h4>
                        <p className="text-slate-400 text-xs font-mono break-all">
                          {mapData.apiEndpoints?.geocoding}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                          Activo
                        </span>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Routing</h4>
                        <p className="text-slate-400 text-xs font-mono break-all">
                          {mapData.apiEndpoints?.routing}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                          Activo
                        </span>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Map Tiles</h4>
                        <p className="text-slate-400 text-xs font-mono break-all">
                          {mapData.apiEndpoints?.tiles}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{mapData.leads?.length || 0}</div>
                      <div className="text-xs text-slate-400">Leads Totales</div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-emerald-400">
                        {(mapData.leads as any[])?.filter(l => l.priority === 'high').length || 0}
                      </div>
                      <div className="text-xs text-slate-400">Alta Prioridad</div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-400">
                        {(mapData.leads as any[])?.filter(l => l.priority === 'medium').length || 0}
                      </div>
                      <div className="text-xs text-slate-400">Media Prioridad</div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {mapData.coordinates?.center?.lat?.toFixed(2)}°, {mapData.coordinates?.center?.lng?.toFixed(2)}°
                      </div>
                      <div className="text-xs text-slate-400">Centro del Mapa</div>
                    </div>
                  </div>
                </div>
              )}

              {!mapData && !isLoadingMap && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <Database className="text-slate-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">API Endpoints & Configuración</h3>
                  <p className="text-slate-400">Configura APIs y gestiona datos geolocalizados</p>
                </div>
              )}

              {isLoadingMap && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Cargando Datos...</h3>
                  <p className="text-slate-400">Procesando información geolocalizada</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <Rocket className="text-primary w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Paso {activeStep}</h2>
              <p className="text-slate-400">Contenido en desarrollo...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 ml-64 mr-72 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {renderStepContent()}
      </div>
    </main>
  );
}