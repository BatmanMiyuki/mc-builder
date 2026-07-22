'use client';

import { useState, useMemo, useCallback } from 'react';
import { BUILD_LIBRARY, CATEGORIES, DIFFICULTY_CONFIG } from '@/lib/builds';
import { BuildEntry } from '@/lib/types';
import IsometricImage from '@/components/IsometricImage';

type View = 'gallery' | 'detail' | 'build';

export default function Home() {
  const [view, setView] = useState<View>('gallery');
  const [activeBuild, setActiveBuild] = useState<BuildEntry | null>(null);
  const [cat, setCat] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [favs, setFavs] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('mcb-favs') || '[]'); } catch { return []; }
    }
    return [];
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [tab, setTab] = useState<'tutorial' | 'materials'>('tutorial');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [showAi, setShowAi] = useState(false);

  const toggleFav = useCallback((id: string) => {
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem('mcb-favs', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    if (search) return BUILD_LIBRARY.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.tags.some(t => t.includes(search.toLowerCase())));
    if (cat === 'all') return BUILD_LIBRARY;
    if (cat === 'favs') return BUILD_LIBRARY.filter(b => favs.includes(b.id));
    return BUILD_LIBRARY.filter(b => b.category === cat);
  }, [cat, search, favs]);

  const openBuild = (build: BuildEntry) => { setActiveBuild(build); setCurrentStep(1); setView('detail'); setTab('tutorial'); };
  const startBuild = () => { setView('build'); setCurrentStep(1); };
  const backToGallery = () => { setView('gallery'); setActiveBuild(null); setShowAi(false); };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true); setAiError('');
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: aiPrompt }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');
      // Build a temp entry
      const blocks = data.blocks;
      const { getBlockColor, getBlockName } = await import('@/lib/blocks');
      const mm = new Map<string, number>();
      blocks.forEach((b: any) => mm.set(b.blockId, (mm.get(b.blockId) || 0) + 1));
      const materials = Array.from(mm.entries()).map(([blockId, count]) => ({ blockId, blockName: getBlockName(blockId), count, color: getBlockColor(blockId) })).sort((a: any, b: any) => b.count - a.count);
      const xs = blocks.map((b: any) => b.position.x), ys = blocks.map((b: any) => b.position.y), zs = blocks.map((b: any) => b.position.z);
      const struct = {
        name: data.name || 'Structure IA', description: data.description || 'Généré par IA',
        blocks, totalSteps: Math.max(...blocks.map((b: any) => b.step)),
        dimensions: { width: Math.max(...xs) - Math.min(...xs) + 1, height: Math.max(...ys) - Math.min(...ys) + 1, depth: Math.max(...zs) - Math.min(...zs) + 1 },
        materials,
      };
      setActiveBuild({ id: 'ai', name: struct.name, description: struct.description, category: 'fantasy', difficulty: 'medium', estimatedTime: 'IA', emoji: '🤖', tags: [], structure: struct });
      setCurrentStep(1); setView('build'); setTab('tutorial'); setShowAi(false);
    } catch (e: any) { setAiError(e.message); }
    setAiLoading(false);
  };

  const struct = activeBuild?.structure;
  const totalSteps = struct?.totalSteps || 1;
  const stepBlocks = struct ? struct.blocks.filter(b => b.step === currentStep) : [];
  const stepMats = useMemo(() => {
    const mm = new Map<string, number>();
    stepBlocks.forEach(b => mm.set(b.blockId, (mm.get(b.blockId) || 0) + 1));
    return Array.from(mm.entries()).map(([id, count]) => {
      const block = require('@/lib/blocks').BLOCKS[id];
      return { id, name: block?.name || id, count, color: block?.color || '#FF00FF' };
    }).sort((a: any, b: any) => b.count - a.count);
  }, [stepBlocks]);

  // ======== GALLERY ========
  if (view === 'gallery' && !showAi) return (
    <div className="h-[100dvh] flex flex-col bg-[#0f0f23]">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">🏗️ MC Builder</h1>
          <p className="text-[10px] text-gray-500">{BUILD_LIBRARY.length} tutoriels • 900+ blocs</p>
        </div>
        <button onClick={() => setShowAi(true)} className="px-3 py-1.5 bg-[#e94560] text-white text-xs font-medium rounded-lg shadow-lg shadow-[#e94560]/20">🤖 Générer IA</button>
      </div>
      <div className="px-4 pb-3">
        <input type="text" placeholder="🔍 Rechercher un build..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#1a1a2e] border border-[#0f3460] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e94560] transition-colors" />
      </div>
      <div className="px-4 pb-3 overflow-x-auto hide-sb">
        <div className="flex gap-2 min-w-max">
          {[{ id: 'all', name: 'Tous', icon: '📦' }, { id: 'favs', name: 'Favoris', icon: '⭐' }, ...CATEGORIES.slice(1)].map(c => (
            <button key={c.id} onClick={() => { setCat(c.id); setSearch(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${(c.id === 'all' && !search && cat === 'all') || cat === c.id ? 'bg-[#e94560] text-white shadow-lg' : 'bg-[#1a1a2e] text-gray-400'}`}>
              <span>{c.icon}</span><span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? <div className="py-16 text-center text-gray-400 text-sm">🔍 Aucun build trouvé</div> : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(build => (
              <div key={build.id} onClick={() => openBuild(build)} className="relative bg-[#1a1a2e] rounded-xl border border-[#0f3460]/50 overflow-hidden active:scale-[0.97] cursor-pointer fade-in hover:border-[#e94560]/40 transition-all">
                <div className="h-24 bg-gradient-to-br from-[#0f3460]/40 to-[#1a1a2e] flex items-center justify-center relative">
                  <span className="text-5xl float-anim">{build.emoji}</span>
                  <button onClick={e => { e.stopPropagation(); toggleFav(build.id); }} className="absolute top-2 right-2 p-1 rounded-full bg-black/30 backdrop-blur-sm">
                    <span className={`text-sm ${favs.includes(build.id) ? '' : 'grayscale opacity-40'}`}>⭐</span>
                  </button>
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: DIFFICULTY_CONFIG[build.difficulty].color + '30', color: DIFFICULTY_CONFIG[build.difficulty].color }}>
                    {DIFFICULTY_CONFIG[build.difficulty].name}
                  </span>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-semibold text-white truncate">{build.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400">⏱ {build.estimatedTime}</span>
                    <span className="text-[10px] text-gray-500">{build.structure.blocks.length} blocs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ======== AI GENERATOR ========
  if (showAi) return (
    <div className="h-[100dvh] flex flex-col bg-[#0f0f23]">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-[#0f3460]/30">
        <button onClick={() => setShowAi(false)} className="p-2 rounded-lg bg-[#0f3460]/50 text-white text-lg">←</button>
        <h1 className="text-lg font-bold text-white">🤖 Génération IA</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-sm text-gray-400">Décris la structure Minecraft que tu veux construire et l&apos;IA générera un plan détaillé bloc par bloc.</p>
        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Ex: Un château médiéval avec 4 tours, un mur d'enceinte et un pont-levis en bois..."
          className="w-full h-32 px-4 py-3 bg-[#1a1a2e] border border-[#0f3460] rounded-xl text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#e94560]" />
        {aiError && <p className="text-xs text-red-400 bg-red-500/10 p-3 rounded-lg">❌ {aiError}</p>}
        <button onClick={handleAiGenerate} disabled={aiLoading || !aiPrompt.trim()}
          className="w-full py-3 bg-gradient-to-r from-[#e94560] to-[#c73650] text-white font-medium rounded-xl disabled:opacity-50 shadow-lg shadow-[#e94560]/20">
          {aiLoading ? '⏳ Génération en cours...' : '🚀 Générer la structure'}
        </button>
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium">💡 Exemples :</p>
          {['Un petit pont en pierre au dessus d\'une rivière', 'Une tour de magicien avec escaliers en spirale', 'Une ferme automatique à blé', 'Un temple japonais avec jardin zen'].map(ex => (
            <button key={ex} onClick={() => setAiPrompt(ex)} className="w-full text-left px-3 py-2 text-xs text-gray-300 bg-[#1a1a2e]/50 rounded-lg border border-[#0f3460]/30 hover:border-[#e94560]/30 transition-colors">{ex}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ======== BUILD DETAIL ========
  if (view === 'detail') return (
    <div className="h-[100dvh] flex flex-col bg-[#0f0f23]">
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={backToGallery} className="p-2 rounded-lg bg-[#0f3460]/50 text-white text-lg">←</button>
        <button onClick={() => activeBuild && toggleFav(activeBuild.id)} className="p-2 rounded-lg bg-[#0f3460]/50">
          <span className={`text-lg ${favs.includes(activeBuild?.id || '') ? '' : 'grayscale opacity-40'}`}>⭐</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        {/* Preview */}
        {struct && (
          <div className="rounded-2xl overflow-hidden border border-[#0f3460]/30">
            <IsometricImage blocks={struct.blocks} currentStep={999} showAll={true} width={400} height={280} />
          </div>
        )}
        <h1 className="text-2xl font-bold text-white">{activeBuild?.emoji} {activeBuild?.name}</h1>
        <p className="text-sm text-gray-400">{activeBuild?.description}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: DIFFICULTY_CONFIG[activeBuild?.difficulty || 'easy'].color + '20', color: DIFFICULTY_CONFIG[activeBuild?.difficulty || 'easy'].color }}>
            {DIFFICULTY_CONFIG[activeBuild?.difficulty || 'easy'].name}
          </span>
          <span className="px-3 py-1 bg-[#0f3460]/30 text-gray-300 rounded-lg text-xs">⏱ {activeBuild?.estimatedTime}</span>
          <span className="px-3 py-1 bg-[#0f3460]/30 text-gray-300 rounded-lg text-xs">{struct?.blocks.length} blocs</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center border border-[#0f3460]/30"><p className="text-lg font-bold text-white">{struct?.totalSteps}</p><p className="text-[10px] text-gray-400">Étapes</p></div>
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center border border-[#0f3460]/30"><p className="text-lg font-bold text-white">{struct?.materials.length}</p><p className="text-[10px] text-gray-400">Types</p></div>
          <div className="bg-[#1a1a2e] rounded-xl p-3 text-center border border-[#0f3460]/30"><p className="text-lg font-bold text-white">{struct?.blocks.length}</p><p className="text-[10px] text-gray-400">Blocs</p></div>
        </div>
        <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#0f3460]/30">
          <h3 className="text-xs font-bold text-white mb-2">📦 Matériaux nécessaires</h3>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {struct?.materials.map(m => (
              <div key={m.blockId} className="flex items-center gap-2 px-2 py-1">
                <div className="w-4 h-4 rounded-sm border border-white/10 shrink-0" style={{ backgroundColor: m.color }} />
                <span className="flex-1 text-[11px] text-gray-300 truncate">{m.blockName}</span>
                <span className="text-[11px] font-bold text-white bg-[#0f3460]/50 px-1.5 py-0.5 rounded">×{m.count}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={startBuild} className="w-full py-4 bg-gradient-to-r from-[#5B8731] to-[#4a7028] text-white text-lg font-bold rounded-2xl shadow-lg shadow-[#5B8731]/20 active:scale-[0.98] transition-transform">
          🏗️ Commencer la construction
        </button>
      </div>
    </div>
  );

  // ======== BUILD TUTORIAL ========
  return (
    <div className="h-[100dvh] flex flex-col bg-[#0f0f23]">
      <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] border-b border-[#0f3460]/30">
        <button onClick={() => { setView('detail'); setCurrentStep(1); }} className="p-2 rounded-lg bg-[#0f3460]/50 text-white text-lg">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-white truncate">{activeBuild?.emoji} {activeBuild?.name}</h1>
          <p className="text-[10px] text-gray-400">Étape {currentStep} / {totalSteps}</p>
        </div>
      </div>
      <div className="flex border-b border-[#0f3460]/30">
        <button onClick={() => setTab('tutorial')} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === 'tutorial' ? 'text-[#e94560] border-b-2 border-[#e94560]' : 'text-gray-500'}`}>📋 Tutoriel</button>
        <button onClick={() => setTab('materials')} className={`flex-1 py-2.5 text-xs font-medium transition-colors ${tab === 'materials' ? 'text-[#e94560] border-b-2 border-[#e94560]' : 'text-gray-500'}`}>📦 Matériaux</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tab === 'tutorial' ? (
          <div className="space-y-3 p-3">
            {struct && (
              <div className="rounded-2xl overflow-hidden border border-[#0f3460]/30">
                <IsometricImage blocks={struct.blocks} currentStep={currentStep} showAll={false} width={400} height={300} />
              </div>
            )}
            <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#0f3460]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Étape {currentStep}</span>
                <span className="text-[10px] text-gray-400">{stepBlocks.length} blocs à placer</span>
              </div>
              <div className="w-full bg-[#0f0f23] rounded-full h-2">
                <div className="bg-gradient-to-r from-[#5B8731] to-[#e94560] h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
              </div>
            </div>
            <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#0f3460]/30">
              <p className="text-xs font-bold text-white mb-2">Blocs à placer :</p>
              <div className="space-y-1.5">
                {stepMats.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 bg-[#0f0f23]/50 rounded-lg">
                    <div className="w-5 h-5 rounded border-2 border-[#FFD700]/50 shrink-0" style={{ backgroundColor: m.color }} />
                    <span className="flex-1 text-xs text-gray-300">{m.name}</span>
                    <span className="text-xs font-bold text-[#FFD700]">×{m.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            <p className="text-xs text-gray-400 font-medium mb-2">Tous les matériaux nécessaires :</p>
            {struct?.materials.map(m => (
              <div key={m.blockId} className="flex items-center gap-2 px-3 py-2 bg-[#1a1a2e] rounded-lg border border-[#0f3460]/30">
                <div className="w-5 h-5 rounded border border-white/10 shrink-0" style={{ backgroundColor: m.color }} />
                <span className="flex-1 text-xs text-gray-300 truncate">{m.blockName}</span>
                <span className="text-xs font-bold text-white bg-[#0f3460]/50 px-2 py-0.5 rounded">×{m.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-3 py-3 bg-[#1a1a2e] border-t border-[#0f3460]/30">
        <div className="flex items-center gap-2">
          <button onClick={() => { setCurrentStep(1); setTab('tutorial'); }} disabled={currentStep <= 1} className="p-2.5 rounded-xl bg-[#0f3460]/50 text-white disabled:opacity-30 text-sm">⏮</button>
          <button onClick={() => { setCurrentStep(Math.max(1, currentStep - 1)); setTab('tutorial'); }} disabled={currentStep <= 1} className="flex-1 py-3 rounded-xl bg-[#0f3460]/50 text-white font-medium disabled:opacity-30 text-sm">◀ Précédent</button>
          <button onClick={() => { setCurrentStep(Math.min(totalSteps, currentStep + 1)); setTab('tutorial'); }} disabled={currentStep >= totalSteps} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#e94560] to-[#c73650] text-white font-bold disabled:opacity-30 text-sm">
            {currentStep >= totalSteps ? '✅ Fini !' : 'Suivant ▶'}
          </button>
          <button onClick={() => { setCurrentStep(totalSteps); setTab('tutorial'); }} disabled={currentStep >= totalSteps} className="p-2.5 rounded-xl bg-[#0f3460]/50 text-white disabled:opacity-30 text-sm">⏭</button>
        </div>
      </div>
    </div>
  );
}
