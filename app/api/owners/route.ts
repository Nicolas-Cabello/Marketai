import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para máxima velocidad
let memoryDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { name, email, website, description } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Buscar si existe en memoria
    let owner = memoryDB.find(o => o.email === email);
    
    if (owner) {
      // Actualizar existente
      owner.name = name;
      owner.website = website;
      owner.description = description;
      owner.updatedAt = new Date().toISOString();
    } else {
      // Crear nuevo
      owner = {
        id: `owner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        email,
        website,
        description,
        businessName: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryDB.push(owner);
    }

    console.log(`✅ Owner saved: ${name} (${owner.id})`);

    return NextResponse.json(owner, { status: 201 });
  } catch (error) {
    console.error('Error saving owner data:', error);
    return NextResponse.json(
      { error: 'Failed to save owner data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const owner = memoryDB.find(o => o.email === email);

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(owner);
  } catch (error) {
    console.error('Error fetching owner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owner' },
      { status: 500 }
    );
  }
}