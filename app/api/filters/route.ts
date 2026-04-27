import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para consistencia con otros pasos
let memoryFiltersDB: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { ownerId, sector, location, idealCustomer } = await request.json();

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    // Buscar si ya existe filtro para este owner
    let filters = memoryFiltersDB.find(f => f.ownerId === ownerId);
    
    if (filters) {
      // Actualizar existente
      filters.sector = sector;
      filters.location = location;
      filters.idealCustomer = JSON.stringify(idealCustomer);
      filters.updatedAt = new Date().toISOString();
    } else {
      // Crear nuevo
      filters = {
        id: `filters_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ownerId,
        sector,
        location,
        idealCustomer: JSON.stringify(idealCustomer),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryFiltersDB.push(filters);
    }

    return NextResponse.json({
      ...filters,
      idealCustomer: JSON.parse(filters.idealCustomer || '{}')
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving customer filters:', error);
    return NextResponse.json(
      { error: 'Failed to save customer filters' },
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

    const filters = memoryFiltersDB.find(f => f.ownerId === ownerId);

    if (!filters) {
      return NextResponse.json(null);
    }

    // Parsear el JSON de idealCustomer
    return NextResponse.json({
      ...filters,
      idealCustomer: JSON.parse(filters.idealCustomer || '{}')
    });
  } catch (error) {
    console.error('Error fetching customer filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer filters' },
      { status: 500 }
    );
  }
}