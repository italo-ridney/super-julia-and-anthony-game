export {
  GRAVITY,
  MAX_FALL,
  WALK_ACCEL,
  RUN_ACCEL,
  WALK_MAX,
  RUN_MAX,
  FRICTION,
  JUMP_V,
  JUMP_CUT,
} from '../config.js';

import { GRAVITY, MAX_FALL, FRICTION } from '../config.js';

export function applyGravity(actor) {
  actor.vy += GRAVITY * (actor.gravityMul ?? 1);
  if (actor.vy > MAX_FALL) actor.vy = MAX_FALL;
}

export function applyFriction(actor) {
  if (actor.vx > 0) actor.vx = Math.max(0, actor.vx - FRICTION);
  else if (actor.vx < 0) actor.vx = Math.min(0, actor.vx + FRICTION);
  if (Math.abs(actor.vx) < 0.05) actor.vx = 0;
}
