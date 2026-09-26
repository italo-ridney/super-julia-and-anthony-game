import { CHARACTERS, START_LIVES } from '../config.js';
import { input } from '../input.js';
import { P } from '../render/palette.js';
import { audio } from '../audio.js';
import { drawSelectMenu3D } from '../render/menu3d.js';
import { drawWrappedTag } from '../render/selectUi.js';

const ids = ['julia', 'anthony'];
let index = 0;
let tick = 0;

export function enter() {
  index = 0;
  tick = 0;
  audio.playLoop('grass');
}

export function exit() {
  audio.stopLoop();
}

export function update(game) {
  tick++;
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
  const heroes = ids.map((id) => ({
    id,
    partnerId: CHARACTERS[id].partnerId,
  }));
  drawSelectMenu3D(ctx, heroes, index, tick);

  const ch = CHARACTERS[ids[index]];
  ctx.fillStyle = 'rgba(8,16,48,0.72)';
  ctx.fillRect(4, 4, 248, 34);
  ctx.font = '9px monospace';
  ctx.fillStyle = P.gold;
  ctx.fillText(ch.name, 12, 16);
  ctx.fillStyle = P.w;
  ctx.font = '6px monospace';
  drawWrappedTag(ctx, ch.tag, 12, 24, 232, 8);
  ctx.font = '7px monospace';
  ctx.fillStyle = P.cyan;
  const pl = ids[index] === 'julia' ? 'Parceira' : 'Parceiro';
  ctx.fillText(`${pl}: ${ch.partnerName}`, 12, 34);
}
