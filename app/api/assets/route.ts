import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para consistencia con otros pasos
let memoryAssetsDB: any[] = [];

// Función rápida para generar activos de marketing simulados
function generateMockAssets(businessDescription: string, assetTypes: string[] = ['all']) {
  const businessName = businessDescription.split(' ').slice(0, 2).join(' ') || 'Tu Negocio';
  
  return {
    marketIdeas: [
      `Expansión a mercados internacionales para ${businessName}`,
      `Programa de fidelización para clientes recurrentes`,
      `Colaboraciones estratégicas con influencers del sector`,
      `Desarrollo de productos premium`,
      `Implementación de tecnología AI para personalización`
    ],
    slogan: `${businessName} - Innovación que Transforma`,
    logoConcept: `Logo minimalista con gradiente de azul a verde, representando crecimiento y tecnología. Tipografía moderna y limpia.`,
    brochure: `Folleto corporativo de 8 páginas destacando: misión, visión, servicios, casos de éxito, testimonios y contacto. Diseño profesional con fotografías de alta calidad.`,
    newsletter: `Template mensual con: noticias destacadas, consejos útiles, promociones exclusivas, eventos próximos y sección de preguntas frecuentes. Diseño responsive y personalizable.`,
    banner: `Banner publicitario dinámico (1200x400px) con llamada a la acción clara. Animaciones sutiles y optimizado para conversiones.`
  };
}

export async function POST(request: NextRequest) {
  try {
    const { ownerId, businessDescription, assetTypes } = await request.json();

    if (!ownerId || !businessDescription) {
      return NextResponse.json(
        { error: 'Owner ID and business description are required' },
        { status: 400 }
      );
    }

    // Generar activos rápidos sin Gemini API
    const generatedContent = generateMockAssets(businessDescription, assetTypes);
    
    // Guardar en memoria
    const assets = {
      id: `assets_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      marketIdeas: JSON.stringify(generatedContent.marketIdeas),
      slogan: generatedContent.slogan,
      logoConcept: generatedContent.logoConcept,
      brochure: generatedContent.brochure,
      newsletter: generatedContent.newsletter,
      banner: generatedContent.banner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    memoryAssetsDB.push(assets);

    return NextResponse.json({
      ...assets,
      generatedContent: generatedContent
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating assets:', error);
    return NextResponse.json(
      { error: 'Failed to generate marketing assets' },
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

    const assets = memoryAssetsDB
      .filter(a => a.ownerId === ownerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (assets) {
      return NextResponse.json({
        ...assets,
        marketIdeas: JSON.parse(assets.marketIdeas || '[]')
      });
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error('Error fetching generated assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generated assets' },
      { status: 500 }
    );
  }
}