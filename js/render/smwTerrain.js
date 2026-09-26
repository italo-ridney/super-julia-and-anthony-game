import { P } from './palette.js';
import { TILE } from '../config.js';

export function drawSmwGround(ctx, sx, sy, theme) {
  const topGreen = theme === 'grass' || theme === 'sky';
  if (topGreen) {
    ctx.fillStyle = P.green;
    ctx.fillRect(sx, sy, TILE, 4);
    ctx.fillStyle = P.greenD;
    for (let x = 0; x < TILE; x += 4) ctx.fillRect(sx + x, sy + 3, 2, 1);
  } else {
    ctx.fillStyle = P.ground;
    ctx.fillRect(sx, sy, TILE, 4);
  }
  ctx.fillStyle = P.ground;
  ctx.fillRect(sx, sy + 4, TILE, 8);
  ctx.fillStyle = P.groundD;
  ctx.fillRect(sx, sy + 12, TILE, 4);
}

export function drawSmwWater(ctx, sx, sy, tick) {
  const wave = tick % 32 < 16 ? P.cyan : P.cyanD;
  ctx.fillStyle = wave;
  ctx.fillRect(sx, sy + 2, TILE, TILE - 2);
  ctx.fillStyle = P.blueD;
  ctx.fillRect(sx, sy + 10, TILE, 6);
}
