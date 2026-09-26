import { CHARACTERS, PARTNER_CD } from '../config.js';
import { drawSprite, getSpriteFrame } from '../render/sprites.js';
import { createProjectile } from './projectile.js';
import { overlap } from './enemy.js';

export function createPartner(characterId) {
  const def = CHARACTERS[characterId];
  return {
    id: def.partnerId,
    name: def.partnerName,
    x: 0,
    y: 0,
    t: 0,
    cooldown: 0,
    spinTimer: 0,
    facing: 1,
    anim: 'idle',
    walkFrame: 0,
  };
}

function starSpinRadiusHit(player, target) {
  const hb = player.getHitbox();
  const cx = hb.x + hb.w / 2;
  const cy = hb.y + hb.h / 2;
  const tx = target.x + target.w / 2;
  const ty = target.y + target.h / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  return dx * dx + dy * dy <= 22 * 22;
}

export function updatePartner(partner, player, input, ctx) {
  const { audio, projectiles, enemies, boss, game } = ctx;
  partner.t += 1;
  if (partner.cooldown > 0) partner.cooldown -= 1;

  const targetX = player.x - 18 * player.facing;
  let targetY = player.y - (partner.id === 'rosalina' ? 10 : 0);
  partner.x += (targetX - partner.x) * 0.14;
  partner.y += (targetY - partner.y) * 0.14;
  if (partner.id === 'rosalina') partner.y += Math.sin(partner.t / 12) * 1.2;
  partner.facing = player.facing;

  if (player.starSpin > 0) {
    for (const e of enemies) {
      if (!e.dead && starSpinRadiusHit(player, e)) e.dead = true;
    }
    if (boss && !boss.dead && boss.hurtTimer <= 0 && starSpinRadiusHit(player, boss)) {
      boss.hit('star', player, ctx);
    }
  }

  if (!input.justPressed('special') || partner.cooldown > 0) return;

  if (partner.id === 'rosalina') {
    player.starSpin = 48;
    player.gravityMul = 0.22;
    player.invuln = Math.max(player.invuln, 48);
    partner.cooldown = PARTNER_CD;
    audio?.sfxStarSpin?.();
    return;
  }

  if (partner.id === 'mario') {
    const active = projectiles.filter((p) => p.type === 'fireball' && !p.dead).length;
    if (active >= 2) return;
    const hb = player.getHitbox();
    projectiles.push(
      createProjectile({
        type: 'fireball',
        x: hb.x + (player.facing > 0 ? hb.w : 0),
        y: hb.y + 4,
        vx: 2.6 * player.facing,
        vy: 1.2,
        facing: player.facing,
      }),
    );
    partner.cooldown = PARTNER_CD;
    audio?.sfxFireball?.();
  }
}

export function afterPlayerUpdate(player, partner) {
  if (player.starSpin === 0 && player.gravityMul !== 1) player.gravityMul = 1;
}

export function drawPartner(ctx, partner, camera) {
  const spriteName = partner.id === 'rosalina' ? 'rosalina' : 'mario';
  drawSprite(ctx, spriteName, 'idle', partner.x - camera.x, partner.y, partner.facing);
}
