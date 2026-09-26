import { LEVEL_TIME, TILE, VIEW_W } from '../config.js';
import { input } from '../input.js';
import { audio } from '../audio.js';
import { camera, updateCamera, resetCamera } from '../engine/camera.js';
import { buildLevel, makeBossArena } from '../levels/build.js';
import { drawBackground, drawTile } from '../render/tileset.js';
import { drawSprite, getSpriteFrame } from '../render/sprites.js';
import { drawHud } from '../render/hud.js';
import { createPlayer, updatePlayer } from '../entities/player.js';
import { createPartner, updatePartner, afterPlayerUpdate } from '../entities/partner.js';
import { createEnemy, updateEnemy, shellHits } from '../entities/enemy.js';
import { createBoss, updateBoss } from '../entities/boss.js';
import { updateProjectiles, drawProjectile, pruneProjectiles } from '../entities/projectile.js';
import {
  spawnCoinPopup,
  createMushroom,
  updateMushroom,
  updateCoinPopup,
  touchMushroom,
} from '../entities/items.js';

let router = () => {};
let gameRef = null;
let map = null;
let player = null;
let partner = null;
let enemies = [];
let projectiles = [];
let items = [];
let particles = [];
let boss = null;
let paused = false;
let tick = 0;
let timerFrames = 0;

const themeLoop = {
  grass: 'grass',
  cave: 'cave',
  sky: 'sky',
  mountain: 'mountain',
  castle: 'castle',
};

export function setRouter(fn) {
  router = fn;
}

function addScore(game, n) {
  game.score += n;
}

function addCoin(game) {
  game.coins++;
  addScore(game, 200);
  audio.sfxCoin();
  if (game.coins >= 100) {
    game.coins = 0;
    game.lives++;
  }
}

function spawnBrickParticles(tx, ty) {
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: tx * TILE + 4,
      y: ty * TILE + 4,
      vx: (Math.random() - 0.5) * 3,
      vy: -1 - Math.random() * 2,
      life: 20,
      color: '#b07030',
      w: 2,
      h: 2,
    });
  }
}

function onBump(tx, ty, id) {
  const row = map.tiles[ty];
  if (!row) return;
  if (id === 2) {
    if (player.breakBricks && player.state === 'super') {
      row[tx] = 0;
      spawnBrickParticles(tx, ty);
    }
    return;
  }
  if (id === 3) {
    row[tx] = 6;
    items.push(spawnCoinPopup(tx * TILE, ty * TILE));
    return;
  }
  if (id === 4) {
    row[tx] = 6;
    if (player.state === 'small') items.push(createMushroom(tx * TILE, (ty - 1) * TILE));
    else items.push(spawnCoinPopup(tx * TILE, ty * TILE));
  }
}

function playCtx() {
  return {
    game: gameRef,
    audio,
    projectiles,
    enemies,
    boss,
    onBump,
    onCollectCoin: (tx, ty) => {
      if (map.tiles[ty][tx] === 8) {
        map.tiles[ty][tx] = 0;
        addCoin(gameRef);
      }
    },
    onTouchGoal: () => {
      if (!gameRef.inBoss && gameRef.levelIndex <= 3) {
        addScore(gameRef, 1000);
        audio.sfxClear();
        router('result', 'cleared');
      }
    },
    onTouchDoor: () => {
      if (map.bossAtDoor && !gameRef.inBoss) enterBossArena();
    },
    onCoin: () => addCoin(gameRef),
    onMushroom: () => {
      addScore(gameRef, 200);
      audio.sfxPowerup();
    },
    onStomp: () => addScore(gameRef, 100),
    onBossHit: () => addScore(gameRef, 500),
    onEnemyKill: () => addScore(gameRef, 100),
  };
}

function enterBossArena() {
  gameRef.inBoss = true;
  map = makeBossArena();
  camera.lock = true;
  camera.x = 0;
  enemies = [];
  items = [];
  projectiles = [];
  player.x = map.spawn.x;
  player.y = map.spawn.y;
  player.vx = 0;
  player.vy = 0;
  boss = createBoss(map.bossSpawn.x, map.bossSpawn.y);
  audio.stopLoop();
  audio.playLoop('boss');
}

function loadStage() {
  resetCamera();
  projectiles = [];
  items = [];
  particles = [];
  timerFrames = 0;
  gameRef.time = LEVEL_TIME;
  paused = false;

  if (gameRef.inBoss) {
    map = makeBossArena();
    camera.lock = true;
    camera.x = 0;
    boss = createBoss(map.bossSpawn.x, map.bossSpawn.y);
    enemies = [];
  } else {
    map = buildLevel(gameRef.levelIndex);
    boss = null;
    camera.lock = !!map.cameraLock;
    enemies = map.enemies.map((e) => createEnemy(e));
  }

  player = createPlayer(gameRef.characterId, map.spawn.x, map.spawn.y);
  player.bind(gameRef, () => loadStage());
  partner = createPartner(gameRef.characterId);

  audio.stopLoop();
  const loopName = gameRef.inBoss ? 'boss' : themeLoop[map.theme] || 'grass';
  audio.playLoop(loopName);
}

export function enter(game) {
  gameRef = game;
  tick = 0;
  loadStage();
}

export function exit() {
  audio.stopLoop();
}

export function update(game) {
  gameRef = game;
  tick++;

  if (input.justPressed('pause')) paused = !paused;
  if (paused) {
    if (input.justPressed('confirm') || input.justPressed('pause')) paused = false;
    return;
  }

  timerFrames++;
  if (timerFrames >= 60) {
    timerFrames = 0;
    game.time--;
    if (game.time <= 0) player.die();
  }

  const ctx = playCtx();
  updatePlayer(player, input, map, ctx);
  updatePartner(partner, player, input, ctx);
  afterPlayerUpdate(player, partner);

  for (const e of enemies) {
    updateEnemy(e, map, player, ctx);
    if (e.type === 'sheller' && e.shell && Math.abs(e.vx) > 0.1) shellHits(enemies, e);
  }
  enemies = enemies.filter((e) => !e.dead);

  if (boss) updateBoss(boss, player, map, projectiles, ctx);
  updateProjectiles(projectiles, map, camera, {
    enemies,
    boss,
    player,
    audio,
    onBossHit: (b, _p, pl) => {
      if (b && !b.dead) b.hit('fireball', pl, playCtx());
    },
    onEnemyKill: () => addScore(game, 100),
  });
  projectiles = pruneProjectiles(projectiles);

  items = items.filter((it) => {
    if (it.kind === 'coinPopup') return updateCoinPopup(it, ctx);
    if (it.kind === 'mushroom') {
      updateMushroom(it, map);
      if (touchMushroom(it, player, ctx)) return false;
      return true;
    }
    return false;
  });

  particles = particles.filter((pt) => {
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life--;
    return pt.life > 0;
  });

  if (!camera.lock) updateCamera(player, map);
}

export function draw(game, ctx) {
  drawBackground(ctx, map.theme, camera);

  const t0 = Math.floor(camera.x / TILE);
  const t1 = Math.ceil((camera.x + VIEW_W) / TILE);
  for (let ty = 0; ty < map.h; ty++) {
    for (let tx = t0; tx < t1; tx++) {
      if (tx < 0 || tx >= map.w) continue;
      const id = map.tiles[ty][tx];
      if (!id) continue;
      drawTile(ctx, id, tx * TILE - camera.x, ty * TILE - camera.y, map.theme, tick);
    }
  }

  for (const it of items) {
    const sx = it.x - camera.x;
    const sy = it.y - camera.y;
    if (it.kind === 'coinPopup') {
      ctx.fillStyle = '#f0c838';
      ctx.fillRect(sx + 4, sy + 4, 8, 8);
    } else {
      ctx.fillStyle = '#d03030';
      ctx.fillRect(sx + 2, sy + 4, 12, 10);
    }
  }

  for (const e of enemies) {
    if (e.dead) continue;
    const fr =
      e.type === 'sheller' && e.shell
        ? 'shell'
        : getSpriteFrame({ anim: 'walk', walkFrame: (tick >> 3) & 1, onGround: true });
    drawSprite(ctx, e.type, fr, e.x - camera.x, e.y - camera.y, e.dir);
  }

  if (boss) {
    let frame = 'idle';
    if (boss.flash > 0 && tick % 4 < 2) frame = 'hurt';
    else if (boss.state === 'dying' && tick % 6 < 3) frame = 'dying';
    else if (boss.state === 'walk') frame = tick % 12 < 6 ? 'walk0' : 'walk1';
    drawSprite(ctx, 'boss', frame, boss.x - camera.x - 8, boss.y - camera.y - 8, boss.facing);
  }

  for (const p of projectiles) drawProjectile(ctx, p, camera);

  if (player.starSpin > 0) {
    const ph = player.getHitbox();
    ctx.strokeStyle = '#70e0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ph.x + ph.w / 2 - camera.x, ph.y + ph.h / 2 - camera.y, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  const showPlayer = player.invuln <= 0 || tick % 4 < 2;
  if (showPlayer) {
    drawSprite(
      ctx,
      player.characterId,
      getSpriteFrame(player),
      player.x - camera.x,
      player.y - camera.y,
      player.facing,
    );
  }
  drawSprite(ctx, partner.id, 'idle', partner.x - camera.x, partner.y - camera.y, player.facing);

  for (const pt of particles) {
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - camera.x, pt.y - camera.y, pt.w, pt.h);
  }

  drawHud(ctx, game, boss);

  if (paused) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, VIEW_W, 224);
    ctx.fillStyle = '#f8f8f8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSA', 128, 100);
    ctx.font = '8px monospace';
    ctx.fillText('ENTER ou ESC para continuar', 128, 120);
    ctx.textAlign = 'left';
  }
}
