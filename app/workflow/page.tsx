'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricsPanel from '@/components/MetricsPanel';
import Workspace from '@/components/Workspace';
import { useRouter } from 'next/navigation';

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(1);
  const [ownerData, setOwnerData] = useState<any>(null);
  const router = useRouter();

  // Obtener el paso inicial de la URL usando window.location (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stepParam = urlParams.get('step');
      if (stepParam) {
        const step = parseInt(stepParam);
        if (step >= 1 && step <= 10) {
          setActiveStep(step);
        }
      }
    }
  }, []);

  const handleOwnerData = (data: any) => {
    setOwnerData(data);
    console.log('Owner data saved:', data);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar activeStep={activeStep} setStep={setActiveStep} />
      <Workspace activeStep={activeStep} onOwnerData={handleOwnerData} />
      <MetricsPanel />
    </div>
  );
}

export default function Workflow() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Cargando Workflow...</h3>
          <p className="text-slate-400">Preparando tu espacio de trabajo</p>
        </div>
      </div>
    }>
      <WorkflowContent />
    </Suspense>
  );
}