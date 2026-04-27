import { NextRequest, NextResponse } from 'next/server';

// Función rápida para generar leads simulados
function generateMockLeads(sector?: string, location?: string, limit: number = 50) {
  const firstNames = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofía', 'Miguel', 'Elena', 'Pedro', 'Laura'];
  const lastNames = ['García', 'Rodríguez', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Díaz', 'Hernández', 'Castro'];
  const companies = ['TechCorp', 'InnovateLab', 'DigitalPro', 'CloudSoft', 'DataMind', 'WebFlow', 'CodeBase', 'TechStart', 'DevHub', 'SmartSys'];
  const positions = ['CEO', 'CTO', 'Product Manager', 'Marketing Director', 'Sales Manager', 'Operations Lead', 'Technical Lead'];
  const industries = sector ? [sector] : ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Education'];
  
  const leads = [];
  for (let i = 0; i < limit; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    
    leads.push({
      id: `lead_${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
      company,
      position,
      location: location || 'Madrid, Spain',
      industry,
      phone: `+34 9${Math.floor(Math.random() * 900000000) + 100000000}`,
      website: `https://${company.toLowerCase()}.com`,
      score: Math.floor(Math.random() * 40) + 60, // Scores entre 60-100
      status: Math.random() > 0.5 ? 'active' : 'prospect'
    });
  }
  
  return leads;
}

export async function POST(request: NextRequest) {
  try {
    const { sector, location, keywords, limit = 50 } = await request.json();

    if (!sector && !location && !keywords) {
      return NextResponse.json(
        { error: 'At least one search parameter is required' },
        { status: 400 }
      );
    }

    // Generar leads rápidos sin scraping
    const leads = generateMockLeads(sector, location, limit);

    return NextResponse.json({
      leads,
      total: leads.length,
      searchParams: { sector, location, keywords }
    });

  } catch (error) {
    console.error('Error searching for leads:', error);
    return NextResponse.json(
      { error: 'Failed to search for leads' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector');
    const location = searchParams.get('location');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!sector && !location) {
      return NextResponse.json(
        { error: 'Sector or location parameter is required' },
        { status: 400 }
      );
    }

    // Generar leads rápidos sin scraping
    const leads = generateMockLeads(sector || undefined, location || undefined, limit);

    return NextResponse.json({
      leads,
      total: leads.length
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}