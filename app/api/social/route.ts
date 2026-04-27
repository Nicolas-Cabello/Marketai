import { NextRequest, NextResponse } from 'next/server';

// Base de datos en memoria para consistencia
let socialStrategies: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { ownerId, channels, strategy, schedule } = await request.json();

    if (!ownerId) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }

    // Crear nueva estrategia
    const newStrategy = {
      id: `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ownerId,
      channels: channels || [],
      strategy: strategy || '',
      schedule: schedule || {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Upsert: eliminar existente y agregar nueva
    socialStrategies = socialStrategies.filter(s => s.ownerId !== ownerId);
    socialStrategies.push(newStrategy);

    return NextResponse.json(newStrategy, { status: 201 });
  } catch (error) {
    console.error('Error creating social strategy:', error);
    return NextResponse.json(
      { error: 'Failed to create social strategy' },
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

    const strategy = socialStrategies.find(s => s.ownerId === ownerId);

    return NextResponse.json(strategy);
  } catch (error) {
    console.error('Error fetching social strategy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social strategy' },
      { status: 500 }
    );
  }
}