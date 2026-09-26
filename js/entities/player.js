import { INVULN, POWER } from '../config.js';
import { moveActor } from '../engine/collide.js';
import { drawSprite, getSpriteFrame, getPlayerSpriteKey } from '../render/sprites.js';
import { stompEnemy, kickShell, overlap } from './enemy.js';
import {
  applySnesHorizontal,
  applySnesJump,
  applySnesGravity,
  syncPowerFromState,
  stompBounceVy,
  canBreakBricks,
  updateCrouch,
  tryDropThrough,
  updateWallSlide,
  updateSwimState,
  applySwimHorizontal,
} from './playerMovement.js';
import { CHARACTERS } from '../config.js';

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
    power: POWER.SUPER,
    facing: 1,
    onGround: false,
    invuln: 0,
    coyote: 0,
    jumpBuf: 0,
    jumpHoldFrames: 0,
    isJumping: false,
    gravityMul: 1,
    anim: 'idle',
    walkFrame: 0,
    animTick: 0,
    jumpMul: def.jumpMul,
    runMul: def.runMul,
    breakBricks: def.breakBricks,
    starSpin: 0,
    crouching: false,
    skidding: false,
    swimming: false,
    wallSliding: false,
    wallContact: 0,
    pose: null,
    _game: null,
    _reload: null,
    _onGameOver: null,

    bind(game, reload, onGameOver) {
      this._game = game;
      this._reload = reload;
      this._onGameOver = onGameOver;
    },

    getHitbox() {
      if (this.power === POWER.SMALL || this.state === 'small') {
        return { x: this.x + 2, y: this.y + 10, w: 12, h: 14 };
      }
      if (this.crouching) {
        return { x: this.x + 2, y: this.y + 10, w: 12, h: 14 };
      }
      return { x: this.x + 2, y: this.y, w: 12, h: 24 };
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
      syncPowerFromState(this);
      if (this.power !== POWER.SMALL) {
        this.state = 'small';
        this.power = POWER.SMALL;
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
  syncPowerFromState(player);
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

  syncPowerFromState(player);
  updateSwimState(player, map);
  updateCrouch(player, input);
  if (tryDropThrough(player, map, input)) {
    player.crouching = false;
  }

  const running = input.isDown('run') && !player.crouching;

  if (player.swimming) {
    applySwimHorizontal(player, input, running);
    applySnesJump(player, input, audio);
    applySnesGravity(player, input);
  } else {
    applySnesHorizontal(player, input, running);
    applySnesJump(player, input, audio);
    applySnesGravity(player, input);
    updateWallSlide(player, map, input);
  }

  player.collectCoin = (tx, ty) => onCollectCoin?.(tx, ty);
  player.touchGoal = () => onTouchGoal?.();
  player.touchDoor = () => onTouchDoor?.();

  moveActor(player, map, onBump);

  if (player.invuln > 0) player.invuln -= 1;
  if (player.starSpin > 0) player.starSpin -= 1;

  const hb = player.getHitbox();
  const bounce = stompBounceVy();
  for (const e of enemies) {
    if (e.dead) continue;
    if (!overlap(hb, e)) continue;
    if (stompEnemy(e, player)) {
      player.vy = bounce;
      ctx.game.score += 100;
      audio?.sfxStomp?.();
      if (e.type === 'sheller' && e.shell && Math.abs(e.vx) < 0.1) kickShell(e, player);
      continue;
    }
    if (e.type === 'sheller' && e.shell && Math.abs(e.vx) > 0.1) {
      if (player.vy > 0 && hb.y + hb.h <= e.y + 8) {
        e.vx = 0;
        player.vy = bounce;
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

  player.animTick += 1;
  const speed = Math.abs(player.vx);
  if (player.swimming) {
    player.anim = speed > 0.2 || input.isDown('jump') ? 'walk' : 'idle';
  } else if (player.wallSliding) {
    player.anim = 'jump';
  } else if (!player.onGround) player.anim = 'jump';
  else if (speed > 0.3) {
    player.anim = speed > 1.8 && running ? 'run' : 'walk';
    player.animTick += 1;
    const frameRate = running ? 4 : 6;
    if (player.animTick >= frameRate) {
      player.animTick = 0;
      player.walkFrame ^= 1;
    }
  } else {
    player.anim = 'idle';
    player.animTick = 0;
  }
}

export { canBreakBricks };

export function drawPlayer(ctx, player, camera, tick) {
  if (player.invuln > 0 && (tick & 3) === 0) return;
  const frame = getSpriteFrame(player);
  drawSprite(ctx, getPlayerSpriteKey(player), frame, player.x - camera.x, player.y, player.facing);
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
