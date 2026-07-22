import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { BLOCKS } from '@/lib/blocks';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Description requise' }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'sk-your-key-here') {
      return NextResponse.json({ error: 'Clé API OpenAI non configurée. Ajoutez OPENAI_API_KEY dans .env.local' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    const blockIds = Object.keys(BLOCKS).join(', ');

    const systemPrompt = `You are a Minecraft building expert. Generate a precise structure blueprint.

RULES:
1. Use ONLY these block IDs: ${blockIds}
2. Place blocks at integer (x,y,z) coordinates, y=0 is ground
3. Assign logical construction steps (foundation first, then walls, then roof)
4. 3-15 steps depending on complexity
5. Max size: 25x25x25
6. Respond with ONLY valid JSON

JSON FORMAT:
{
  "name": "Name in French",
  "description": "Description in French",
  "blocks": [
    {"position":{"x":0,"y":0,"z":0},"blockId":"stone_bricks","step":1}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a Minecraft structure: "${prompt}". Respond ONLY with valid JSON.` },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = response.choices[0]?.message?.content || '{}';
    // Clean markdown if present
    if (content.startsWith('```')) content = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    const parsed = JSON.parse(content);
    if (!parsed.blocks?.length) throw new Error('Aucun bloc généré');

    // Validate blocks
    const validBlocks = parsed.blocks
      .filter((b: any) => b.position && b.blockId && BLOCKS[b.blockId])
      .map((b: any) => ({
        position: { x: Math.round(b.position.x), y: Math.round(b.position.y), z: Math.round(b.position.z) },
        blockId: b.blockId,
        step: Math.max(1, b.step || 1),
      }));

    if (validBlocks.length === 0) throw new Error('Aucun bloc valide');

    return NextResponse.json({ name: parsed.name, description: parsed.description, blocks: validBlocks });
  } catch (e: any) {
    console.error('Generate error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
