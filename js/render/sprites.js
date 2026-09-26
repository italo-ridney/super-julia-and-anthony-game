import { P } from './palette.js';
import { blit } from './blit.js';
import { POWER } from '../config.js';
import {
  anthonySuper,
  anthonySmall,
  marioSuper,
  juliaSuper,
  juliaSmall,
  rosalinaSuper,
  walkLegs,
  jumpLegsPose,
  goombaIdle,
  goombaWalk,
  koopaWalk,
  koopaShell,
  flyerIdle,
  flyerFlap,
} from './characterArt.js';

const charMap = {
  k: P.k,
  w: P.w,
  s: P.skin,
  h: P.hair,
  p: P.pink,
  pd: P.pinkD,
  b: P.blue,
  bd: P.blueD,
  r: P.red,
  rd: P.redD,
  c: P.cyan,
  cd: P.cyanD,
  g: P.gold,
  gn: P.green,
  gnd: P.greenD,
  br: P.brown,
  brd: P.brownD,
  e: P.eye,
  gr: P.gray,
  bl: P.black,
  o: P.ground,
};

function pad16(rows) {
  while (rows.length < 16) rows.push('................');
  return rows.map((r) => (r.length >= 16 ? r.slice(0, 16) : r + '.'.repeat(16 - r.length)));
}

function pad24(rows) {
  while (rows.length < 24) rows.push('................');
  return rows.map((r) => (r.length >= 16 ? r.slice(0, 16) : r + '.'.repeat(16 - r.length)));
}

function makeBossGrid(hurt = false) {
  const g = Array.from({ length: 64 }, () => Array.from({ length: 64 }, () => '.'));
  for (let y = 20; y < 50; y++) {
    for (let x = 16; x < 48; x++) g[y][x] = hurt && (x + y) % 4 === 0 ? 'w' : 'bl';
  }
  for (let y = 12; y < 28; y++) for (let x = 8; x < 20; x++) g[y][x] = 'gr';
  g[18][22] = 'e';
  g[18][26] = 'e';
  return g.map((row) => row.join(''));
}

const SPRITES = {
  anthony: {
    idle: anthonySuper,
    walk0: walkLegs(anthonySuper, 0),
    walk1: walkLegs(anthonySuper, 1),
    jump: jumpLegsPose(anthonySuper),
    crouch: pad24([...anthonySuper.slice(0, 10), ...anthonySuper.slice(14)]),
    run: walkLegs(anthonySuper, 1),
  },
  anthonySmall: {
    idle: anthonySmall,
    walk0: walkLegs(anthonySmall, 0),
    walk1: walkLegs(anthonySmall, 1),
    jump: jumpLegsPose(anthonySmall),
    crouch: anthonySmall,
  },
  julia: {
    idle: juliaSuper,
    walk0: walkLegs(juliaSuper, 0),
    walk1: walkLegs(juliaSuper, 1),
    jump: jumpLegsPose(juliaSuper),
    crouch: pad24([...juliaSuper.slice(0, 10), ...juliaSuper.slice(14)]),
    run: walkLegs(juliaSuper, 1),
  },
  juliaSmall: {
    idle: juliaSmall,
    walk0: walkLegs(juliaSmall, 0),
    walk1: walkLegs(juliaSmall, 1),
    jump: jumpLegsPose(juliaSmall),
    crouch: juliaSmall,
  },
  mario: {
    idle: marioSuper,
    walk0: walkLegs(marioSuper, 0),
    walk1: walkLegs(marioSuper, 1),
    jump: jumpLegsPose(marioSuper),
    crouch: marioSuper,
  },
  rosalina: {
    idle: rosalinaSuper,
    walk0: walkLegs(rosalinaSuper, 0),
    walk1: walkLegs(rosalinaSuper, 1),
    jump: jumpLegsPose(rosalinaSuper),
  },
  walker: { idle: goombaIdle, walk0: goombaIdle, walk1: goombaWalk, jump: goombaIdle },
  sheller: { idle: koopaWalk, walk0: koopaWalk, walk1: koopaWalk, shell: koopaShell, jump: koopaShell },
  flyer: {
    idle: flyerIdle,
    walk0: flyerIdle,
    walk1: flyerFlap,
    jump: flyerFlap,
  },
  boss: {
    idle: makeBossGrid(),
    walk0: makeBossGrid(),
    walk1: makeBossGrid(),
    hurt: makeBossGrid(true),
    dying: makeBossGrid(true),
  },
};

export function getPlayerSpriteKey(player) {
  const small = player.power === POWER.SMALL || player.state === 'small';
  return small ? `${player.characterId}Small` : player.characterId;
}

function spriteGrid(name, frame) {
  const set = SPRITES[name];
  if (!set) return null;
  return set[frame] || set.idle;
}

export function drawSprite(ctx, name, frame, x, y, facing = 1) {
  const grid = spriteGrid(name, frame);
  if (!grid) return;
  const small = name.endsWith('Small');
  const oy = small ? 8 : 0;
  blit(ctx, grid, charMap, Math.floor(x), Math.floor(y) + oy, facing < 0);
}

/** Preview em menus (2×, 3×) — pixelado */
export function drawSpriteScaled(ctx, name, frame, x, y, scale = 2, facing = 1) {
  const grid = spriteGrid(name, frame);
  if (!grid || scale <= 1) {
    drawSprite(ctx, name, frame, x, y, facing);
    return;
  }
  const small = name.endsWith('Small');
  const oy = small ? 8 : 0;
  const h = grid.length;
  const w = grid[0].length;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (let row = 0; row < h; row++) {
    const line = grid[row];
    for (let col = 0; col < w; col++) {
      const fc = facing < 0 ? line[w - 1 - col] : line[col];
      if (fc === '.') continue;
      const color = charMap[fc];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(
        Math.floor(x + col * scale),
        Math.floor(y + (row + oy) * scale),
        scale,
        scale,
      );
    }
  }
  ctx.restore();
}

function victoryGrid(base) {
  const g = base.slice();
  g[2] = '...w........w...';
  g[3] = '..w..........w..';
  return g;
}

const swimA = (base) => walkLegs(base, 0);
const swimB = (base) => walkLegs(base, 1);

function withExtras(set, superBase, smallBase) {
  set.wallSlide = pad24([...superBase.slice(0, 12), ...superBase.slice(14)]);
  set.swim0 = swimA(superBase);
  set.swim1 = swimB(superBase);
  set.swim2 = swimA(superBase);
  set.swim3 = swimB(superBase);
  set.victory = victoryGrid(superBase);
  if (smallBase) {
    set.wallSlide = smallBase;
    set.swim0 = smallBase;
    set.swim1 = smallBase;
    set.swim2 = smallBase;
    set.swim3 = smallBase;
    set.victory = victoryGrid(smallBase);
  }
}

withExtras(SPRITES.anthony, anthonySuper, null);
withExtras(SPRITES.anthonySmall, anthonySuper, anthonySmall);
withExtras(SPRITES.julia, juliaSuper, null);
withExtras(SPRITES.juliaSmall, juliaSuper, juliaSmall);
withExtras(SPRITES.mario, marioSuper, null);
withExtras(SPRITES.rosalina, rosalinaSuper, null);

export function getSpriteFrame(actor) {
  if (actor.pose === 'victory') return 'victory';
  if (actor.swimming) {
    const f = Math.floor((actor.animTick || 0) / 6) % 4;
    return `swim${f}`;
  }
  if (actor.wallSliding) return 'wallSlide';
  if (actor.crouching) return 'crouch';
  if (actor.anim === 'jump' || (!actor.onGround && !actor.swimming)) return 'jump';
  if (actor.anim === 'run') return actor.walkFrame ? 'walk1' : 'run';
  if (actor.anim === 'walk' || actor.skidding) return actor.walkFrame ? 'walk1' : 'walk0';
  return 'idle';
}
