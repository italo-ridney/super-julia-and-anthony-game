import { applyGravity } from '../engine/physics.js';
import { moveActor } from '../engine/collide.js';
import { drawSprite } from '../render/sprites.js';
import { createProjectile } from './projectile.js';
import { overlap } from './enemy.js';

export function createBoss(x, y) {
  return {
    name: 'Bowser Negro',
    x: x - 8,
    y: y - 8,
    w: 48,
    h: 56,
    vx: 0,
    vy: 0,
    onGround: false,
    hp: 8,
    state: 'walk',
    timer: 0,
    phaseTimer: 0,
    hurtTimer: 0,
    flash: 0,
    facing: -1,
    dead: false,
    eyeGlow: false,
    getHitbox() {
      let w = this.w;
      let h = this.h;
      let ox = 0;
      if (this.state === 'slam') {
        w += 16;
        ox = -8;
      }
      return { x: this.x + ox, y: this.y, w, h };
    },
    hit(kind, player, ctx) {
      if (this.hurtTimer > 0 || this.state === 'dying' || this.dead) return;
      this.hp -= 1;
      this.hurtTimer = 30;
      this.flash = 20;
      ctx.game.score += 500;
      ctx.audio?.sfxBossHit?.();
      if (kind === 'stomp') player.vy = -4.5;
      if (this.hp <= 0) {
        this.state = 'dying';
        this.phaseTimer = 90;
      }
    },
  };
}

export function updateBoss(boss, player, map, projectiles, ctx) {
  if (!boss || boss.dead) return;
  if (boss.flash > 0) boss.flash -= 1;
  if (boss.hurtTimer > 0) boss.hurtTimer -= 1;

  if (boss.state === 'dying') {
    boss.phaseTimer -= 1;
    if (boss.phaseTimer <= 0) {
      boss.dead = true;
      ctx.game.score += 5000;
      ctx.deferVictory?.();
    }
    return;
  }

  boss.facing = player.x >= boss.x ? 1 : -1;

  switch (boss.state) {
    case 'walk':
      boss.vx = 0.7 * boss.facing;
      applyGravity(boss);
      moveActor(boss, map);
      boss.phaseTimer += 1;
      if (boss.phaseTimer >= 90) {
        boss.state = 'telegraph';
        boss.phaseTimer = 0;
        boss.vx = 0;
        boss.eyeGlow = true;
      }
      break;
    case 'telegraph':
      boss.vx = 0;
      boss.phaseTimer += 1;
      if (boss.phaseTimer >= 30) {
        boss.state = 'breath';
        boss.phaseTimer = 0;
      }
      break;
    case 'breath':
      boss.vx = 0;
      boss.phaseTimer += 1;
      if (boss.phaseTimer % 8 === 0) {
        const hb = boss.getHitbox();
        projectiles.push(
          createProjectile({
            type: 'darkFire',
            x: hb.x + (boss.facing > 0 ? hb.w : 0),
            y: hb.y + 20,
            w: 12,
            h: 12,
            vx: 1.8 * boss.facing,
            vy: 0,
            life: 90,
          }),
        );
      }
      if (boss.phaseTimer >= 50) {
        boss.state = 'jump';
        boss.phaseTimer = 0;
        boss.eyeGlow = false;
        boss.vy = -5.5;
      }
      break;
    case 'jump':
      applyGravity(boss);
      moveActor(boss, map);
      if (boss.onGround) {
        boss.state = 'slam';
        boss.phaseTimer = 12;
      }
      break;
    case 'slam':
      boss.vx = 0;
      boss.phaseTimer -= 1;
      if (player.onGround) {
        const bb = boss.getHitbox();
        const pb = player.getHitbox();
        if (overlap(bb, pb) && player.invuln <= 0 && player.starSpin <= 0) {
          player.takeDamage(ctx.audio);
        }
      }
      if (boss.phaseTimer <= 0) {
        boss.state = 'walk';
        boss.phaseTimer = 0;
      }
      break;
    default:
      break;
  }

  ctx.game.bossHp = boss.hp;
}

export function bossHitByProjectile(boss, projectile, player, ctx) {
  if (projectile.type !== 'fireball' && projectile.type !== 'darkFire') return false;
  if (projectile.type === 'darkFire') return false;
  const bb = boss.getHitbox();
  if (!overlap(projectile, bb)) return false;
  projectile.dead = true;
  boss.hit('fireball', player, ctx);
  return true;
}

export function drawBoss(ctx, boss, camera, tick) {
  if (!boss) return;
  let frame = 'idle';
  if (boss.state === 'walk') frame = (tick >> 4) & 1 ? 'walk1' : 'walk0';
  if (boss.flash > 0 && (tick & 2)) frame = 'hurt';
  if (boss.state === 'dying' && (tick & 4)) frame = 'dying';
  const sx = boss.x - camera.x - 8;
  const sy = boss.y - 8;
  drawSprite(ctx, 'boss', frame, sx, sy, boss.facing);
}
