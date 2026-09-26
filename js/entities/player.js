import {
  CHARACTERS,
  COYOTE,
  JUMP_BUF,
  JUMP_CUT,
  JUMP_V,
  INVULN,
  FRICTION,
  WALK_ACCEL,
  RUN_ACCEL,
  WALK_MAX,
  RUN_MAX,
} from '../config.js';
import { applyGravity } from '../engine/physics.js';
import { moveActor } from '../engine/collide.js';
import { drawSprite, getSpriteFrame } from '../render/sprites.js';
import { stompEnemy, kickShell, overlap } from './enemy.js';

export function createPlayer(characterId, x, y) {
  const def = CHARACTERS[characterId];
  const player = {
    characterId,
    x,
    y,
    vx: 0,
    vy: 0,
    w: 16,
    h: 24,
    state: 'super',
    facing: 1,
    onGround: false,
    invuln: 0,
    coyote: 0,
    jumpBuf: 0,
    gravityMul: 1,
    anim: 'idle',
    walkFrame: 0,
    animTick: 0,
    jumpMul: def.jumpMul,
    runMul: def.runMul,
    breakBricks: def.breakBricks,
    starSpin: 0,
    _game: null,
    _reload: null,
    _onDie: null,

    bind(game, reload, onGameOver) {
      this._game = game;
      this._reload = reload;
      this._onGameOver = onGameOver;
    },

    getHitbox() {
      if (this.state === 'super') {
        return { x: this.x + 2, y: this.y, w: 12, h: 24 };
      }
      return { x: this.x + 2, y: this.y + 2, w: 12, h: 14 };
    },

    die() {
      const game = this._game;
      if (!game) return;
      this._audio?.sfxDeath?.();
      game.lives -= 1;
      if (game.lives > 0 && this._reload) {
        this._reload();
      } else if (this._onGameOver) {
        this._onGameOver();
      } else {
        game.resultKind = 'gameover';
        game.scene = 'result';
      }
    },

    takeDamage(audio) {
      if (this.invuln > 0 || this.starSpin > 0) return;
      audio?.sfxDamage?.();
      if (this.state === 'super') {
        this.state = 'small';
        this.invuln = INVULN;
        this.vx = -2 * this.facing;
      } else {
        this.die();
      }
    },

    takeHazardDamage() {
      this.takeDamage(this._audio);
    },

    dieFromFall() {
      this.die();
    },
  };
  return player;
}

export function updatePlayer(player, input, map, ctx) {
  player._audio = ctx.audio;
  const {
    audio,
    enemies,
    boss,
    onBump,
    onCollectCoin,
    onTouchGoal,
    onTouchDoor,
  } = ctx;

  if (input.justPressed('jump')) player.jumpBuf = JUMP_BUF;
  else if (player.jumpBuf > 0) player.jumpBuf -= 1;

  const running = input.isDown('run');
  const accel = running ? RUN_ACCEL : WALK_ACCEL;
  const max = (running ? RUN_MAX : WALK_MAX) * player.runMul;

  if (input.isDown('left')) {
    player.vx -= accel;
    player.facing = -1;
  } else if (input.isDown('right')) {
    player.vx += accel;
    player.facing = 1;
  } else {
    if (player.vx > 0) player.vx = Math.max(0, player.vx - FRICTION);
    else if (player.vx < 0) player.vx = Math.min(0, player.vx + FRICTION);
    if (Math.abs(player.vx) < 0.05) player.vx = 0;
  }
  if (player.vx > max) player.vx = max;
  if (player.vx < -max) player.vx = -max;

  applyGravity(player);

  const wantJump = input.justPressed('jump') || player.jumpBuf > 0;
  if ((player.onGround || player.coyote > 0) && wantJump) {
    player.vy = JUMP_V * player.jumpMul;
    player.coyote = 0;
    player.jumpBuf = 0;
    player.onGround = false;
    audio?.sfxJump?.();
  }
  if (!input.isDown('jump') && player.vy < 0) player.vy *= JUMP_CUT;

  if (player.onGround) player.coyote = COYOTE;
  else if (player.coyote > 0) player.coyote -= 1;

  player.collectCoin = (tx, ty) => onCollectCoin?.(tx, ty);
  player.touchGoal = () => onTouchGoal?.();
  player.touchDoor = () => onTouchDoor?.();

  moveActor(player, map, onBump);

  if (player.invuln > 0) player.invuln -= 1;
  if (player.starSpin > 0) player.starSpin -= 1;

  const hb = player.getHitbox();
  for (const e of enemies) {
    if (e.dead) continue;
    if (!overlap(hb, e)) continue;
    if (stompEnemy(e, player)) {
      player.vy = -4;
      ctx.game.score += 100;
      audio?.sfxStomp?.();
      if (e.type === 'sheller' && e.shell && Math.abs(e.vx) < 0.1) kickShell(e, player);
      continue;
    }
    if (e.type === 'sheller' && e.shell && Math.abs(e.vx) > 0.1) {
      if (player.vy > 0 && hb.y + hb.h <= e.y + 8) {
        e.vx = 0;
        player.vy = -4;
      } else player.takeDamage(audio);
    } else {
      player.takeDamage(audio);
    }
  }

  if (boss && !boss.dead && boss.state !== 'dying') {
    const bb = boss.getHitbox();
    if (overlap(hb, bb)) {
      const head = player.vy > 0 && hb.y + hb.h <= bb.y + bb.h * 0.35;
      if (head && boss.hurtTimer <= 0) {
        boss.hit('stomp', player, ctx);
      } else if (boss.hurtTimer <= 0 && player.starSpin <= 0) {
        player.takeDamage(audio);
      }
    }
  }

  if (!player.onGround) player.anim = 'jump';
  else if (Math.abs(player.vx) > 0.3) {
    player.anim = 'walk';
    player.animTick += 1;
    if (player.animTick >= 6) {
      player.animTick = 0;
      player.walkFrame ^= 1;
    }
  } else {
    player.anim = 'idle';
    player.animTick = 0;
  }
}

export function drawPlayer(ctx, player, camera, tick) {
  if (player.invuln > 0 && (tick & 3) === 0) return;
  const frame = getSpriteFrame(player);
  const name = player.characterId;
  drawSprite(ctx, name, frame, player.x - camera.x, player.y, player.facing);
  if (player.starSpin > 0) {
    const hb = player.getHitbox();
    const cx = Math.floor(hb.x + hb.w / 2 - camera.x);
    const cy = Math.floor(hb.y + hb.h / 2);
    ctx.strokeStyle = 'rgba(112,224,240,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
  }
}
