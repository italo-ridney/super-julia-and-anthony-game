import { TILE } from '../config.js';
import { P } from './palette.js';
import { T } from '../engine/tiles.js';

export const INTERACTIVE_BLOCKS = {
  [T.brick]: { solid: true, bumpable: true, breakable: true, draw: 'brick' },
  [T.qCoin]: { solid: true, bumpable: true, spawn: 'coin', draw: 'question' },
  [T.qMush]: { solid: true, bumpable: true, spawn: 'mushroom', draw: 'question' },
  [T.used]: { solid: true, draw: 'used' },
  [T.pipe]: { solid: true, draw: 'pipe' },
  [T.coin]: { solid: false, collect: true, draw: 'coin' },
};

export function getBlockMeta(tileId) {
  return INTERACTIVE_BLOCKS[tileId] ?? null;
}

function px(ctx, c, x, y, w, h) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}

export function drawBrickTile(ctx, sx, sy) {
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const bx = sx + col * 8;
      const by = sy + row * 8;
      px(ctx, P.brick, bx, by, 8, 8);
      px(ctx, P.brickHi, bx, by, 8, 2);
      px(ctx, P.brickSh, bx, by + 6, 8, 2);
      px(ctx, P.brickSh, bx, by, 2, 8);
    }
  }
  px(ctx, P.brickMortar, sx + 7, sy, 2, 16);
  px(ctx, P.brickMortar, sx, sy + 7, 16, 2);
}

export function drawQuestionTile(ctx, sx, sy, tick) {
  const pulse = tick % 24 < 12;
  px(ctx, P.qBlock, sx + 1, sy + 1, 14, 14);
  px(ctx, pulse ? P.qBlockHi : P.qBlockLo, sx + 2, sy + 2, 12, 3);
  px(ctx, P.qBlockSh, sx + 2, sy + 12, 12, 2);
  px(ctx, P.qBlockSh, sx + 12, sy + 2, 2, 12);
  px(ctx, P.qBlockSh, sx + 2, sy + 2, 2, 12);
  ctx.fillStyle = P.k;
  ctx.font = 'bold 9px monospace';
  ctx.fillText('?', sx + 5, sy + 12);
}

export function drawUsedTile(ctx, sx, sy) {
  px(ctx, P.usedBlock, sx, sy, TILE, TILE);
  px(ctx, P.usedBlockSh, sx + 2, sy + 10, 12, 4);
  ctx.fillStyle = P.k;
  ctx.beginPath();
  ctx.arc(sx + 8, sy + 8, 3, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPipeTile(ctx, sx, sy) {
  px(ctx, P.pipeSh, sx, sy, TILE, TILE);
  px(ctx, P.pipe, sx + 2, sy, 12, TILE);
  px(ctx, P.pipeHi, sx + 3, sy + 1, 3, TILE - 2);
  px(ctx, P.pipeLip, sx, sy, TILE, 4);
  px(ctx, P.pipeHi, sx + 2, sy + 1, 12, 2);
}

export function drawSpinCoin(ctx, sx, sy, tick) {
  const frames = [8, 6, 4, 6];
  const w = frames[(tick >> 2) % 4];
  const ox = Math.floor((8 - w) / 2);
  px(ctx, P.coinHi, sx + 4 + ox, sy + 4, w, 8);
  px(ctx, P.coinSh, sx + 4 + ox + 1, sy + 5, Math.max(2, w - 2), 6);
}

export function drawInteractiveById(ctx, id, sx, sy, theme, tick) {
  const meta = getBlockMeta(id);
  if (!meta) return false;
  switch (meta.draw) {
    case 'brick':
      drawBrickTile(ctx, sx, sy);
      return true;
    case 'question':
      drawQuestionTile(ctx, sx, sy, tick);
      return true;
    case 'used':
      drawUsedTile(ctx, sx, sy);
      return true;
    case 'pipe':
      drawPipeTile(ctx, sx, sy);
      return true;
    case 'coin':
      drawSpinCoin(ctx, sx, sy, tick);
      return true;
    default:
      return false;
  }
}
