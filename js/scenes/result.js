import { input } from '../input.js';
import { buildLevel } from '../levels/build.js';
import { P } from '../render/palette.js';

export function enter(game) {
  if (game.resultKind === 'victory' || game.resultKind === 'gameover') {
    game.inBoss = false;
  }
}

export function update(game) {
  if (input.justPressed('confirm')) {
    if (game.resultKind === 'cleared') {
      game.levelIndex++;
      game.inBoss = false;
      game.scene = 'play';
    } else {
      game.scene = 'title';
    }
  }
}

export function draw(game, ctx) {
  ctx.fillStyle = P.k;
  ctx.fillRect(0, 0, 256, 224);
  ctx.fillStyle = P.w;
  ctx.font = '12px monospace';
  if (game.resultKind === 'cleared') {
    ctx.fillText('FASE CONCLUÍDA!', 70, 80);
    const next = buildLevel(Math.min(game.levelIndex + 1, 4));
    ctx.font = '10px monospace';
    ctx.fillText(`Próxima: ${next.name}`, 60, 110);
  } else if (game.resultKind === 'gameover') {
    ctx.fillText('FIM DE JOGO', 88, 100);
  } else if (game.resultKind === 'victory') {
    ctx.fillText('BOWSER NEGRO FOI DERROTADO!', 28, 80);
    ctx.font = '10px monospace';
    ctx.fillText('Julia e Anthony salvaram o reino!', 40, 110);
  }
  ctx.fillText('ENTER', 110, 180);
}
