import { CHARACTERS } from '../config.js';
import { P } from './palette.js';

/** HUD estilo Super Mario World (duas linhas compactas) */
export function drawHud(ctx, game, boss) {
  const hero = CHARACTERS[game.characterId]?.name?.split(' ')[0]?.toUpperCase() ?? 'MARIO';
  const score = String(game.score).padStart(6, '0');
  const coins = String(game.coins).padStart(2, '0');
  const world = `${game.levelIndex + 1}-1`;
  const time = String(Math.max(0, game.time)).padStart(3, '0');

  ctx.font = '8px monospace';
  ctx.fillStyle = P.w;
  ctx.fillText(hero, 8, 10);
  ctx.fillText(score, 56, 10);
  ctx.fillText('×' + game.lives, 8, 22);
  ctx.fillText('WORLD', 96, 10);
  ctx.fillText(world, 140, 10);
  ctx.fillText('$' + coins, 8, 34);
  ctx.fillText('TIME', 184, 10);
  ctx.fillText(time, 184, 22);

  if (game.inBoss && boss) {
    ctx.fillText(`BOWSER NEGRO ${boss.hp}/8`, 96, 34);
  }
}
