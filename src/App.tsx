import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STEPS } from './constants';
import { cn } from './lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Map as MapIcon, 
  Clock, 
  ChevronRight,
  Rocket,
  Search,
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
  BarChart3
} from 'lucide-react';

const ROICalculator = () => {
  const [budget, setBudget] = React.useState(1000);
  const [cpc, setCpc] = React.useState(0.5);
  const [convRate, setConvRate] = React.useState(2);
  const [avgSale, setAvgSale] = React.useState(100);

  const visitors = budget / cpc;
  const sales = (visitors * convRate) / 100;
  const revenue = sales * avgSale;
  const roi = ((revenue - budget) / budget) * 100;

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

      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
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
        <div className="col-span-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-slate-700/50 p-8 rounded-2xl text-center">
           <p className="text-slate-400 text-sm mb-4 italic">"Basado en los parámetros actuales, tu ROI proyectado es {roi >= 0 ? 'Positivo' : 'Negativo'}. La IA recomienda optimizar el CPC."</p>
           <button className="bg-primary px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">Optimizar con IA</button>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const Sidebar = ({ activeStep, setStep }: { activeStep: number, setStep: (id: number) => void }) => {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="font-black text-sm">M</span>
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white italic">Marketai</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-4 px-2">Automation Flow</div>
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;
          const Icon = step.icon;
          
          return (
            <button
              key={step.id}
              onClick={() => setStep(step.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all duration-200 group relative flex items-center gap-3 border",
                isActive 
                  ? "bg-slate-800/50 border-slate-700 text-white shadow-sm" 
                  : "hover:bg-slate-800/30 border-transparent text-slate-500"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border shrink-0",
                isActive 
                  ? "bg-primary border-primary text-white" 
                  : isCompleted 
                    ? "bg-secondary/10 border-secondary/30 text-secondary" 
                    : "bg-slate-900 border-slate-700 text-slate-500"
              )}>
                {step.id}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                )}>
                  {step.title}
                </p>
              </div>
              {isCompleted && (
                <div className="w-1 h-1 bg-secondary rounded-full shadow-[0_0_8px_#00DFD8]" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[10px] text-secondary font-bold uppercase tracking-wider">Pro Account</div>
            <div className="text-[10px] text-slate-500 font-bold">84%</div>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              className="bg-gradient-to-r from-primary to-secondary h-full rounded-full"
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-2 font-medium">Usage quota resets in 2d</div>
        </div>
      </div>
    </aside>
  );
};

const MetricsPanel = () => {
  const predictionData = [
    { name: 'Success', value: 84, color: '#00DFD8' },
    { name: 'Remaining', value: 16, color: '#1E293B' },
  ];

  const roiData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 700 },
    { name: 'Mar', value: 550 },
    { name: 'Apr', value: 900 },
  ];

  return (
    <aside className="w-72 h-screen bg-sidebar border-l border-border fixed right-0 top-0 overflow-y-auto p-6 space-y-6 scrollbar-hide">
      {/* Prediction Widget */}
      <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
        <div className="text-center mb-4">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Score de Conversión
          </h3>
        </div>
        <div className="h-40 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={predictionData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={64}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {predictionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-white">84%</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Optimizado</span>
          </div>
        </div>
      </div>

      {/* ROI Indicator */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Proyección ROI
          </h3>
          <span className="text-xs text-primary font-bold">+12.4%</span>
        </div>
        <div className="h-20 flex items-end gap-1.5 px-1 pt-4">
          {roiData.map((d, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / 900) * 100}%` }}
              className={cn(
                "flex-1 rounded-t-sm transition-colors",
                i % 2 === 0 ? "bg-slate-700" : i === 3 ? "bg-secondary shadow-[0_0_10px_rgba(0,223,216,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(0,163,255,0.3)]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Interactive Map Mockup */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col h-48 group">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#00A3FF_0.5px,transparent_0.5px)] bg-[size:8px_8px]" />
        <div className="p-3 border-b border-slate-800 flex items-center justify-between z-10 bg-slate-900/50 backdrop-blur-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alcance Geográfico</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-secondary rounded-full" />
            <div className="w-1 h-1 bg-secondary rounded-full" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <div className="text-[10px] text-slate-600 text-center relative z-10 group-hover:text-slate-400 transition-colors">
            <div className="mb-1 font-bold">INTERACTIVE MAP INTERFACE</div>
            <div className="italic font-mono">Lon: -3.7037 / Lat: 40.4167</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
      </div>

      {/* Trackreport Timeline */}
      <div className="space-y-4 pt-2">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
          Trackreport Feed
        </h3>
        <div className="space-y-4 border-l border-slate-800 ml-1.5">
          {[
            { text: 'Análisis de branding completado', time: '2 min ago', active: true },
            { text: 'Modelado de audiencia contextual', time: 'En progreso', active: false },
            { text: 'Sincronización de API Mapbox', time: '1h ago', active: false }
          ].map((item, i) => (
            <div key={i} className="relative pl-5 group">
              <div className={cn(
                "absolute w-2 h-2 rounded-full -left-[5px] top-1 transition-all",
                item.active 
                  ? "bg-secondary shadow-[0_0_8px_#00DFD8]" 
                  : "bg-slate-700 group-hover:bg-slate-600"
              )} />
              <p className={cn(
                "text-[10px] leading-relaxed transition-colors",
                item.active ? "text-slate-200 font-medium" : "text-slate-500"
              )}>
                {item.text}
              </p>
              <p className="text-[9px] text-slate-600 italic mt-0.5">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const Workspace = ({ activeStep }: { activeStep: number }) => {
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-12">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Nombre Comercial</label>
                <input type="text" placeholder="Ej: TechFlow Solutions" className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">URL del Sitio Web</label>
                <input type="text" placeholder="https://..." className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Descripción de Producto (IA Core)</label>
                <textarea rows={5} placeholder="Describe qué hace tu negocio único..." className="w-full bg-sidebar border border-slate-800 rounded-xl p-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600 font-medium resize-none" />
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
                  <button className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                    <Search size={18} />
                    Escanear Mercado
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { name: 'Competidor A', score: 92, status: 'Líder', color: 'primary' },
                    { name: 'Competidor B', score: 78, status: 'Creciendo', color: 'secondary' },
                    { name: 'Competidor C', score: 64, status: 'Estable', color: 'slate-400' }
                  ].map((comp, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 group hover:border-primary/50 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                         <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 shadow-sm border border-slate-700">
                            <Globe size={20} />
                         </div>
                         <div className={cn(
                           "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest",
                           i === 0 ? "bg-primary/10 border-primary/20 text-primary" : "bg-slate-800 border-slate-700 text-slate-400"
                         )}>
                           {comp.status}
                         </div>
                      </div>
                      <p className="font-bold text-white text-lg mb-1">{comp.name}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${comp.score}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={cn(
                              "h-full",
                              i === 0 ? "bg-primary" : i === 1 ? "bg-secondary" : "bg-slate-600"
                            )}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{comp.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
             <h2 className="text-2xl font-bold text-white mb-3">Segmentación Inteligente</h2>
             <p className="text-slate-400 text-sm mb-8">Define los parámetros de búsqueda para que la IA escale tu alcance regional.</p>
             <div className="grid grid-cols-2 gap-8">
               <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Sector Industrial</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Tech', 'Real Estate', 'Retail', 'Health', 'Education', 'SaaS'].map((tag) => (
                        <button key={tag} className="px-4 py-2 rounded-lg bg-sidebar hover:bg-primary border border-slate-800 hover:border-primary text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                           {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Radio Geográfico</h4>
                      <span className="text-xs font-mono text-secondary">150 KM</span>
                    </div>
                    <input type="range" className="w-full accent-primary h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                      <span>Local</span>
                      <span>Regional</span>
                      <span>Global</span>
                    </div>
                  </div>
               </div>
               <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center group">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 border border-primary/20 shadow-[0_0_20px_rgba(0,163,255,0.1)] group-hover:shadow-[0_0_40px_rgba(0,163,255,0.2)] transition-all">
                     <Users size={40} />
                  </div>
                  <p className="text-4xl font-black text-white mb-1">12,480</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Prospectos Identificados</p>
                  <button className="mt-6 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                    Breakdown de audiencia <ChevronRight size={14} />
                  </button>
               </div>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
             <div className="flex items-center justify-between mb-8">
               <div>
                <h2 className="text-2xl font-bold text-white mb-2">Generador de Activos</h2>
                <p className="text-slate-400 text-sm">Contenido multicanal generado mediante modelos de lenguaje optimizados.</p>
               </div>
               <div className="flex gap-2">
                  <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full border border-secondary/20 uppercase tracking-widest">Tokens: 450</span>
               </div>
             </div>
             <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: LayoutIcon, name: 'Folletos AI', count: 12, color: 'primary' },
                  { icon: Mail, name: 'Newsletters', count: 5, color: 'secondary' },
                  { icon: FileText, name: 'Copywriting', count: 24, color: 'slate-400' },
                  { icon: Share2, name: 'Ad Assets', count: 18, color: 'accent' }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/50 hover:border-primary/30 transition-all cursor-pointer group">
                     <item.icon className="w-8 h-8 text-slate-500 group-hover:text-primary mb-4 transition-colors" />
                     <p className="font-bold text-white text-sm mb-1">{item.name}</p>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.count} Generados</p>
                  </div>
                ))}
             </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
             <h2 className="text-2xl font-bold text-white mb-2">Canales de Distribución</h2>
             <p className="text-slate-400 text-sm mb-8">Gestión de RRSS y automatización de hilos de conversación.</p>
             <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white border border-slate-700">
                         <Instagram size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white">Instagram Automation</p>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest tracking-widest uppercase">Connected</p>
                      </div>
                   </div>
                   <div className="bg-sidebar p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">
                         <span>Eficiencia de Post</span>
                         <span className="text-secondary">92%</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-secondary w-[92%]" />
                      </div>
                   </div>
                </div>
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 opacity-50 grayscale flex items-center justify-center group overflow-hidden relative">
                   <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] bg-[size:10px_10px] opacity-20" />
                   <div className="flex flex-col items-center text-center relative z-10">
                      <Facebook size={32} className="text-slate-600 mb-2" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connect Facebook Ads</p>
                   </div>
                </div>
             </div>
          </div>
        );
      case 6:
        return (
          <div className="bg-gradient-to-br from-slate-900 to-sidebar p-16 rounded-3xl border border-slate-800 text-white relative overflow-hidden flex flex-col items-center text-center">
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
             
             <div className="relative z-10 max-w-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-[0_20px_50px_rgba(0,163,255,0.2)] animate-pulse">
                   <Rocket size={40} className="text-white" />
                </div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">Todo Sistema Listo</h2>
                <p className="text-slate-400 mb-12 font-medium leading-relaxed">Has configurado los 6 pilares de tu estrategia. El motor de Marketai está listo para el despliegue masivo y la monitorización de resultados en real-time.</p>
                <button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 border border-white/10 group">
                   Lanzar Automatización Full
                   <Zap size={24} className="group-hover:fill-current transition-all" />
                </button>
                <div className="mt-8 flex items-center justify-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                   <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">24/7 Agent Monitoring Enabled</span>
                </div>
             </div>
          </div>
        );
      case 7:
        return (
          <div className="bg-slate-800/30 p-12 rounded-2xl border border-slate-700/50 flex flex-col items-center">
             <h2 className="text-2xl font-bold text-white mb-8 uppercase italic tracking-tight">Probabilidad de Éxito de Campaña</h2>
             <div className="w-80 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                         data={[
                            { value: 84, color: '#00DFD8' },
                            { value: 16, color: '#1E293B' }
                         ]}
                         cx="50%"
                         cy="100%"
                         startAngle={180}
                         endAngle={0}
                         innerRadius={100}
                         outerRadius={140}
                         paddingAngle={0}
                         dataKey="value"
                         stroke="none"
                      >
                         <Cell fill="#00DFD8" />
                         <Cell fill="#1E293B" />
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                   <span className="text-5xl font-black text-white">84%</span>
                   <span className="text-xs font-bold text-secondary uppercase tracking-widest">Optimización IA</span>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-8 mt-12 w-full">
                {[
                  { label: 'Confianza', value: 'Muy Alta' },
                  { label: 'Volatilidad', value: 'Baja' },
                  { label: 'Escalabilidad', value: '15.5x' }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-white uppercase italic">{item.value}</p>
                  </div>
                ))}
             </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
               <div>
                <h2 className="text-2xl font-bold text-white mb-2 italic">Calculadora ROI Interactiva</h2>
                <p className="text-slate-400 text-sm italic">Simula escenarios financieros antes de ejecutar la automatización.</p>
               </div>
            </div>
            <ROICalculator />
          </div>
        );
      case 9:
        return (
          <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-8">
             <div>
              <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter italic">Trackreport Detallado</h2>
              <p className="text-slate-400 text-sm italic">Historial completo de acciones ejecutadas por el motor de IA.</p>
             </div>
             
             <div className="space-y-0">
               {[
                 { time: '10:45 AM', action: 'Detección de patrones en Competidor A', details: 'Aumento de actividad en LinkedIn detectado.', type: 'AI' },
                 { time: '09:30 AM', action: 'Generación de Newsletter Automática', details: 'Draft #4 ready para revisión.', type: 'GEN' },
                 { time: 'Yesterday', action: 'Sincronización de Base de Datos', details: '1,200 nuevos leads importados.', type: 'SYS' },
                 { time: 'Yesterday', action: 'Optimización de Mapas API', details: 'Carga de polígonos industriales completada.', type: 'MAP' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-6 group hover:bg-slate-900/40 p-6 rounded-xl transition-all border-b border-slate-800/50 last:border-0">
                    <div className="w-24 shrink-0">
                       <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{item.time}</p>
                       <span className="text-[8px] font-black bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase">{item.type}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                       <p className="text-sm font-bold text-white group-hover:text-primary transition-colors uppercase tracking-tight italic">{item.action}</p>
                       <p className="text-xs text-slate-500">{item.details}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 10:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Centro de Control de Datos</h3>
               <div className="h-64 bg-slate-900 rounded-xl overflow-hidden relative group border border-slate-800">
                  <div className="absolute inset-0 bg-[radial-gradient(#00A3FF_1px,transparent_1px)] bg-[size:12px_12px] opacity-10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 group-hover:scale-105 transition-transform duration-1000">
                     <MapIcon className="w-12 h-12 text-slate-800 mb-4" />
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">Visor Cartográfico Activo</p>
                     <p className="text-[9px] font-mono text-slate-600 mt-2">API: Mapbox GL JS v2.15.0</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex-1 bg-sidebar p-4 rounded-xl border border-slate-800 text-center">
                     <p className="text-2xl font-black text-white italic tracking-tighter">72</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nodos Locales</p>
                  </div>
                  <div className="flex-1 bg-sidebar p-4 rounded-xl border border-slate-800 text-center">
                     <p className="text-2xl font-black text-white italic tracking-tighter">1.2k</p>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Puntos de Venta</p>
                  </div>
               </div>
            </div>

            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 space-y-6">
               <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Gestión de Conexiones API</h3>
               <div className="space-y-3">
                 {[
                   { name: 'Google Workspace', status: 'Live', icon: Globe },
                   { name: 'Meta Ads Manager', status: 'Syncing', icon: Share2 },
                   { name: 'Mapbox Navigation', status: 'Ready', icon: MapIcon },
                   { name: 'Gemini 1.5 PRO', status: 'High Performance', icon: Zap }
                 ].map((api, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-sidebar rounded-xl border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-3">
                         <api.icon className="w-5 h-5 text-slate-500" />
                         <span className="text-sm font-bold text-slate-300 italic uppercase tracking-tighter">{api.name}</span>
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                        api.status === 'Live' || api.status === 'High Performance' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary/10 text-secondary'
                      )}>
                        {api.status}
                      </span>
                   </div>
                 ))}
               </div>
               <button className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                 <LinkIcon size={14} /> Conectar Nueva API
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="pl-64 pr-72 min-h-screen bg-surface">
      <header className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           Workspace <ChevronRight size={12} /> <span className="text-white">{STEPS[activeStep - 1].title}</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-sidebar/50 border border-slate-800 rounded-lg px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_#00DFD8]" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Agent Online</span>
           </div>
           <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 overflow-hidden cursor-pointer hover:bg-slate-700 transition-colors">
              <Search size={16} />
           </div>
        </div>
      </header>
      
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-2 mb-8">
               <h2 className="text-2xl font-black text-white tracking-tight italic uppercase">{STEPS[activeStep - 1].title}</h2>
               <div className="h-0.5 w-12 bg-primary rounded-full shadow-[0_0_10px_#00A3FF]" />
            </div>
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
};

// --- Main App ---

export default function MarketaiLayout() {
  const [activeStep, setStep] = React.useState(1);

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Sidebar activeStep={activeStep} setStep={setStep} />
      <Workspace activeStep={activeStep} />
      <MetricsPanel />
    </div>
  );
}
