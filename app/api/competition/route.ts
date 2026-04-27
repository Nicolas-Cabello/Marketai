import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para consistencia con owners
let memoryCompetitionDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { ownerId, competitors, businessDescription } = await request.json();

    if (!ownerId || !competitors || !Array.isArray(competitors)) {
      return NextResponse.json(
        { error: 'Owner ID and competitors array are required' },
        { status: 400 }
      );
    }

    // Generar análisis rápido sin Gemini API
    const analysisResult = {
      analysis: "Análisis competitivo generado automáticamente",
      gaps: ["Oportunidad en mercado local", "Mejora en servicio al cliente", "Expansión a nuevos segmentos"],
      insights: "Los competidores muestran fortalezas en tecnología pero debilidades en atención personalizada",
      scores: competitors.map((_, i) => Math.max(60, 92 - (i * 10))),
      recommendations: [
        "Enfocarse en servicio al cliente diferenciado",
        "Desarrollar tecnología propietaria",
        "Crear programas de lealtad"
      ]
    };
    
    // Guardar en memoria (sin validación de foreign key)
    const analysis = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      competitors: JSON.stringify(competitors),
      gaps: JSON.stringify({ gaps: analysisResult.gaps }),
      insights: JSON.stringify(analysisResult),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    memoryCompetitionDB.push(analysis);

    return NextResponse.json({
      ...analysis,
      analysisData: analysisResult
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating competition analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create competition analysis' },
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

    const analysis = memoryCompetitionDB
      .filter(a => a.ownerId === ownerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching competition analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competition analysis' },
      { status: 500 }
    );
  }
}