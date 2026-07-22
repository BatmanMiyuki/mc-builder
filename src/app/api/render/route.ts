import { NextRequest, NextResponse } from 'next/server';
import { renderIsometric, renderOverview } from '@/lib/renderer';
import { PlacedBlock } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blocks, currentStep, showAll, width, height } = body as {
      blocks: PlacedBlock[];
      currentStep: number;
      showAll: boolean;
      width?: number;
      height?: number;
    };

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Blocs requis' }, { status: 400 });
    }

    const w = width || 400;
    const h = height || 300;

    let imageBuffer: Buffer;
    if (showAll) {
      imageBuffer = renderOverview(blocks, w, h);
    } else {
      imageBuffer = renderIsometric(blocks, {
        width: w,
        height: h,
        currentStep: currentStep || 1,
        showAll: false,
      });
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (e: any) {
    console.error('Render error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
