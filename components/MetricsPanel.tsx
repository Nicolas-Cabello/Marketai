'use client';

import React from 'react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export default function MetricsPanel() {
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
}