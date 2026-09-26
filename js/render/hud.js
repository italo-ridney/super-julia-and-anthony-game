import { CHARACTERS } from '../config.js';

export function drawHud(ctx, game) {
  const name = CHARACTERS[game.characterId]?.name?.split(' ')[0]?.toUpperCase() ?? 'JULIA';
  const coins = String(game.coins).padStart(2, '0');
  const world = `${game.levelIndex + 1}-1`;
  const time = String(Math.max(0, game.time)).padStart(3, '0');
  const base = `${name} | x${game.lives} | cx${coins} | ${world} | ${time}`;
  ctx.font = '8px monospace';
  ctx.fillStyle = '#f8f8f8';
  ctx.fillText(base, 4, 8);
  const scoreText = ` ${game.score}`;
  if (ctx.measureText(base + scoreText).width <= 252) {
    ctx.fillText(String(game.score), 256 - ctx.measureText(String(game.score)).width - 4, 8);
  }
  if (game.inBoss && game.bossHp != null) {
    ctx.fillText(`BOWSER NEGRO ${game.bossHp}/8`, 4, 18);
  }
}
