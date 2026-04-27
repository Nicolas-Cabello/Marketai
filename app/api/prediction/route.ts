import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para consistencia
let predictions: any[] = [];

// Generador de predicciones inteligente (reemplaza a Gemini)
function generatePrediction(businessData: any): string {
  const businessName = businessData.businessName || 'Tu Negocio';
  const businessDescription = businessData.businessDescription || '';
  
  // Análisis basado en la descripción del negocio
  let successRate = 75;
  let factors = [];
  let insights = [];
  
  // Factores de éxito basados en palabras clave
  if (businessDescription.toLowerCase().includes('tecnología') || 
      businessDescription.toLowerCase().includes('technology')) {
    successRate += 10;
    factors.push('Alta demanda en sector tecnológico');
    insights.push('El mercado tecnológico está en crecimiento acelerado');
  }
  
  if (businessDescription.toLowerCase().includes('marketing') || 
      businessDescription.toLowerCase().includes('publicidad')) {
    successRate += 8;
    factors.push('Necesidad constante de marketing digital');
    insights.push('Las empresas invierten cada vez más en marketing digital');
  }
  
  if (businessDescription.toLowerCase().includes('servicios') || 
      businessDescription.toLowerCase().includes('services')) {
    successRate += 5;
    factors.push('Modelo de negocio escalable');
    insights.push('Los servicios digitales tienen bajos costos variables');
  }
  
  if (businessDescription.toLowerCase().includes('ecommerce') || 
      businessDescription.toLowerCase().includes('ventas')) {
    successRate += 7;
    factors.push('Crecimiento del comercio electrónico');
    insights.push('El ecommerce sigue creciendo post-pandemia');
  }
  
  // Factores de riesgo
  if (businessDescription.length < 50) {
    successRate -= 10;
    factors.push('Descripción del negocio muy breve - mayor incertidumbre');
    insights.push('Se recomienda desarrollar más el modelo de negocio');
  }
  
  if (!businessDescription.toLowerCase().includes('cliente') && 
      !businessDescription.toLowerCase().includes('customer')) {
    successRate -= 5;
    factors.push('No se mencionan clientes explícitamente');
    insights.push('Definir claramente el público objetivo es crucial');
  }
  
  // Asegurar rango válido
  successRate = Math.max(20, Math.min(95, successRate));
  
  // Generar factores adicionales
  if (factors.length < 4) {
    factors.push(
      'Mercado digital en expansión',
      'Potencial de automatización',
      'Escalabilidad del modelo'
    );
  }
  
  if (insights.length < 3) {
    insights.push(
      'La transformación digital crea nuevas oportunidades',
      'El marketing personalizado aumenta la conversión'
    );
  }
  
  const prediction = {
    successRate,
    factors,
    insights,
    marketAnalysis: {
      trend: 'creciente',
      competition: 'moderada',
      opportunity: 'alta'
    },
    recommendations: [
      'Enfocarse en SEO y contenido de valor',
      'Implementar automatización de marketing',
      'Desarrollar propuesta de valor única',
      'Crear sistema de métricas y KPIs'
    ]
  };
  
  return JSON.stringify(prediction);
}

export async function POST(request: NextRequest) {
  try {
    const { ownerId, businessData } = await request.json();

    if (!ownerId || !businessData) {
      return NextResponse.json(
        { error: 'Owner ID and business data are required' },
        { status: 400 }
      );
    }

    // Generar predicción con nuestro sistema inteligente
    const predictionResult = generatePrediction(businessData);
    
    // Parsear el resultado
    let parsedPrediction;
    try {
      parsedPrediction = JSON.parse(predictionResult);
    } catch (parseError) {
      // Si falla el parseo, crear una estructura básica
      parsedPrediction = {
        successRate: 75,
        factors: ["Análisis de mercado favorable"],
        insights: "Predicción generada exitosamente"
      };
    }

    // Crear nueva predicción
    const newPrediction = {
      id: `prediction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      successRate: parsedPrediction.successRate || 75,
      factors: parsedPrediction.factors || {},
      insights: parsedPrediction.insights || predictionResult,
      analysis: parsedPrediction,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert: eliminar existente y agregar nueva
    predictions = predictions.filter(p => p.ownerId !== ownerId);
    predictions.push(newPrediction);

    return NextResponse.json(newPrediction, { status: 201 });

  } catch (error) {
    console.error('Error creating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID parameter is required' },
        { status: 400 }
      );
    }

    const prediction = predictions.find(p => p.ownerId === ownerId);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prediction' },
      { status: 500 }
    );
  }
}