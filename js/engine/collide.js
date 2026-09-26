import { TILE } from '../config.js';
import { isSolid, isOneWay, isHazard, isGoal, isDoor, isCoin } from './tiles.js';

export function tileAtPx(map, px, py) {
  const tx = Math.floor(px / TILE);
  const ty = Math.floor(py / TILE);
  if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return 0;
  return map.tiles[ty][tx];
}

function blocks(id, actor, ty, prevBottom, vy) {
  if (isOneWay(id)) {
    const tileTop = ty * TILE;
    return vy > 0 && prevBottom <= tileTop + 2 && actor.y + actor.h >= tileTop;
  }
  return isSolid(id);
}

function forTiles(map, box, fn) {
  const tL = Math.floor(box.x / TILE);
  const tR = Math.floor((box.x + box.w - 0.001) / TILE);
  const tT = Math.floor(box.y / TILE);
  const tB = Math.floor((box.y + box.h - 0.001) / TILE);
  for (let ty = tT; ty <= tB; ty++) {
    for (let tx = tL; tx <= tR; tx++) {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) continue;
      fn(tx, ty, map.tiles[ty][tx]);
    }
  }
}

export function moveActor(actor, map, onBump) {
  actor.onGround = false;
  const hb = actor.getHitbox();

  actor.x += actor.vx;
  let box = actor.getHitbox();
  forTiles(map, box, (tx, ty, id) => {
    if (!blocks(id, actor, ty, box.y + box.h - actor.vy, actor.vx)) return;
    const tileL = tx * TILE;
    const tileR = tileL + TILE;
    if (actor.vx > 0) actor.x = tileL - (hb.w + (hb.x - actor.x));
    else if (actor.vx < 0) actor.x = tileR - (hb.x - actor.x);
    actor.vx = 0;
    box = actor.getHitbox();
  });

  const prevBottom = actor.getHitbox().y + actor.getHitbox().h;
  actor.y += actor.vy;
  box = actor.getHitbox();
  forTiles(map, box, (tx, ty, id) => {
    if (!blocks(id, actor, ty, prevBottom, actor.vy)) return;
    const tileTop = ty * TILE;
    const tileBot = tileTop + TILE;
    if (actor.vy > 0) {
      actor.y = tileTop - (box.h + (box.y - actor.y));
      actor.vy = 0;
      actor.onGround = true;
    } else if (actor.vy < 0) {
      actor.y = tileBot - (box.y - actor.y);
      actor.vy = 0;
      if ((id === 2 || id === 3 || id === 4) && onBump) onBump(tx, ty, id);
    }
  });

  if (actor.y > map.pixelH + 32 && actor.dieFromFall) actor.dieFromFall();

  box = actor.getHitbox();
  forTiles(map, box, (tx, ty, id) => {
    if (isHazard(id) && actor.takeHazardDamage) actor.takeHazardDamage();
    if (isCoin(id) && actor.collectCoin) actor.collectCoin(tx, ty);
    if (isGoal(id) && actor.touchGoal) actor.touchGoal();
    if (isDoor(id) && actor.touchDoor) actor.touchDoor();
  });
}
