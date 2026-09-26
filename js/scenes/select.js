import { CHARACTERS, START_LIVES } from '../config.js';
import { input } from '../input.js';
import { drawSpriteScaled } from '../render/sprites.js';
import { drawBackground } from '../render/tileset.js';
import { P } from '../render/palette.js';
import { camera } from '../engine/camera.js';
import { audio } from '../audio.js';
import {
  drawHeroCard,
  drawTitleBanner,
  drawWrappedTag,
  drawPartnerRow,
  drawGroundStrip,
} from '../render/selectUi.js';

const ids = ['julia', 'anthony'];
const CARD = { w: 118, h: 148, y: 44 };
let index = 0;
let tick = 0;

function cardX(i) {
  return 6 + i * (CARD.w + 8);
}

export function enter() {
  index = 0;
  tick = 0;
  camera.x = 0;
  audio.playLoop('grass');
}

export function exit() {
  audio.stopLoop();
}

export function update(game) {
  tick++;
  camera.x = index * 24 + Math.sin(tick / 40) * 8;

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
  drawBackground(ctx, 'grass', camera);
  drawGroundStrip(ctx, 198);

  ctx.font = '11px monospace';
  drawTitleBanner(ctx, 'ESCOLHA SEU HERÓI');

  ids.forEach((id, i) => {
    const x = cardX(i);
    const active = i === index;
    const ch = CHARACTERS[id];
    const partnerSprite = ch.partnerId;

    drawHeroCard(ctx, x, CARD.y, CARD.w, CARD.h, active, tick);

    ctx.font = '8px monospace';
    ctx.fillStyle = active ? P.gold : P.w;
    const nameW = ctx.measureText(ch.name).width;
    ctx.fillText(ch.name, x + Math.floor((CARD.w - nameW) / 2), CARD.y + 14);

    const frame = active && tick % 20 < 10 ? 'walk0' : 'idle';
    const scale = active ? 3 : 2;
    const spriteX = x + Math.floor(CARD.w / 2) - 8 * scale;
    const spriteY = CARD.y + 28;
    const bob = active ? Math.sin(tick / 12) * 2 : 0;
    drawSpriteScaled(ctx, id, frame, spriteX, spriteY + bob, scale, 1);

    const tagY = CARD.y + 98;
    drawWrappedTag(ctx, ch.tag, x + 6, tagY, CARD.w - 12);

    const partnerLabel = id === 'julia' ? 'Parceira' : 'Parceiro';
    drawPartnerRow(ctx, partnerLabel, partnerSprite, x + 6, CARD.y + 116, tick);
  });

  if (tick % 50 < 35) {
    ctx.font = '8px monospace';
    ctx.fillStyle = P.w;
    ctx.textAlign = 'center';
    ctx.fillText('← → PERSONAGEM    ENTER JOGAR', 128, 218);
    ctx.textAlign = 'left';
  }
}
