import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, askingPrice, address, agentEmail } = body;

    if (!title || !askingPrice || !address) {
      return NextResponse.json(
        { error: 'Missing required deal parameters (title, askingPrice, address)' },
        { status: 422 }
      );
    }

    // Active Database Connection & Write Probe
    // We execute active write against Prisma ORM
    const newListing = await prisma.listing.create({
      data: {
        title,
        askingPrice,
        address,
        locationTag: 'Lekki Phase 1',
        tenant: {
          connectOrCreate: {
            where: { id: '00000000-0000-0000-0000-000000000001' },
            create: {
              id: '00000000-0000-0000-0000-000000000001',
              name: 'Lekki Central Brokerage',
              jurisdiction: 'Lagos-Lekki',
            },
          },
        },
        agent: {
          connectOrCreate: {
            where: { email: agentEmail || 'agent.lekki@realme.ng' },
            create: {
              fullName: 'Tunde Bakare',
              email: agentEmail || 'agent.lekki@realme.ng',
              tenantId: '00000000-0000-0000-0000-000000000001',
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: 'created',
        message: 'Fiduciary listing record successfully committed to database',
        data: {
          id: newListing.id,
          createdAt: newListing.createdAt,
          title: newListing.title,
          askingPrice: newListing.askingPrice,
        },
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[DATABASE_WRITE_ERROR]', error.message || error);

    // Anti-False-Success Principle: Fail closed with HTTP 503 rather than masking with mock 200
    return NextResponse.json(
      {
        status: 'error',
        code: 'DATABASE_MUTATION_FAILED',
        message: 'Underlying database unreachable. Write rejected to prevent data loss.',
        diagnostic_detail: error.message,
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  }
}

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ status: 'success', data: listings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        code: 'DATABASE_QUERY_FAILED',
        message: 'Unable to query database records.',
        diagnostic_detail: error.message,
      },
      { status: 503 }
    );
  }
}

