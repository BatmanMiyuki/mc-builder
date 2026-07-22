import { BuildEntry, PlacedBlock, Structure, MaterialCount } from './types';
import { BLOCKS, getBlockColor, getBlockName } from './blocks';

// Helpers
const rect = (x: number, y: number, z: number, w: number, d: number, bid: string, s: number): PlacedBlock[] => {
  const b: PlacedBlock[] = [];
  for (let bx = x; bx < x + w; bx++) for (let bz = z; bz < z + d; bz++) b.push({ position: { x: bx, y, z: bz }, blockId: bid, step: s });
  return b;
};
const walls = (x: number, y: number, z: number, w: number, d: number, bid: string, s: number): PlacedBlock[] => {
  const b: PlacedBlock[] = [];
  for (let bx = x; bx < x + w; bx++) { b.push({ position: { x: bx, y, z }, blockId: bid, step: s }); b.push({ position: { x: bx, y, z: z + d - 1 }, blockId: bid, step: s }); }
  for (let bz = z + 1; bz < z + d - 1; bz++) { b.push({ position: { x, y, z: bz }, blockId: bid, step: s }); b.push({ position: { x: x + w - 1, y, z: bz }, blockId: bid, step: s }); }
  return b;
};
const pil = (x: number, yS: number, z: number, h: number, bid: string, s: number): PlacedBlock[] => {
  const b: PlacedBlock[] = [];
  for (let y = yS; y < yS + h; y++) b.push({ position: { x, y, z }, blockId: bid, step: s + (y - yS) });
  return b;
};
const blk = (x: number, y: number, z: number, bid: string, s: number): PlacedBlock => ({ position: { x, y, z }, blockId: bid, step: s });

function mkS(name: string, desc: string, blocks: PlacedBlock[]): Structure {
  if (!blocks.length) return { name, description: desc, blocks: [], totalSteps: 1, dimensions: { width: 1, height: 1, depth: 1 }, materials: [] };
  const xs = blocks.map(b => b.position.x), ys = blocks.map(b => b.position.y), zs = blocks.map(b => b.position.z);
  const mm = new Map<string, number>();
  blocks.forEach(b => mm.set(b.blockId, (mm.get(b.blockId) || 0) + 1));
  const materials: MaterialCount[] = Array.from(mm.entries()).map(([blockId, count]) => ({ blockId, blockName: getBlockName(blockId), count, color: getBlockColor(blockId) })).sort((a, b) => b.count - a.count);
  return { name, description: desc, blocks, totalSteps: Math.max(...blocks.map(b => b.step)), dimensions: { width: Math.max(...xs) - Math.min(...xs) + 1, height: Math.max(...ys) - Math.min(...ys) + 1, depth: Math.max(...zs) - Math.min(...zs) + 1 }, materials };
}

export const BUILD_LIBRARY: BuildEntry[] = [
  { id: 'starter', name: 'Maison de départ', description: 'Petite maison en chêne parfaite pour débuter en survie. Simple, rapide et fonctionnelle.', category: 'houses', difficulty: 'easy', estimatedTime: '15 min', emoji: '🏠', tags: ['survie', 'débutant', 'bois'],
    structure: mkS('Maison de départ', 'Maison 7×7', [...rect(0,0,0,7,7,'cobblestone',1),...walls(0,1,0,7,7,'oak_planks',2),...walls(0,2,0,7,7,'oak_planks',3),...walls(0,3,0,7,7,'oak_planks',4),blk(3,2,0,'glass',4),blk(3,3,0,'glass',4),blk(5,2,0,'glass',4),blk(5,3,0,'glass',4),...rect(0,4,0,7,7,'oak_planks',5),...rect(1,5,1,5,5,'spruce_planks',6)]) },
  { id: 'desert', name: 'Maison du désert', description: 'Maison en grès adaptée au biome désert avec fenêtres.', category: 'houses', difficulty: 'easy', estimatedTime: '20 min', emoji: '🏜️', tags: ['désert', 'grès'],
    structure: mkS('Maison du désert', 'Maison 8×6', [...rect(0,0,0,8,6,'sandstone',1),...walls(0,1,0,8,6,'sandstone',2),...walls(0,2,0,8,6,'sandstone',3),...walls(0,3,0,8,6,'sandstone',4),blk(3,2,0,'glass',4),blk(4,2,0,'glass',4),...rect(0,4,0,8,6,'sandstone',5),...rect(1,5,1,6,4,'smooth_sandstone',6)]) },
  { id: 'treehouse', name: 'Cabane dans les arbres', description: 'Cabane perchée avec un tronc massif et des plateformes en bois.', category: 'houses', difficulty: 'medium', estimatedTime: '45 min', emoji: '🌳', tags: ['cabane', 'arbre', 'nature'],
    structure: mkS('Cabane', 'Cabane perchée', [...pil(4,0,4,8,'oak_log',1),...pil(5,0,4,8,'oak_log',1),...rect(0,8,0,10,10,'oak_planks',2),...walls(0,9,0,10,10,'spruce_planks',3),...walls(0,10,0,10,10,'spruce_planks',4),...walls(0,11,0,10,10,'spruce_planks',5),...rect(0,12,0,10,10,'spruce_planks',6),...rect(2,13,2,6,6,'dark_oak_planks',7)]) },
  { id: 'underground', name: 'Base souterraine', description: 'Base sécurisée creusée dans la roche avec pièces éclairées.', category: 'houses', difficulty: 'medium', estimatedTime: '1h', emoji: '⛏️', tags: ['base', 'survie'],
    structure: mkS('Base', 'Base 12×10', [...rect(0,0,0,12,10,'stone_bricks',1),...walls(0,1,0,12,10,'stone_bricks',2),...walls(0,2,0,12,10,'stone_bricks',3),...walls(0,3,0,12,10,'stone_bricks',4),...rect(0,4,0,12,10,'stone_bricks',5),blk(5,3,5,'glowstone',5),blk(2,1,2,'crafting_table',6),blk(3,1,2,'furnace',6),blk(4,1,2,'chest',6)]) },
  { id: 'modern', name: 'Villa moderne', description: 'Villa contemporaine avec grandes baies vitrées et toit plat.', category: 'modern', difficulty: 'hard', estimatedTime: '2h', emoji: '🏢', tags: ['moderne', 'villa', 'verre'],
    structure: mkS('Villa', 'Villa 15×10', [...rect(0,0,0,15,10,'concrete_white',1),...walls(0,1,0,15,10,'concrete_white',2),...walls(0,2,0,15,10,'concrete_white',3),...walls(0,3,0,15,10,'concrete_white',4),...walls(0,4,0,15,10,'glass',5),...walls(0,5,0,15,10,'concrete_white',6),...rect(0,6,0,15,10,'concrete_gray',7),...rect(0,7,0,8,5,'concrete_white',8),...walls(0,8,0,8,5,'glass',9),...rect(0,9,0,8,5,'concrete_gray',10)]) },
  { id: 'castle', name: 'Château médiéval', description: 'Forteresse avec 4 tours d\'angle et murailles imposantes.', category: 'castles', difficulty: 'hard', estimatedTime: '3h', emoji: '🏰', tags: ['château', 'forteresse', 'médiéval'],
    structure: mkS('Château', '20×20', [...rect(0,0,0,20,20,'cobblestone',1),...walls(0,1,0,20,20,'stone_bricks',2),...walls(0,2,0,20,20,'stone_bricks',3),...walls(0,3,0,20,20,'stone_bricks',4),...walls(0,4,0,20,20,'stone_bricks',5),...pil(0,1,0,8,'stone_bricks',2),...pil(19,1,0,8,'stone_bricks',2),...pil(0,1,19,8,'stone_bricks',2),...pil(19,1,19,8,'stone_bricks',2)]) },
  { id: 'watchtower', name: 'Tour de garde', description: 'Tour de guet simple avec plateforme d\'observation au sommet.', category: 'towers', difficulty: 'easy', estimatedTime: '20 min', emoji: '🗼', tags: ['tour', 'garde'],
    structure: mkS('Tour', '5×5', [...rect(0,0,0,5,5,'cobblestone',1),...walls(0,1,0,5,5,'stone_bricks',2),...walls(0,2,0,5,5,'stone_bricks',3),...walls(0,3,0,5,5,'stone_bricks',4),...walls(0,4,0,5,5,'stone_bricks',5),...walls(0,5,0,5,5,'stone_bricks',6),...walls(0,6,0,5,5,'stone_bricks',7),...rect(0,7,0,5,5,'stone_bricks',8)]) },
  { id: 'lighthouse', name: 'Phare côtier', description: 'Phare cylindrique en quartz et béton rouge avec lumière au sommet.', category: 'towers', difficulty: 'medium', estimatedTime: '30 min', emoji: '🏮', tags: ['phare', 'mer', 'lumière'],
    structure: mkS('Phare', 'Hauteur 13', [...rect(2,0,2,5,5,'quartz_block',1),...walls(2,1,2,5,5,'quartz_block',2),...walls(2,2,2,5,5,'quartz_block',3),...walls(2,3,2,5,5,'concrete_red',4),...walls(2,4,2,5,5,'concrete_red',5),...walls(2,5,2,5,5,'quartz_block',6),...walls(2,6,2,5,5,'quartz_block',7),...walls(2,7,2,5,5,'concrete_red',8),...walls(2,8,2,5,5,'concrete_red',9),...walls(2,9,2,5,5,'quartz_block',10),...rect(1,10,1,7,7,'quartz_block',11),...walls(2,11,2,5,5,'glass',12),blk(4,11,4,'sea_lantern',12),...rect(2,12,2,5,5,'quartz_block',13)]) },
  { id: 'wizard', name: 'Tour de magicien', description: 'Tour mystique en deepslate avec beacon au sommet.', category: 'fantasy', difficulty: 'hard', estimatedTime: '2h', emoji: '🧙', tags: ['magicien', 'fantaisie'],
    structure: mkS('Tour', '6×6', [...rect(1,0,1,6,6,'deepslate_bricks',1),...walls(1,1,1,6,6,'deepslate_bricks',2),...walls(1,2,1,6,6,'deepslate_bricks',3),...walls(1,3,1,6,6,'deepslate_bricks',4),...walls(1,4,1,6,6,'deepslate_bricks',5),...walls(1,5,1,6,6,'deepslate_bricks',6),...walls(1,6,1,6,6,'deepslate_bricks',7),...walls(1,7,1,6,6,'deepslate_bricks',8),...walls(1,8,1,6,6,'deepslate_bricks',9),...rect(0,10,0,8,8,'deepslate_bricks',10),...walls(1,11,1,6,6,'purple_stained_glass',11),blk(3,11,3,'beacon',11),...rect(1,12,1,6,6,'deepslate',12),...rect(2,13,2,4,4,'deepslate',13),...rect(3,14,3,2,2,'deepslate',14),blk(3,15,3,'amethyst_block',15)]) },
  { id: 'wheat', name: 'Ferme à blé', description: 'Champ irrigué avec clôtures et torches.', category: 'farms', difficulty: 'easy', estimatedTime: '10 min', emoji: '🌾', tags: ['blé', 'nourriture'],
    structure: mkS('Ferme', '9×9', [...rect(0,0,0,9,9,'farmland',1),blk(4,0,4,'water',1)]) },
  { id: 'fountain', name: 'Fontaine de place', description: 'Fontaine décorative en quartz avec eau et lanterne.', category: 'decorations', difficulty: 'medium', estimatedTime: '20 min', emoji: '⛲', tags: ['fontaine', 'quartz'],
    structure: mkS('Fontaine', 'Quartz', [...rect(0,0,0,7,7,'quartz_block',1),...walls(0,1,0,7,7,'quartz_block',2),...rect(1,1,1,5,5,'water',3),blk(3,1,3,'quartz_pillar',4),blk(3,2,3,'quartz_pillar',5),blk(3,3,3,'quartz_pillar',6),blk(3,4,3,'sea_lantern',7)]) },
  { id: 'lamp', name: 'Lampadaire', description: 'Lampadaire élégant en fer avec lanterne suspendue.', category: 'decorations', difficulty: 'easy', estimatedTime: '5 min', emoji: '💡', tags: ['lampe', 'éclairage'],
    structure: mkS('Lampadaire', '', [blk(0,0,0,'cobblestone',1),blk(0,1,0,'iron_bars',2),blk(0,2,0,'iron_bars',3),blk(0,3,0,'iron_bars',4),blk(0,4,0,'chain',5),blk(0,5,0,'lantern',6)]) },
  { id: 'bridge', name: 'Pont en pierre', description: 'Pont arqué classique en pierre taillée.', category: 'bridges', difficulty: 'easy', estimatedTime: '15 min', emoji: '🌉', tags: ['pont', 'pierre'],
    structure: mkS('Pont', '3×12', [...rect(0,2,0,3,12,'stone_bricks',1)]) },
  { id: 'bedroom', name: 'Chambre cozy', description: 'Chambre avec lit, table de nuit et bibliothèque.', category: 'interiors', difficulty: 'easy', estimatedTime: '10 min', emoji: '🛏️', tags: ['chambre', 'lit'],
    structure: mkS('Chambre', '6×5', [...rect(0,0,0,6,5,'oak_planks',1),...walls(0,1,0,6,5,'oak_planks',2),...walls(0,2,0,6,5,'oak_planks',3),...rect(0,3,0,6,5,'oak_planks',4),blk(1,1,3,'red_bed',5),blk(2,1,3,'red_bed',5),blk(3,1,3,'oak_planks',5),blk(3,2,3,'lantern',5),blk(0,1,1,'bookshelf',6),blk(0,2,1,'bookshelf',6)]) },
  { id: 'piston', name: 'Porte à pistons', description: 'Porte secrète 2×2 avec pistons collants.', category: 'redstone', difficulty: 'medium', estimatedTime: '20 min', emoji: '🚪', tags: ['piston', 'secret'],
    structure: mkS('Porte', '2×2', [...rect(0,0,0,4,4,'stone',1),blk(1,1,1,'sticky_piston',2),blk(2,1,1,'sticky_piston',2),blk(1,1,2,'stone',3),blk(2,1,2,'stone',3),blk(0,1,0,'lever',4)]) },
  { id: 'creeper', name: 'Statue Creeper', description: 'Statue géante de Creeper en béton vert.', category: 'statues', difficulty: 'medium', estimatedTime: '30 min', emoji: '💚', tags: ['creeper', 'pixel art'],
    structure: mkS('Creeper', '', [...rect(0,0,0,2,2,'lime_concrete',1),...rect(2,0,0,2,2,'lime_concrete',1),...rect(0,1,0,4,2,'lime_concrete',2),...rect(0,2,0,4,2,'lime_concrete',3),...rect(0,3,0,4,2,'lime_concrete',4),...rect(0,4,0,4,2,'lime_concrete',5),...rect(0,5,0,4,4,'lime_concrete',6),...rect(0,6,0,4,4,'lime_concrete',7),...rect(0,7,0,4,4,'lime_concrete',8),...rect(0,8,0,4,4,'lime_concrete',9),blk(0,7,0,'black_concrete',10),blk(3,7,0,'black_concrete',10),blk(1,6,0,'black_concrete',10),blk(2,6,0,'black_concrete',10)]) },
  { id: 'tavern', name: 'Taverne médiévale', description: 'Auberge chaleureuse avec comptoir et chambres.', category: 'medieval', difficulty: 'hard', estimatedTime: '2h', emoji: '🍺', tags: ['taverne', 'auberge'],
    structure: mkS('Taverne', '10×8', [...rect(0,0,0,10,8,'cobblestone',1),...walls(0,1,0,10,8,'oak_planks',2),...walls(0,2,0,10,8,'oak_planks',3),...walls(0,3,0,10,8,'oak_planks',4),...rect(0,4,0,10,8,'oak_planks',5),...walls(0,5,0,10,8,'oak_planks',6),...walls(0,6,0,10,8,'oak_planks',7),...rect(0,7,0,10,8,'oak_planks',8),...rect(1,8,1,8,6,'spruce_planks',9),blk(2,1,2,'dark_oak_planks',10),blk(3,1,2,'dark_oak_planks',10),blk(4,1,2,'dark_oak_planks',10),blk(5,1,2,'barrel',10)]) },
  { id: 'blacksmith', name: 'Forge du forgeron', description: 'Atelier avec enclume, grindstone et forge à lave.', category: 'medieval', difficulty: 'medium', estimatedTime: '30 min', emoji: '⚒️', tags: ['forge', 'métal'],
    structure: mkS('Forge', '7×5', [...rect(0,0,0,7,5,'cobblestone',1),...walls(0,1,0,7,5,'cobblestone',2),...walls(0,2,0,7,5,'cobblestone',3),...walls(0,3,0,7,5,'dark_oak_planks',4),...rect(0,4,0,7,5,'dark_oak_planks',5),blk(3,1,2,'anvil',6),blk(1,1,1,'lava',7),blk(1,2,1,'iron_bars',7),blk(5,1,2,'grindstone',8),blk(2,3,2,'lantern',9),blk(5,3,2,'lantern',9)]) },
  { id: 'end_portal', name: 'Salle du portail de l\'End', description: 'Reproduction de la salle du boss avec piliers d\'obsidienne.', category: 'fantasy', difficulty: 'hard', estimatedTime: '1h', emoji: '🌀', tags: ['end', 'boss', 'portail'],
    structure: mkS('Salle End', '15×15', [...rect(0,0,0,15,15,'end_stone',1),...walls(0,1,0,15,15,'end_stone_bricks',2),...walls(0,2,0,15,15,'end_stone_bricks',3),...walls(0,3,0,15,15,'end_stone_bricks',4),...rect(0,4,0,15,15,'end_stone_bricks',5),...rect(5,1,5,5,5,'end_stone',6),...rect(6,0,6,3,3,'lava',7),...pil(2,1,2,3,'obsidian',6),...pil(12,1,2,3,'obsidian',6),...pil(2,1,12,3,'obsidian',6),...pil(12,1,12,3,'obsidian',6)]) },
  { id: 'pyramid', name: 'Pyramide', description: 'Petite pyramide décorative en grès.', category: 'decorations', difficulty: 'medium', estimatedTime: '30 min', emoji: '🔺', tags: ['pyramide', 'désert'],
    structure: mkS('Pyramide', '9×9', [...rect(0,0,0,9,9,'sandstone',1),...rect(1,1,1,7,7,'sandstone',2),...rect(2,2,2,5,5,'sandstone',3),...rect(3,3,3,3,3,'sandstone',4),blk(4,4,4,'sandstone',5)]) },
  { id: 'garden', name: 'Jardin zen', description: 'Petit jardin avec fontaine et fleurs colorées.', category: 'decorations', difficulty: 'easy', estimatedTime: '15 min', emoji: '🌸', tags: ['jardin', 'zen'],
    structure: mkS('Jardin', '8×8', [...rect(0,0,0,8,8,'grass_block',1),blk(1,1,1,'dandelion',2),blk(3,1,1,'poppy',2),blk(5,1,1,'blue_orchid',2),blk(7,1,1,'cornflower',2),blk(4,0,4,'water',3),blk(4,1,4,'quartz_pillar',4),blk(4,2,4,'sea_lantern',5)]) },
];

export const CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '📦' },
  { id: 'houses', name: 'Maisons', icon: '🏠' },
  { id: 'castles', name: 'Châteaux', icon: '🏰' },
  { id: 'towers', name: 'Tours', icon: '🗼' },
  { id: 'farms', name: 'Fermes', icon: '🌾' },
  { id: 'decorations', name: 'Déco', icon: '✨' },
  { id: 'interiors', name: 'Intérieurs', icon: '🛋️' },
  { id: 'medieval', name: 'Médiéval', icon: '⚔️' },
  { id: 'modern', name: 'Moderne', icon: '🏢' },
  { id: 'fantasy', name: 'Fantaisie', icon: '🧙' },
  { id: 'redstone', name: 'Redstone', icon: '🔴' },
  { id: 'bridges', name: 'Ponts', icon: '🌉' },
  { id: 'statues', name: 'Statues', icon: '💚' },
] as const;

export const DIFFICULTY_CONFIG = {
  easy: { name: 'Facile', color: '#5B8731' },
  medium: { name: 'Moyen', color: '#E0A030' },
  hard: { name: 'Difficile', color: '#e94560' },
} as const;
