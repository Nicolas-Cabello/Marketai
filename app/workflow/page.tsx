'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MetricsPanel from '@/components/MetricsPanel';
import Workspace from '@/components/Workspace';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(1);
  const [ownerData, setOwnerData] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener el paso inicial de los parámetros URL
  React.useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 10) {
        setActiveStep(step);
      }
    }
  }, [searchParams]);

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