import { makeMap, ground, fillRect, put, addEnemy } from './build.js';

const PLATFORMS = [
  [18, 11, 5], [28, 9, 4], [38, 7, 4], [50, 8, 6], [64, 6, 4],
  [76, 9, 5], [90, 7, 8], [108, 5, 4], [122, 8, 5], [138, 6, 6],
  [154, 9, 4], [168, 7, 5], [184, 5, 6], [200, 8, 7], [214, 10, 8],
];

export function buildLevel3() {
  const map = makeMap(240, 'sky', 'Céu Atlético');
  ground(map, 0, 16);
  ground(map, 230, 240);
  for (const [x, y, w] of PLATFORMS) {
    fillRect(map, x, y, w, 1, 7);
    if (w >= 5) {
      put(map, x, y - 1, 8);
      put(map, x + w - 1, y - 1, 8);
    }
  }
  put(map, 92, 5, 3);
  put(map, 186, 3, 3);
  put(map, 52, 6, 4);
  addEnemy(map, 'flyer', 40, 5);
  addEnemy(map, 'flyer', 100, 4);
  addEnemy(map, 'flyer', 160, 4);
  addEnemy(map, 'flyer', 205, 5);
  addEnemy(map, 'walker', 92, 6);
  addEnemy(map, 'walker', 203, 7);
  map.spawn = { x: 2 * 16, y: 11 * 16 };
  put(map, 236, 11, 11);
  put(map, 236, 12, 11);
  return map;
}
