import { buildLevel1 } from './level1.js';
import { buildLevel2 } from './level2.js';
import { buildLevel3 } from './level3.js';
import { buildLevel4 } from './level4.js';
import { buildLevel5, makeBossArena } from './level5.js';

export const LEVEL_COUNT = 5;

export function makeMap(w, theme, name) {
  const h = 14;
  const tiles = Array.from({ length: h }, () => Array(w).fill(0));
  return {
    w,
    h,
    theme,
    name,
    tiles,
    spawn: { x: 32, y: 160 },
    enemies: [],
    pixelW: w * 16,
    pixelH: h * 16,
    bossAtDoor: false,
  };
}

export function fillRect(map, x, y, w, h, id) {
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const tx = x + i;
      const ty = y + j;
      if (tx >= 0 && tx < map.w && ty >= 0 && ty < map.h) map.tiles[ty][tx] = id;
    }
  }
}

export function ground(map, x0, x1, y = 13) {
  fillRect(map, x0, y, x1 - x0, 1, 1);
}

export function put(map, x, y, id) {
  if (x >= 0 && x < map.w && y >= 0 && y < map.h) map.tiles[y][x] = id;
}

export function addEnemy(map, type, tx, ty, dir = -1) {
  map.enemies.push({ type, x: tx * 16, y: ty * 16, dir });
}

export function buildLevel(index) {
  return [buildLevel1, buildLevel2, buildLevel3, buildLevel4, buildLevel5][index]();
}

export { makeBossArena };
