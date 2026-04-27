'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STEPS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeStep: number;
  setStep: (id: number) => void;
}

export default function Sidebar({ activeStep, setStep }: SidebarProps) {
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
}