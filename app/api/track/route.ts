import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para el Paso 9 - recolecta datos de todos los pasos
let trackDataStore: any = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

    // Si ya tenemos datos guardados, devolverlos
    if (trackDataStore[ownerId]) {
      return NextResponse.json(trackDataStore[ownerId]);
    }

    // Generar datos de seguimiento simulados basados en el ownerId
    const mockTrackData = generateMockTrackData(ownerId);
    
    // Guardar en el store
    trackDataStore[ownerId] = mockTrackData;

    return NextResponse.json(mockTrackData);
  } catch (error) {
    console.error('Error fetching track data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ownerId, action, data } = await request.json();

    if (!ownerId || !action) {
      return NextResponse.json({ error: 'Owner ID and action are required' }, { status: 400 });
    }

    // Guardar evento de seguimiento
    const trackEvent = {
      id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      action,
      data: data || {},
      timestamp: new Date(),
    };

    // Si no existe datos para este owner, crearlos
    if (!trackDataStore[ownerId]) {
      trackDataStore[ownerId] = generateMockTrackData(ownerId);
    }

    // Agregar evento al timeline
    trackDataStore[ownerId].timeline.push({
      type: action,
      title: getEventTitle(action),
      description: getEventDescription(action, data),
      timestamp: trackEvent.timestamp,
      icon: getEventIcon(action),
      color: getEventColor(action),
    });

    // Actualizar métricas según el evento
    updateMetricsFromEvent(trackDataStore[ownerId], action, data);

    return NextResponse.json({ success: true, trackEvent });
  } catch (error) {
    console.error('Error saving track event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMockTrackData(ownerId: string) {
  const completionScore = Math.floor(Math.random() * 30) + 70; // 70-100%
  const engagementScore = Math.floor(Math.random() * 40) + 60; // 60-100%
  const potentialScore = Math.floor(Math.random() * 35) + 65; // 65-100%

  const mockOwner = {
    id: ownerId,
    name: 'Usuario Demo',
    email: 'demo@empresa.com',
    website: 'https://demo.com',
    description: 'Empresa de tecnología especializada en soluciones digitales',
    businessName: 'Tech Solutions Demo',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    updatedAt: new Date(),
  };

  return {
    owner: mockOwner,
    summary: {
      totalCompetitors: Math.floor(Math.random() * 10) + 3,
      totalLeads: Math.floor(Math.random() * 50) + 10,
      totalAssets: Math.floor(Math.random() * 15) + 5,
      hasSocialStrategy: true,
      latestPrediction: {
        successRate: Math.floor(Math.random() * 30) + 70,
        factors: ['Mercado favorable', 'Buena propuesta de valor'],
        insights: 'Alto potencial de crecimiento'
      },
      latestRoiCalculation: {
        roiPercentage: Math.floor(Math.random() * 100) + 50,
        budget: 1000,
        revenue: 2500
      }
    },
    timeline: generateMockTimeline(),
    metrics: {
      completionScore,
      engagementScore,
      potentialScore,
      totalActivities: Math.floor(Math.random() * 30) + 15
    },
    recommendations: generateMockRecommendations(completionScore),
  };
}

function generateMockTimeline() {
  const events = [];
  const baseTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 días atrás

  events.push({
    type: 'owner_created',
    title: 'Negocio Registrado',
    description: 'Se registró el negocio: Tech Solutions Demo',
    timestamp: new Date(baseTime),
    icon: '🏢',
    color: '#00A3FF',
  });

  events.push({
    type: 'competition_analyzed',
    title: 'Competencia Analizada',
    description: 'Se analizaron 5 competidores principales',
    timestamp: new Date(baseTime + 1 * 24 * 60 * 60 * 1000),
    icon: '🏪',
    color: '#00DFD8',
  });

  events.push({
    type: 'filters_defined',
    title: 'Filtros Definidos',
    description: 'Se configuraron los filtros de cliente ideal',
    timestamp: new Date(baseTime + 2 * 24 * 60 * 60 * 1000),
    icon: '🎯',
    color: '#00A3FF',
  });

  events.push({
    type: 'leads_found',
    title: 'Leads Encontrados',
    description: 'Se encontraron 25 clientes potenciales',
    timestamp: new Date(baseTime + 3 * 24 * 60 * 60 * 1000),
    icon: '👤',
    color: '#00DFD8',
  });

  events.push({
    type: 'assets_generated',
    title: 'Activos Generados',
    description: 'Se crearon 8 activos de marketing',
    timestamp: new Date(baseTime + 4 * 24 * 60 * 60 * 1000),
    icon: '📄',
    color: '#00A3FF',
  });

  events.push({
    type: 'social_strategy_created',
    title: 'Estrategia Social Creada',
    description: 'Se configuró la estrategia de redes sociales',
    timestamp: new Date(baseTime + 5 * 24 * 60 * 60 * 1000),
    icon: '📱',
    color: '#00DFD8',
  });

  events.push({
    type: 'prediction_generated',
    title: 'Predicción Generada',
    description: 'Probabilidad de éxito: 85%',
    timestamp: new Date(baseTime + 6 * 24 * 60 * 60 * 1000),
    icon: '🎯',
    color: '#00A3FF',
  });

  return events;
}

function generateMockRecommendations(completionScore: number) {
  const recommendations = [];

  if (completionScore < 80) {
    recommendations.push({
      type: 'incomplete_workflow',
      priority: 'high',
      title: 'Completa el Workflow',
      description: 'Te faltan algunos pasos por completar para maximizar tus resultados.',
      action: 'Continuar',
      step: 1,
    });
  }

  recommendations.push({
    type: 'optimize_campaign',
    priority: 'medium',
    title: 'Optimiza Campaña',
    description: 'Ajusta tus parámetros de campaña para mejorar el ROI.',
    action: 'Ir al Paso 8',
    step: 8,
  });

  recommendations.push({
    type: 'generate_more_assets',
    priority: 'low',
    title: 'Crea Más Activos',
    description: 'Genera contenido adicional para diversificar tu estrategia.',
    action: 'Ir al Paso 5',
    step: 5,
  });

  return recommendations;
}

function getEventTitle(action: string) {
  const titles: Record<string, string> = {
    'step_completed': 'Paso Completado',
    'data_updated': 'Datos Actualizados',
    'campaign_optimized': 'Campaña Optimizada',
    'assets_generated': 'Activos Generados',
  };
  return titles[action] || 'Actividad Registrada';
}

function getEventDescription(action: string, data: any) {
  const descriptions: Record<string, string> = {
    'step_completed': `Se completó el paso ${data?.step || 'desconocido'}`,
    'data_updated': 'Se actualizaron los datos del negocio',
    'campaign_optimized': 'Se optimizaron los parámetros de campaña',
    'assets_generated': 'Se generaron nuevos activos de marketing',
  };
  return descriptions[action] || 'Se registró una nueva actividad';
}

function getEventIcon(action: string) {
  const icons: Record<string, string> = {
    'step_completed': '✅',
    'data_updated': '🔄',
    'campaign_optimized': '📈',
    'assets_generated': '📄',
  };
  return icons[action] || '📌';
}

function getEventColor(action: string) {
  const colors: Record<string, string> = {
    'step_completed': '#10B981',
    'data_updated': '#3B82F6',
    'campaign_optimized': '#8B5CF6',
    'assets_generated': '#F59E0B',
  };
  return colors[action] || '#6B7280';
}

function updateMetricsFromEvent(trackData: any, action: string, data: any) {
  // Actualizar métricas basadas en el evento
  switch (action) {
    case 'step_completed':
      trackData.metrics.completionScore = Math.min(100, trackData.metrics.completionScore + 5);
      trackData.metrics.totalActivities += 1;
      break;
    case 'campaign_optimized':
      trackData.metrics.engagementScore = Math.min(100, trackData.metrics.engagementScore + 10);
      trackData.metrics.totalActivities += 1;
      break;
    case 'assets_generated':
      trackData.metrics.totalActivities += (data?.count || 1);
      break;
  }
}

function generateTimeline(owner: any) {
  const events = [];

  // Evento de creación del propietario
  events.push({
    type: 'owner_created',
    title: 'Negocio Registrado',
    description: `Se registró el negocio: ${owner.businessName}`,
    timestamp: owner.createdAt,
    icon: '🏢',
    color: '#00A3FF',
  });

  // Eventos de competidores
  owner.competitors.forEach((competitor: any, index: number) => {
    events.push({
      type: 'competitor_added',
      title: `Competidor ${index + 1} Agregado`,
      description: `Se analizó a: ${competitor.name}`,
      timestamp: competitor.createdAt,
      icon: '🏪',
      color: '#00DFD8',
    });
  });

  // Eventos de leads
  owner.leads.forEach((lead: any, index: number) => {
    events.push({
      type: 'lead_found',
      title: `Lead ${index + 1} Encontrado`,
      description: `Nuevo lead: ${lead.name}`,
      timestamp: lead.createdAt,
      icon: '👤',
      color: '#00A3FF',
    });
  });

  // Eventos de activos
  owner.assets.forEach((asset: any, index: number) => {
    events.push({
      type: 'asset_generated',
      title: `Activo ${index + 1} Generado`,
      description: `Se generó: ${asset.type}`,
      timestamp: asset.createdAt,
      icon: '📄',
      color: '#00DFD8',
    });
  });

  // Evento de estrategia social
  if (owner.socialStrategy) {
    events.push({
      type: 'social_strategy_created',
      title: 'Estrategia Social Creada',
      description: 'Se configuró la estrategia de redes sociales',
      timestamp: owner.socialStrategy.createdAt,
      icon: '📱',
      color: '#00A3FF',
    });
  }

  // Eventos de predicción
  owner.predictions.forEach((prediction: any) => {
    events.push({
      type: 'prediction_generated',
      title: 'Predicción Generada',
      description: `Probabilidad de éxito: ${prediction.successRate}%`,
      timestamp: prediction.createdAt,
      icon: '🎯',
      color: '#00DFD8',
    });
  });

  // Eventos de ROI
  owner.roiCalculations.forEach((roi: any) => {
    events.push({
      type: 'roi_calculated',
      title: 'ROI Calculado',
      description: `ROI proyectado: ${roi.roiPercentage}%`,
      timestamp: roi.createdAt,
      icon: '💰',
      color: '#00A3FF',
    });
  });

  // Ordenar eventos por timestamp
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function calculateMetrics(owner: any) {
  const metrics = {
    completionScore: 0,
    engagementScore: 0,
    potentialScore: 0,
    totalActivities: 0,
  };

  // Calcular score de completitud
  let completionSteps = 0;
  const totalSteps = 8;

  if (owner.businessName) completionSteps++;
  if (owner.customerFilters) completionSteps++;
  if (owner.competitors.length > 0) completionSteps++;
  if (owner.leads.length > 0) completionSteps++;
  if (owner.assets.length > 0) completionSteps++;
  if (owner.socialStrategy) completionSteps++;
  if (owner.predictions.length > 0) completionSteps++;
  if (owner.roiCalculations.length > 0) completionSteps++;

  metrics.completionScore = Math.round((completionSteps / totalSteps) * 100);

  // Calcular score de engagement
  metrics.totalActivities = 
    owner.competitors.length + 
    owner.leads.length + 
    owner.assets.length + 
    owner.predictions.length + 
    owner.roiCalculations.length;

  metrics.engagementScore = Math.min(100, metrics.totalActivities * 10);

  // Calcular score de potencial
  const latestPrediction = owner.predictions[owner.predictions.length - 1];
  const latestRoi = owner.roiCalculations[owner.roiCalculations.length - 1];

  if (latestPrediction && latestRoi) {
    metrics.potentialScore = Math.round(
      (latestPrediction.successRate * 0.6 + latestRoi.roiPercentage * 0.4)
    );
  } else if (latestPrediction) {
    metrics.potentialScore = latestPrediction.successRate;
  } else if (latestRoi) {
    metrics.potentialScore = latestRoi.roiPercentage;
  } else {
    metrics.potentialScore = 50;
  }

  return metrics;
}

function generateRecommendations(owner: any) {
  const recommendations = [];

  // Recomendaciones basadas en datos faltantes
  if (!owner.customerFilters) {
    recommendations.push({
      type: 'missing_filters',
      priority: 'high',
      title: 'Define tu Cliente Ideal',
      description: 'Configura los filtros de cliente para mejorar la precisión de tus búsquedas.',
      action: 'Ir al Paso 3',
      step: 3,
    });
  }

  if (owner.competitors.length === 0) {
    recommendations.push({
      type: 'missing_competitors',
      priority: 'high',
      title: 'Analiza a tu Competencia',
      description: 'Agrega competidores para identificar oportunidades y diferenciarte.',
      action: 'Ir al Paso 2',
      step: 2,
    });
  }

  if (owner.leads.length < 5) {
    recommendations.push({
      type: 'few_leads',
      priority: 'medium',
      title: 'Busca Más Leads',
      description: 'Encuentra más clientes potenciales para aumentar tus oportunidades.',
      action: 'Ir al Paso 4',
      step: 4,
    });
  }

  if (owner.assets.length === 0) {
    recommendations.push({
      type: 'missing_assets',
      priority: 'medium',
      title: 'Genera Activos de Marketing',
      description: 'Crea contenido profesional para tu estrategia de marketing.',
      action: 'Ir al Paso 5',
      step: 5,
    });
  }

  if (!owner.socialStrategy) {
    recommendations.push({
      type: 'missing_social',
      priority: 'medium',
      title: 'Configura Estrategia Social',
      description: 'Define tu estrategia de redes sociales para reach orgánico.',
      action: 'Ir al Paso 6',
      step: 6,
    });
  }

  const latestPrediction = owner.predictions[owner.predictions.length - 1];
  if (!latestPrediction) {
    recommendations.push({
      type: 'missing_prediction',
      priority: 'low',
      title: 'Obtén Predicción de IA',
      description: 'Usa IA para analizar la probabilidad de éxito de tu estrategia.',
      action: 'Ir al Paso 7',
      step: 7,
    });
  } else if (latestPrediction.successRate < 70) {
    recommendations.push({
      type: 'low_prediction',
      priority: 'high',
      title: 'Mejora tu Estrategia',
      description: 'Tu probabilidad de éxito es baja. Considera ajustar tu enfoque.',
      action: 'Revisar Estrategia',
      step: 1,
    });
  }

  return recommendations.sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}