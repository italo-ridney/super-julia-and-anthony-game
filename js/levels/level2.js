import { makeMap, ground, fillRect, put, addEnemy } from './build.js';

export function buildLevel2() {
  const map = makeMap(200, 'cave', 'Caverna Sombria');
  fillRect(map, 0, 0, 200, 1, 13);
  fillRect(map, 0, 1, 31, 1, 13);
  fillRect(map, 80, 1, 31, 1, 13);
  fillRect(map, 160, 1, 40, 1, 13);
  ground(map, 0, 40);
  ground(map, 44, 70);
  ground(map, 75, 110);
  ground(map, 116, 145);
  ground(map, 151, 200);
  fillRect(map, 40, 13, 4, 1, 9);
  fillRect(map, 70, 13, 5, 1, 9);
  fillRect(map, 110, 13, 6, 1, 9);
  fillRect(map, 145, 13, 6, 1, 9);
  fillRect(map, 20, 5, 7, 1, 2);
  fillRect(map, 90, 6, 7, 1, 2);
  put(map, 22, 4, 3);
  put(map, 92, 5, 3);
  put(map, 130, 8, 3);
  put(map, 23, 4, 4);
  addEnemy(map, 'walker', 15, 12);
  addEnemy(map, 'walker', 50, 12);
  addEnemy(map, 'walker', 88, 12);
  addEnemy(map, 'walker', 125, 12);
  addEnemy(map, 'walker', 170, 12);
  addEnemy(map, 'sheller', 60, 12);
  addEnemy(map, 'sheller', 135, 12);
  addEnemy(map, 'flyer', 100, 6);
  addEnemy(map, 'flyer', 160, 5);
  map.spawn = { x: 3 * 16, y: 11 * 16 };
  put(map, 197, 11, 11);
  put(map, 197, 12, 11);
  return map;
}
