import { TILE, VIEW_W } from '../config.js';
import { tileAtPx } from '../engine/collide.js';
import { isSolid } from '../engine/tiles.js';
import { applyGravity } from '../engine/physics.js';
import { P } from '../render/palette.js';

export function createProjectile(spec) {
  return {
    type: spec.type,
    x: spec.x,
    y: spec.y,
    w: spec.w ?? 8,
    h: spec.h ?? 8,
    vx: spec.vx ?? 0,
    vy: spec.vy ?? 0,
    life: spec.life ?? 9999,
    bounces: 0,
    maxBounces: spec.type === 'fireball' ? 1 : 0,
    dead: false,
    facing: spec.facing ?? 1,
  };
}

function hitsSolid(map, p) {
  const corners = [
    [p.x, p.y],
    [p.x + p.w, p.y],
    [p.x, p.y + p.h],
    [p.x + p.w, p.y + p.h],
  ];
  return corners.some(([px, py]) => isSolid(tileAtPx(map, px, py)));
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function updateProjectiles(list, map, camera, hooks = {}) {
  const { enemies = [], boss, player, onBossHit, onEnemyKill } = hooks;
  for (const p of list) {
    if (p.dead) continue;
    p.life -= 1;
    if (p.life <= 0) {
      p.dead = true;
      continue;
    }
    if (p.type === 'fireball') {
      applyGravity(p);
      const prevY = p.y;
      p.y += p.vy;
      if (hitsSolid(map, p)) {
        if (p.vy > 0 && p.bounces < p.maxBounces) {
          p.y = prevY;
          p.vy = -2.2;
          p.bounces += 1;
        } else {
          p.dead = true;
        }
      }
      p.x += p.vx;
      if (hitsSolid(map, p)) p.dead = true;
    } else if (p.type === 'darkFire') {
      p.x += p.vx;
      if (hitsSolid(map, p)) p.dead = true;
    }
    const left = camera.x - 32;
    const right = camera.x + VIEW_W + 32;
    if (p.x < left || p.x > right) p.dead = true;

    if (!p.dead && p.type === 'darkFire' && player && overlap(p, player.getHitbox())) {
      p.dead = true;
      player.takeDamage(hooks.audio);
      continue;
    }
    if (p.dead || p.type !== 'fireball') continue;
    for (const e of enemies) {
      if (e.dead) continue;
      if (overlap(p, e)) {
        e.dead = true;
        p.dead = true;
        onEnemyKill?.(e);
        break;
      }
    }
    if (!p.dead && boss && overlap(p, boss.getHitbox())) {
      p.dead = true;
      onBossHit?.(boss, p, player);
    }
  }
}

export function drawProjectile(ctx, p, camera) {
  if (p.dead) return;
  const sx = Math.floor(p.x - camera.x);
  const sy = Math.floor(p.y);
  if (p.type === 'fireball') {
    ctx.fillStyle = P.red;
    ctx.fillRect(sx, sy + 2, p.w, p.h - 4);
    ctx.fillStyle = P.gold;
    ctx.fillRect(sx + 2, sy, p.w - 4, p.h);
  } else {
    ctx.fillStyle = P.eye;
    ctx.fillRect(sx, sy, p.w, p.h);
    ctx.fillStyle = P.black;
    ctx.fillRect(sx + 3, sy + 3, p.w - 6, p.h - 6);
  }
}

export function pruneProjectiles(list) {
  return list.filter((p) => !p.dead);
}
