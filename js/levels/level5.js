import { makeMap, ground, fillRect, put, addEnemy } from './build.js';

export function buildLevel5() {
  const map = makeMap(180, 'castle', 'Castelo Negro');
  map.bossAtDoor = true;
  fillRect(map, 0, 0, 180, 2, 13);
  ground(map, 0, 30);
  ground(map, 36, 60);
  ground(map, 66, 95);
  ground(map, 102, 130);
  ground(map, 136, 154);
  fillRect(map, 30, 13, 6, 1, 9);
  fillRect(map, 60, 13, 6, 1, 9);
  fillRect(map, 95, 13, 7, 1, 9);
  fillRect(map, 130, 13, 6, 1, 9);
  fillRect(map, 154, 13, 26, 1, 9);
  fillRect(map, 20, 10, 2, 3, 13);
  fillRect(map, 80, 9, 2, 4, 13);
  put(map, 22, 8, 3);
  put(map, 82, 7, 3);
  put(map, 81, 7, 2);
  put(map, 83, 7, 2);
  addEnemy(map, 'walker', 18, 12);
  addEnemy(map, 'walker', 45, 12);
  addEnemy(map, 'walker', 88, 12);
  addEnemy(map, 'walker', 120, 12);
  addEnemy(map, 'sheller', 55, 12);
  addEnemy(map, 'sheller', 110, 12);
  addEnemy(map, 'flyer', 70, 5);
  addEnemy(map, 'flyer', 125, 5);
  map.spawn = { x: 3 * 16, y: 11 * 16 };
  put(map, 150, 11, 12);
  put(map, 150, 12, 12);
  return map;
}

export function makeBossArena() {
  const map = makeMap(20, 'castle', 'Arena do Bowser Negro');
  map.cameraLock = true;
  ground(map, 0, 20);
  fillRect(map, 0, 0, 20, 2, 13);
  fillRect(map, 0, 2, 1, 11, 13);
  fillRect(map, 19, 2, 1, 11, 13);
  map.spawn = { x: 2 * 16, y: 11 * 16 };
  map.bossSpawn = { x: 10 * 16, y: 9 * 16 };
  map.enemies = [];
  return map;
}
