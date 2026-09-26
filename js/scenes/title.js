import { input } from '../input.js';
import { drawBackground } from '../render/tileset.js';
import { drawSprite } from '../render/sprites.js';
import { P } from '../render/palette.js';
import { camera } from '../engine/camera.js';
import { audio } from '../audio.js';

let tick = 0;

export function enter() {
  tick = 0;
  camera.x = 0;
  audio.playLoop('title');
}

export function exit() {
  audio.stopLoop();
}

export function update(game) {
  tick++;
  if (input.justPressed('confirm')) game.scene = 'select';
}

export function draw(game, ctx) {
  drawBackground(ctx, 'grass', camera);
  drawSprite(ctx, 'julia', 'idle', 60, 120, 1);
  drawSprite(ctx, 'rosalina', 'idle', 40, 110, 1);
  drawSprite(ctx, 'anthony', 'idle', 150, 120, 1);
  drawSprite(ctx, 'mario', 'idle', 175, 120, -1);
  ctx.font = '16px monospace';
  ctx.lineWidth = 2;
  ctx.strokeStyle = P.blueD;
  ctx.strokeText('SUPER JULIA & ANTHONY', 28, 50);
  ctx.fillStyle = P.w;
  ctx.fillText('SUPER JULIA & ANTHONY', 28, 50);
  if (tick % 60 < 40) {
    ctx.font = '10px monospace';
    ctx.fillText('Pressione ENTER', 88, 200);
  }
}
