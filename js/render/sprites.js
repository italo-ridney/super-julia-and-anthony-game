import { P } from './palette.js';
import { blit } from './blit.js';

const charMap = {
  k: P.k, w: P.w, s: P.skin, h: P.hair, p: P.pink, pd: P.pinkD,
  b: P.blue, bd: P.blueD, r: P.red, rd: P.redD, c: P.cyan, cd: P.cyanD,
  g: P.gold, gn: P.green, gnd: P.greenD, br: P.brown, e: P.eye, gr: P.gray, bl: P.black,
};

function pad16(rows) {
  while (rows.length < 16) rows.push('.'.repeat(12));
  return rows.map((r) => (r.length >= 12 ? r.slice(0, 12) : r + '.'.repeat(12 - r.length)));
}

function body16(top, mid, bot, hair = 'h') {
  const rows = [];
  for (let i = 0; i < 4; i++) rows.push('....' + hair.repeat(4) + '....');
  for (let i = 0; i < 4; i++) rows.push('...' + 's'.repeat(6) + '...');
  for (let i = 0; i < 8; i++) rows.push('..' + top + mid.repeat(4) + top + '..');
  for (let i = 0; i < 4; i++) rows.push('..' + bot + bot + '..' + bot + bot + '..');
  for (let i = 0; i < 4; i++) rows.push('...' + bot + '..' + bot + '...');
  return rows.slice(0, 24);
}

function juliaJump() {
  const r = body16('p', 'pd', 'pd');
  r[14] = 'p..........p';
  r[15] = 'p..........p';
  r[16] = '..pd....pd..';
  return r;
}

function anthonyBody() {
  const rows = body16('b', 'bd', 'bd');
  rows[8] = '.b' + 'bd'.repeat(5) + 'b.';
  rows[9] = 'b' + 'bd'.repeat(6) + 'b';
  return rows;
}

function makeBossGrid(hurt = false) {
  const g = Array.from({ length: 64 }, () => Array.from({ length: 64 }, () => '.'));
  for (let y = 20; y < 50; y++) {
    for (let x = 16; x < 48; x++) g[y][x] = hurt && (x + y) % 4 === 0 ? 'w' : 'bl';
  }
  for (let y = 12; y < 28; y++) for (let x = 8; x < 20; x++) g[y][x] = 'gr';
  g[18][22] = 'e';
  g[18][26] = 'e';
  g[22][20] = 'w';
  g[22][28] = 'w';
  for (let x = 40; x < 64; x++) g[40 + (x % 8)][x] = 'bl';
  return g.map((row) => row.join(''));
}

const SPRITES = {
  julia: { idle: body16('p', 'pd', 'pd'), walk0: body16('p', 'pd', 'pd'), walk1: body16('p', 'pd', 'pd'), jump: juliaJump() },
  anthony: { idle: anthonyBody(), walk0: anthonyBody(), walk1: anthonyBody(), jump: anthonyBody() },
  rosalina: { idle: body16('c', 'cd', 'cd', 'g'), walk0: body16('c', 'cd', 'cd', 'g'), walk1: body16('c', 'cd', 'cd', 'g'), jump: body16('c', 'cd', 'cd', 'g') },
  mario: { idle: body16('r', 'rd', 'b', 'r'), walk0: body16('r', 'rd', 'b', 'r'), walk1: body16('r', 'rd', 'b', 'r'), jump: body16('r', 'rd', 'b', 'r') },
  walker: { idle: pad16(['....brbr....', '..brbrbrbr..']), walk0: pad16(['....brbr....', '..brbrbrbr..']), walk1: pad16(['....brbr....', '..brbrbr..']), jump: pad16([]) },
  sheller: { idle: pad16(['....gngn....', '..gngngngn..']), walk0: pad16(['....gngn....']), walk1: pad16(['....gngn....']), shell: pad16(['..gngngngn..']), jump: pad16([]) },
  flyer: { idle: pad16(['..wwgrgrww..']), walk0: pad16(['..wwwwwwww..']), walk1: pad16(['..wwwwwwww..']), jump: pad16([]) },
  boss: { idle: makeBossGrid(), walk0: makeBossGrid(), walk1: makeBossGrid(), hurt: makeBossGrid(true), dying: makeBossGrid(true) },
};

export function drawSprite(ctx, name, frame, x, y, facing = 1) {
  const set = SPRITES[name];
  if (!set) return;
  const grid = set[frame] || set.idle;
  if (!grid) return;
  blit(ctx, grid, charMap, Math.floor(x), Math.floor(y), facing < 0);
}

export function getSpriteFrame(actor) {
  if (actor.anim === 'jump' || !actor.onGround) return 'jump';
  if (actor.anim === 'walk') return actor.walkFrame ? 'walk1' : 'walk0';
  return 'idle';
}
