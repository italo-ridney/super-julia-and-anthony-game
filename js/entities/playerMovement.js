import { TILE, SNES_MOVE, POWER } from '../config.js';
import { tileAtPx } from '../engine/collide.js';

export function applySnesHorizontal(player, input, running) {
  const M = SNES_MOVE;
  let max = (running ? M.RUN_MAX : M.WALK_MAX) * player.runMul;
  if (player.crouching) max *= M.CROUCH_SPEED_MUL;

  const accel = (running ? M.RUN_ACCEL : M.GROUND_ACCEL) * (player.onGround ? 1 : M.AIR_ACCEL_MUL);

  player.skidding = false;
  if (input.isDown('left')) {
    if (player.onGround && player.vx > M.SKID_THRESHOLD) {
      player.vx -= M.SKID_DECEL;
      player.skidding = true;
    } else player.vx -= accel;
    player.facing = -1;
  } else if (input.isDown('right')) {
    if (player.onGround && player.vx < -M.SKID_THRESHOLD) {
      player.vx += M.SKID_DECEL;
      player.skidding = true;
    } else player.vx += accel;
    player.facing = 1;
  } else if (player.onGround) {
    if (player.vx > 0) player.vx = Math.max(0, player.vx - M.GROUND_FRICTION);
    else if (player.vx < 0) player.vx = Math.min(0, player.vx + M.GROUND_FRICTION);
    if (Math.abs(player.vx) < 0.04) player.vx = 0;
  } else {
    player.vx *= 0.985;
  }

  if (player.vx > max) player.vx = max;
  if (player.vx < -max) player.vx = -max;
}

export function applySnesJump(player, input, audio) {
  const M = SNES_MOVE;

  if (input.justPressed('jump')) player.jumpBuf = M.JUMP_BUF;
  else if (player.jumpBuf > 0) player.jumpBuf -= 1;

  const dropThrough = input.isDown('down') && input.justPressed('jump');
  if (dropThrough && player.onGround) return;

  const wantJump = input.justPressed('jump') || player.jumpBuf > 0;
  if (player.crouching) return;

  if ((player.onGround || player.coyote > 0) && wantJump) {
    player.vy = M.JUMP_V * player.jumpMul;
    player.coyote = 0;
    player.jumpBuf = 0;
    player.onGround = false;
    player.jumpHoldFrames = M.JUMP_HOLD_MAX_FRAMES;
    player.isJumping = true;
    audio?.sfxJump?.();
  }

  if (!input.isDown('jump') && player.vy < 0) {
    player.vy *= M.JUMP_CUT;
    player.jumpHoldFrames = 0;
    player.isJumping = false;
  }

  if (player.onGround) {
    player.coyote = M.COYOTE;
    player.isJumping = false;
    player.jumpHoldFrames = 0;
  } else if (player.coyote > 0) player.coyote -= 1;
}

export function applySnesGravity(player, input) {
  const M = SNES_MOVE;
  let g = M.GRAVITY * (player.gravityMul ?? 1);
  if (player.vy < 0 && input.isDown('jump') && player.jumpHoldFrames > 0 && player.isJumping) {
    g *= M.JUMP_HOLD_GRAVITY_MUL;
    player.jumpHoldFrames -= 1;
  }
  player.vy += g;
  if (player.vy > M.MAX_FALL) player.vy = M.MAX_FALL;
}

/** ↓ + pulo em plataforma nuvem = atravessar */
export function tryDropThrough(player, map, input) {
  if (!input.isDown('down') || !input.justPressed('jump') || !player.onGround) return false;
  const hb = player.getHitbox();
  const cx = hb.x + hb.w / 2;
  const feet = hb.y + hb.h - 1;
  const id = tileAtPx(map, cx, feet);
  if (id !== 7) return false;
  player.y += 6;
  player.onGround = false;
  player.vy = 1.2;
  return true;
}

export function updateCrouch(player, input) {
  player.crouching =
    input.isDown('down') && player.onGround && !player.isJumping && Math.abs(player.vy) < 0.5;
}

export function syncPowerFromState(player) {
  if (player.state === 'small') player.power = POWER.SMALL;
  else if (player.state === 'fire') player.power = POWER.FIRE;
  else player.power = POWER.SUPER;
}

export function setPower(player, power) {
  player.power = power;
  if (power === POWER.SMALL) player.state = 'small';
  else if (power === POWER.FIRE) player.state = 'fire';
  else player.state = 'super';
}

export function canBreakBricks(player) {
  return player.breakBricks && (player.power === POWER.SUPER || player.power === POWER.FIRE);
}

export function stompBounceVy() {
  return SNES_MOVE.STOMP_BOUNCE;
}

export function bumpRecoilVy() {
  return SNES_MOVE.BUMP_VY;
}
