import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para el mapa
let mapDataStore: any = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

    // Obtener datos del mapa existentes o crear nuevos
    let mapData = mapDataStore[ownerId];

    if (!mapData) {
      // Crear datos iniciales del mapa con leads simulados
      mapData = {
        id: `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        leads: generateMockLeads(),
        coordinates: {
          center: { lat: 40.7128, lng: -74.0060 }, // NYC por defecto
          zoom: 10,
        },
        apiEndpoints: {
          geocoding: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
          routing: 'https://api.mapbox.com/directions/v5/mapbox/driving/',
          tiles: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Guardar en el store
      mapDataStore[ownerId] = mapData;
    }

    return NextResponse.json(mapData);
  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ownerId, coordinates, leadId, action } = await request.json();

    if (!ownerId) {
      return NextResponse.json({ error: 'Owner ID is required' }, { status: 400 });
    }

    let mapData = mapDataStore[ownerId];

    if (!mapData) {
      // Crear si no existe
      mapData = {
        id: `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        leads: generateMockLeads(),
        coordinates: {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 10,
        },
        apiEndpoints: {
          geocoding: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
          routing: 'https://api.mapbox.com/directions/v5/mapbox/driving/',
          tiles: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mapDataStore[ownerId] = mapData;
    }

    // Actualizar coordenadas del centro del mapa
    if (coordinates) {
      mapData.coordinates = {
        ...mapData.coordinates,
        center: coordinates,
      };
      mapData.updatedAt = new Date();
    }

    // Actualizar lead específico
    if (leadId && action) {
      const leadIndex = mapData.leads.findIndex((lead: any) => lead.id === leadId);

      if (leadIndex !== -1) {
        if (action === 'update_priority') {
          const { priority } = await request.json();
          mapData.leads[leadIndex].priority = priority;
        } else if (action === 'update_notes') {
          const { notes } = await request.json();
          mapData.leads[leadIndex].notes = notes;
        }
        mapData.updatedAt = new Date();
      }
    }

    return NextResponse.json({ success: true, mapData });
  } catch (error) {
    console.error('Error updating map data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateMockLeads() {
  const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
    { name: 'Queens', lat: 40.7282, lng: -73.7949 },
    { name: 'Bronx', lat: 40.8448, lng: -73.8648 },
    { name: 'Manhattan', lat: 40.7831, lng: -73.9712 },
    { name: 'Jersey City', lat: 40.7178, lng: -74.0431 },
    { name: 'Hoboken', lat: 40.7440, lng: -74.0324 },
    { name: 'Weehawken', lat: 40.7674, lng: -74.0193 }
  ];

  const companies = [
    'TechCorp Solutions', 'Digital Marketing Pro', 'Innovation Labs', 
    'Cloud Systems Inc', 'Data Analytics Co', 'Web Development Studio',
    'Mobile App Factory', 'AI Technology Group', 'E-commerce Experts',
    'Social Media Agency', 'SEO Masters', 'Content Creation Hub'
  ];

  const industries = [
    'Technology', 'Marketing', 'Finance', 'Healthcare', 
    'Education', 'Retail', 'Manufacturing', 'Consulting'
  ];

  return cities.map((city, index) => ({
    id: `lead_${Date.now()}_${index}`,
    name: `Contact ${index + 1}`,
    email: `contact${index + 1}@${companies[index % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
    company: companies[index % companies.length],
    position: ['CEO', 'Marketing Director', 'CTO', 'Business Owner', 'Founder'][index % 5],
    industry: industries[index % industries.length],
    location: `${city.name}, NY`,
    coordinates: {
      lat: city.lat + (Math.random() - 0.5) * 0.05,
      lng: city.lng + (Math.random() - 0.5) * 0.05
    },
    address: `${100 + index * 10} Business Ave, ${city.name}, NY ${10000 + index}`,
    distance: Math.round(Math.random() * 50 * 10) / 10, // Distancia en km con 1 decimal
    priority: ['high', 'medium', 'low'][index % 3],
    phone: `+1 (555) ${100 + index}-${400 + index}`,
    website: `https://${companies[index % companies.length].toLowerCase().replace(/\s+/g, '')}.com`,
    revenue: `$${(Math.random() * 10 + 1).toFixed(1)}M`,
    employees: Math.floor(Math.random() * 500 + 10),
    notes: `Potential client from ${city.name}. Interested in digital transformation solutions.`,
    status: ['new', 'contacted', 'interested', 'qualified'][index % 4],
    score: Math.floor(Math.random() * 40 + 60), // 60-100
    lastContact: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
}