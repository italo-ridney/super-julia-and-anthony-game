import { TILE } from '../config.js';
import { applyGravity } from '../engine/physics.js';
import { moveActor, tileAtPx } from '../engine/collide.js';
import { isSolid } from '../engine/tiles.js';
import { drawSprite, getSpriteFrame } from '../render/sprites.js';

export function createEnemy({ type, x, y, dir = -1 }) {
  const e = {
    type,
    x,
    y,
    w: 16,
    h: 16,
    vx: type === 'walker' ? 0.4 * dir : type === 'sheller' ? 0.55 * dir : 0.5 * dir,
    vy: 0,
    dir,
    onGround: false,
    dead: false,
    shell: false,
    baseY: y,
    t: 0,
    getHitbox() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    },
  };
  if (type === 'flyer') e.vy = 0;
  return e;
}

function groundAhead(map, e) {
  const frontX = e.x + (e.vx > 0 ? e.w + 2 : -2);
  const footY = e.y + e.h + 1;
  const below = tileAtPx(map, frontX, footY);
  const atFeet = tileAtPx(map, frontX, e.y + e.h - 2);
  return isSolid(below) || isSolid(atFeet);
}

function wallAhead(map, e) {
  const px = e.vx > 0 ? e.x + e.w : e.x - 1;
  const id = tileAtPx(map, px, e.y + e.h / 2);
  return isSolid(id);
}

export function updateEnemy(e, map) {
  if (e.dead) return;
  e.t += 1;
  if (e.type === 'flyer') {
    e.y = e.baseY + Math.sin(e.t / 20) * 12;
    e.x += e.vx;
    if (wallAhead(map, e)) e.vx *= -1;
    return;
  }
  if (e.type === 'sheller' && e.shell && e.vx === 0) {
    applyGravity(e);
    moveActor(e, map);
    return;
  }
  applyGravity(e);
  const prevVx = e.vx;
  moveActor(e, map);
  if (wallAhead(map, e) || !groundAhead(map, e)) {
    e.vx = -prevVx || -e.dir * 0.4;
    e.dir = e.vx > 0 ? 1 : -1;
  }
}

export function stompEnemy(e, player) {
  if (e.dead) return false;
  const hb = player.getHitbox();
  const stomp = player.vy > 0 && hb.y + hb.h <= e.y + e.h * 0.55;
  if (!stomp) return false;
  if (e.type === 'sheller') {
    if (e.shell && Math.abs(e.vx) > 0.1) {
      e.vx = 0;
      return true;
    }
    e.shell = true;
    e.vx = 0;
    return true;
  }
  e.dead = true;
  return true;
}

export function kickShell(e, player) {
  if (e.type !== 'sheller' || !e.shell) return;
  if (Math.abs(e.vx) > 0.1) return;
  const sign = player.x >= e.x ? 1 : -1;
  e.vx = 3 * sign;
}

export function shellHits(enemies, shell) {
  if (shell.type !== 'sheller' || !shell.shell || Math.abs(shell.vx) < 0.1) return;
  for (const o of enemies) {
    if (o === shell || o.dead) continue;
    if (overlap(shell, o)) o.dead = true;
  }
}

export function overlap(a, b) {
  const hb = b.getHitbox ? b.getHitbox() : b;
  return a.x < hb.x + hb.w && a.x + a.w > hb.x && a.y < hb.y + hb.h && a.y + a.h > hb.y;
}

export function drawEnemy(ctx, e, camera) {
  if (e.dead) return;
  const frame = e.type === 'sheller' && e.shell ? 'shell' : getSpriteFrame({ anim: Math.abs(e.vx) > 0.05 ? 'walk' : 'idle', walkFrame: (e.t >> 3) & 1 });
  const name = e.type === 'sheller' && e.shell ? 'sheller' : e.type;
  const sx = e.x - camera.x;
  const sy = e.y;
  if (name === 'sheller' && e.shell) {
    drawSprite(ctx, 'sheller', 'shell', sx, sy, e.vx >= 0 ? 1 : -1);
  } else {
    drawSprite(ctx, name, frame, sx, sy, e.vx >= 0 ? 1 : -1);
  }
}
