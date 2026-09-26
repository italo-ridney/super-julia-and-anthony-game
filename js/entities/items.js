import { applyGravity } from '../engine/physics.js';
import { moveActor } from '../engine/collide.js';
import { P } from '../render/palette.js';

export function createCoinPopup(x, y) {
  return {
    kind: 'coinPopup',
    x,
    y,
    w: 8,
    h: 8,
    vx: 0,
    vy: -1.5,
    life: 20,
    dead: false,
  };
}

export const spawnCoinPopup = createCoinPopup;

export function createMushroom(x, y) {
  return {
    kind: 'mushroom',
    x,
    y,
    w: 16,
    h: 16,
    vx: 0.7,
    vy: 0,
    onGround: false,
    dead: false,
    getHitbox() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    },
  };
}

export function updateMushroom(m, map) {
  applyGravity(m);
  const prevVx = m.vx;
  moveActor(m, map);
  if (m.vx === 0 && prevVx !== 0) m.vx = -prevVx;
}

export function updateCoinPopup(it, ctx) {
  it.y += it.vy;
  it.life -= 1;
  if (it.life <= 0) {
    ctx.onCoin?.();
    return false;
  }
  return true;
}

export function touchMushroom(m, player, ctx) {
  const hb = m.getHitbox();
  const ph = player.getHitbox();
  if (ph.x < hb.x + hb.w && ph.x + ph.w > hb.x && ph.y < hb.y + hb.h && ph.y + ph.h > hb.y) {
    if (player.state === 'small') player.state = 'super';
    ctx.onMushroom?.();
    return true;
  }
  return false;
}

export function updateItems(items, map, player, game, audio) {
  for (const it of items) {
    if (it.dead) continue;
    if (it.kind === 'coinPopup') {
      it.y += it.vy;
      it.life -= 1;
      if (it.life <= 0) {
        it.dead = true;
        game.coins += 1;
        game.score += 200;
        audio.sfxCoin();
        if (game.coins >= 100) {
          game.coins = 0;
          game.lives += 1;
        }
      }
      continue;
    }
    if (it.kind === 'mushroom') {
      updateMushroom(it, map);
      if (touchMushroom(it, player, { onMushroom: () => { game.score += 200; audio.sfxPowerup(); } })) it.dead = true;
    }
  }
}

export function drawItems(ctx, items, camera) {
  for (const it of items) {
    if (it.dead) continue;
    const sx = Math.floor(it.x - camera.x);
    const sy = Math.floor(it.y);
    if (it.kind === 'coinPopup') {
      ctx.fillStyle = P.gold;
      ctx.fillRect(sx, sy, 8, 8);
    } else {
      ctx.fillStyle = P.red;
      ctx.fillRect(sx + 4, sy + 2, 8, 6);
      ctx.fillStyle = P.w;
      ctx.fillRect(sx + 2, sy + 8, 12, 6);
      ctx.fillStyle = P.redD;
      ctx.fillRect(sx + 4, sy, 8, 4);
    }
  }
}

export function pruneItems(items) {
  return items.filter((i) => !i.dead);
}
