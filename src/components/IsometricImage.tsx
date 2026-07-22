'use client';

import { useState, useEffect } from 'react';
import { PlacedBlock } from '@/lib/types';

interface Props {
  blocks: PlacedBlock[];
  currentStep: number;
  showAll: boolean;
  width?: number;
  height?: number;
}

export default function IsometricImage({ blocks, currentStep, showAll, width = 400, height = 300 }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const controller = new AbortController();

    fetch('/api/render', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks, currentStep, showAll, width, height }),
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Render failed');
        return res.blob();
      })
      .then(blob => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setImageUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; });
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Render error:', err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [blocks, currentStep, showAll, width, height]);

  return (
    <div className="relative w-full" style={{ aspectRatio: `${width}/${height}` }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a2744] rounded-xl">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-white/20 border-t-[#e94560] rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Rendu en cours...</span>
          </div>
        </div>
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Étape ${currentStep}`}
          className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  );
}
