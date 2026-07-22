import { Block } from './types';

const B: Record<string, Block> = {};
const a = (id: string, name: string, color: string) => { B[id] = { id, name, color }; };

// Stone
a('stone','Roche','#7F7F7F'); a('cobblestone','Pierres','#6B6B6B'); a('mossy_cobblestone','Pierres moussues','#5E7A4E');
a('smooth_stone','Pierre lisse','#A0A0A0'); a('stone_bricks','Pierre taillée','#7A7A7A'); a('mossy_stone_bricks','Pierre taillée moussue','#6B7A5E');
a('cracked_stone_bricks','Pierre taillée craquelée','#737373'); a('chiseled_stone_bricks','Pierre sculptée','#787878');
a('granite','Granit','#9A6B56'); a('polished_granite','Granit poli','#9E6958');
a('diorite','Diorite','#B0B0B0'); a('polished_diorite','Diorite polie','#BDBDBD');
a('andesite','Andésite','#888888'); a('polished_andesite','Andésite polie','#8E8E8E');
a('deepslate','Ardoise des abîmes','#4A4A4A'); a('cobbled_deepslate','Pierres des abîmes','#4D4D4D');
a('polished_deepslate','Ardoise polie','#484848'); a('deepslate_bricks','Pierre taillée des abîmes','#484848');
a('deepslate_tiles','Carrelage des abîmes','#464646'); a('tuff','Tuf','#6C6C61');
a('blackstone','Roche noire','#2A2430'); a('polished_blackstone','Roche noire polie','#2F2A38');
a('polished_blackstone_bricks','Pierre roche noire','#2E2935'); a('basalt','Basalte','#4B4B4B');
a('calcite','Calcite','#E0DDD6'); a('obsidian','Obsidienne','#14121D');
a('crying_obsidian','Obsidienne pleureuse','#220A3D'); a('bedrock','Bedrock','#555555');
a('sandstone','Grès','#D8C88E'); a('smooth_sandstone','Grès lisse','#DBCC94');
a('red_sandstone','Grès rouge','#A75420'); a('quartz_block','Quartz','#EBE5DB');
a('quartz_bricks','Briques de quartz','#EAE3D9'); a('quartz_pillar','Pilier quartz','#ECE6DC');
a('purpur_block','Purpur','#A779A7'); a('end_stone','Pierre de l\'End','#D9CC91');
a('end_stone_bricks','Pierre taillée End','#DBCE94');

// Dirt/Terrain
a('dirt','Terre','#866043'); a('grass_block','Herbe','#5B8731'); a('podzol','Podzol','#5B3E1A');
a('mycelium','Mycélium','#705078'); a('mud','Boue','#3C3A37'); a('packed_mud','Boue compactée','#8B6B4F');
a('sand','Sable','#DBC9A1'); a('red_sand','Sable rouge','#BE6621'); a('gravel','Gravier','#84807B');
a('clay','Argile','#9EA4B0'); a('snow_block','Neige','#F0F0F0'); a('ice','Glace','#99CCFF');
a('packed_ice','Glace compactée','#8CB5E0'); a('blue_ice','Glace bleue','#74A8FF');
a('farmland','Terre labourée','#6B4930'); a('dirt_path','Chemin de terre','#947A4E');

// Wood
const WD: Record<string,[string,string,string]> = {
  oak:['chêne','#BC9862','#6D5534'], spruce:['sapin','#7B5B38','#3B2610'],
  birch:['bouleau','#C8B77A','#D7C89F'], jungle:['acajou','#A37142','#553C18'],
  acacia:['acacia','#AD5D32','#676157'], dark_oak:['chêne noir','#432E1B','#3C2D16'],
  mangrove:['palétuvier','#763634','#544333'], cherry:['cerisier','#E0ADAF','#3C1F24'],
  crimson:['carmin','#653147','#5B1E35'], warped:['biscornu','#2B6C5B','#1A4A40'],
};
for (const [wId,[fr,pl,lo]] of Object.entries(WD)) {
  a(`${wId}_planks`,`Planches de ${fr}`,pl); a(`${wId}_log`,`Bûche de ${fr}`,lo);
  a(`${wId}_slab`,`Dalle ${fr}`,pl); a(`${wId}_stairs`,`Escalier ${fr}`,pl);
  a(`${wId}_fence`,`Barrière ${fr}`,pl); a(`${wId}_fence_gate`,`Portillon ${fr}`,pl);
  a(`${wId}_door`,`Porte ${fr}`,pl); a(`${wId}_trapdoor`,`Trappe ${fr}`,pl);
  a(`${wId}_sign`,`Pancarte ${fr}`,pl);
}
a('oak_leaves','Feuilles chêne','#2E8B16'); a('spruce_leaves','Feuilles sapin','#2D5F2D');
a('birch_leaves','Feuilles bouleau','#6B8B3A'); a('dark_oak_leaves','Feuilles chêne noir','#2B6E0F');
a('cherry_leaves','Feuilles cerisier','#E8A0C0');

// Ores
a('coal_ore','Charbon','#444444'); a('iron_ore','Fer','#A08070'); a('gold_ore','Or','#DBB740');
a('diamond_ore','Diamant','#5DECF5'); a('emerald_ore','Émeraude','#17DD62');
a('lapis_ore','Lapis','#2D4FD7'); a('redstone_ore','Redstone','#A80F01');
a('copper_ore','Cuivre','#7C5A3C'); a('ancient_debris','Débris antiques','#4A3A2F');
a('coal_block','Bloc charbon','#2C2C2C'); a('iron_block','Bloc fer','#DCDCDC');
a('gold_block','Bloc or','#FCE94F'); a('diamond_block','Bloc diamant','#62EFE8');
a('emerald_block','Bloc émeraude','#29CC5B'); a('lapis_block','Bloc lapis','#1E47B8');
a('redstone_block','Bloc redstone','#A80F01'); a('netherite_block','Bloc Netherite','#443A3B');
a('amethyst_block','Améthyste','#8562B5'); a('copper_block','Bloc cuivre','#C06B3F');
a('oxidized_copper','Cuivre oxydé','#52A383');

// Building
a('bricks','Briques','#966254'); a('nether_bricks','Briques Nether','#2C151A');
a('red_nether_bricks','Briques rouges Nether','#45070B'); a('prismarine','Prismarine','#5BA499');
a('dark_prismarine','Prismarine sombre','#345B4B'); a('mud_bricks','Briques terre crue','#8B6B4F');
a('terracotta','Terre cuite','#985E43'); a('glass','Verre','#C8E8FF');
a('glass_pane','Vitre','#C8E8FF'); a('tinted_glass','Verre teinté','#2A2A2A');

// 16 Colors
const C16: Record<string,[string,string]> = {
  white:['blanche','#E9E9E9'], orange:['orange','#E06100'], magenta:['magenta','#A9309F'],
  light_blue:['bleu clair','#2389C6'], yellow:['jaune','#F0AF15'], lime:['vert clair','#5EA818'],
  pink:['rose','#D5658E'], gray:['grise','#36393D'], light_gray:['gris clair','#7D7D73'],
  cyan:['cyan','#15778E'], purple:['violette','#641F9C'], blue:['bleue','#2C2E8E'],
  brown:['marron','#603B1F'], green:['verte','#495B2F'], red:['rouge','#8E2020'],
  black:['noire','#080A0F'],
};
for (const [cId,[fr,hex]] of Object.entries(C16)) {
  a(`concrete_${cId}`,`Béton ${fr}`,hex); a(`${cId}_wool`,`Laine ${fr}`,hex);
  a(`${cId}_carpet`,`Tapis ${fr}`,hex); a(`${cId}_stained_glass`,`Verre ${fr}`,hex);
  a(`${cId}_terracotta`,`Terre cuite ${fr}`,hex); a(`${cId}_candle`,`Bougie ${fr}`,hex);
  a(`${cId}_bed`,`Lit ${fr}`,hex); a(`${cId}_shulker_box`,`Shulker ${fr}`,hex);
}

// Nature
a('cactus','Cactus','#0E6B0E'); a('bamboo','Bambou','#5F8C15'); a('sugar_cane','Canne à sucre','#97C26B');
a('vine','Lianes','#2F6B1A'); a('moss_block','Mousse','#4A6B1A');
a('dandelion','Pissenlit','#FFDD00'); a('poppy','Coquelicot','#FF3333');
a('blue_orchid','Orchidée bleue','#33BBFF'); a('cornflower','Bleuet','#4444FF');
a('sunflower','Tournesol','#FFD700'); a('lilac','Lilas','#CC88DD');
a('brown_mushroom','Champignon brun','#996B44'); a('red_mushroom','Champignon rouge','#DD3333');
a('melon','Pastèque','#5D8C29'); a('pumpkin','Citrouille','#CF7B19');
a('carved_pumpkin','Citrouille sculptée','#CF7B19'); a('hay_block','Paille','#A68A17');
a('honey_block','Miel','#EB9E0A'); a('honeycomb_block','Rayon miel','#E5921A');
a('slime_block','Slime','#70C864'); a('bone_block','Os','#E3DCCA');
a('cobweb','Toile','#DDDDDD'); a('short_grass','Herbe','#5B8731');
a('fern','Fougère','#3A7A2A'); a('dead_bush','Arbuste mort','#8B6B3A');

// Corals
for (const [id,hex] of [['tube','#2E5FE0'],['brain','#D46AA0'],['bubble','#9E28B0'],['fire','#D65020'],['horn','#CFB528']] as [string,string][]) {
  a(`${id}_coral_block`,`Corail ${id}`,hex); a(`dead_${id}_coral_block`,`Corail ${id} mort`,'#7A7A6E');
}

// Nether
a('netherrack','Netherrack','#6F3535'); a('soul_sand','Sable des âmes','#514035');
a('soul_soil','Terre des âmes','#4B3B2E'); a('magma_block','Magma','#8E3D0E');
a('shroomlight','Champillumine','#F09858'); a('nether_wart_block','Verrues Nether','#6E0E0E');
a('warped_wart_block','Verrues biscornues','#16706B');

// Light
a('glowstone','Pierre lumineuse','#AB863D'); a('sea_lantern','Lanterne aquatique','#ABC5B8');
a('redstone_lamp','Lampe redstone','#6A4227'); a('beacon','Balise','#9FEFFF');
a('lantern','Lanterne','#6B4D2E'); a('soul_lantern','Lanterne âmes','#4B6B6B');
a('torch','Torche','#8B6914'); a('jack_o_lantern','Citrouille-lanterne','#CF7B19');
a('campfire','Feu de camp','#8B5A1A'); a('end_rod','Barre de l\'End','#E8E0C8');

// Redstone
a('redstone_torch','Torche redstone','#A80F01'); a('repeater','Répéteur','#9A9A9A');
a('comparator','Comparateur','#9A9A9A'); a('piston','Piston','#8B7355');
a('sticky_piston','Piston collant','#6B8B3A'); a('observer','Observateur','#5A5A5A');
a('hopper','Entonnoir','#5A5A5A'); a('dispenser','Distributeur','#7A7A7A');
a('tnt','TNT','#CC3333'); a('lever','Levier','#7A5A3A'); a('rail','Rail','#7A6040');
a('powered_rail','Rail propulsion','#C8A030'); a('note_block','Bloc musical','#7B5B38');
a('target','Cible','#E8C8B0'); a('lightning_rod','Paratonnerre','#C06B3F');

// Decorative
a('bookshelf','Bibliothèque','#725432'); a('enchanting_table','Table enchantement','#6B2020');
a('chest','Coffre','#9A6B2A'); a('ender_chest','Coffre End','#1A3A3A');
a('barrel','Tonneau','#7B5B2E'); a('anvil','Enclume','#4A4A4A');
a('grindstone','Meule','#6A6A6A'); a('stonecutter','Scie à pierre','#7A7A7A');
a('crafting_table','Établi','#7B5B38'); a('furnace','Four','#7A7A7A');
a('blast_furnace','Haut fourneau','#4A4A4A'); a('smoker','Fumoir','#5A4A3A');
a('brewing_stand','Alambic','#6A5A30'); a('cauldron','Chaudron','#3A3A3A');
a('composter','Composteur','#7B6830'); a('lectern','Pupitre','#A88A58');
a('bell','Cloche','#C8A030'); a('flower_pot','Pot','#9A6B4A');
a('iron_bars','Barreaux','#8A8A8A'); a('chain','Chaîne','#3A3A3A');
a('ladder','Échelle','#8B7355'); a('cake','Gâteau','#F0E0D0');
a('sponge','Éponge','#C0B020'); a('decorated_pot','Pot décoré','#B89870');

// Liquids
a('water','Eau','#2B5FE1'); a('lava','Lave','#CE3E05');

// Stairs/slabs for stone types
const stoneStairs = ['stone','cobblestone','stone_bricks','sandstone','brick','nether_bricks','quartz','purpur','andesite','diorite','granite','deepslate','cobbled_deepslate','polished_deepslate','deepslate_bricks','deepslate_tiles','blackstone','polished_blackstone','tuff','mud_bricks','prismarine','end_stone_bricks','mossy_cobblestone','mossy_stone_bricks','red_sandstone','red_nether_bricks','polished_granite','polished_diorite','polished_andesite'];
for (const s of stoneStairs) {
  if (B[s]) {
    a(`${s}_slab`,`Dalle ${B[s].name}`,B[s].color);
    a(`${s}_stairs`,`Escalier ${B[s].name}`,B[s].color);
  }
}

export const BLOCKS: Record<string, Block> = B;
export const getBlockColor = (id: string): string => B[id]?.color || '#FF00FF';
export const getBlockName = (id: string): string => B[id]?.name || id;
export const TOTAL_BLOCKS = Object.keys(B).length;
