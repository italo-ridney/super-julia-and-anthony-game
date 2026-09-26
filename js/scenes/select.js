import { CHARACTERS, START_LIVES } from '../config.js';
import { input } from '../input.js';
import { drawSprite } from '../render/sprites.js';
import { P } from '../render/palette.js';

const ids = ['julia', 'anthony'];
let index = 0;

export function enter() {
  index = 0;
}

export function update(game) {
  if (input.justPressed('left')) index = (index + ids.length - 1) % ids.length;
  if (input.justPressed('right')) index = (index + 1) % ids.length;
  if (input.justPressed('confirm')) {
    game.characterId = ids[index];
    game.lives = START_LIVES;
    game.coins = 0;
    game.score = 0;
    game.levelIndex = 0;
    game.inBoss = false;
    game.scene = 'play';
  }
}

export function draw(game, ctx) {
  ctx.fillStyle = P.sky;
  ctx.fillRect(0, 0, 256, 224);
  ids.forEach((id, i) => {
    const x = 40 + i * 120;
    const active = i === index;
    if (active) {
      ctx.strokeStyle = P.gold;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 8, 40, 112, 140);
    }
    drawSprite(ctx, id, 'idle', x + 20, 70, 1);
    const ch = CHARACTERS[id];
    ctx.fillStyle = P.w;
    ctx.font = '8px monospace';
    ctx.fillText(ch.name, x, 58);
    ctx.fillText(ch.tag, x, 130);
    const label = id === 'julia' ? 'Parceira:' : 'Parceiro:';
    ctx.fillText(`${label} ${ch.partnerName}`, x, 145);
  });
  ctx.fillText('← → escolher  ENTER jogar', 70, 210);
}
