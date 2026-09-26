import { makeMap, fillRect, put, addEnemy } from './build.js';

function col(map, x, y0, y1, id = 1) {
  for (let y = y0; y <= y1; y++) put(map, x, y, id);
}

export function buildLevel4() {
  const map = makeMap(210, 'mountain', 'Trilha da Montanha');
  for (let x = 0; x <= 19; x++) col(map, x, 13, 13);
  for (let x = 20; x <= 27; x++) col(map, x, 12, 13);
  for (let x = 28; x <= 35; x++) col(map, x, 11, 13);
  for (let x = 36; x <= 47; x++) col(map, x, 10, 13);
  for (let x = 48; x <= 53; x++) put(map, x, 13, 9);
  for (let x = 54; x <= 79; x++) col(map, x, 12, 13);
  for (let x = 80; x <= 85; x++) put(map, x, 13, 9);
  for (let x = 86; x <= 119; x++) col(map, x, 13, 13);
  fillRect(map, 100, 8, 6, 1, 7);
  for (let x = 120; x <= 127; x++) col(map, x, 12, 13);
  for (let x = 128; x <= 139; x++) col(map, x, 13, 13);
  for (let x = 140; x <= 147; x++) put(map, x, 13, 9);
  for (let x = 148; x <= 209; x++) col(map, x, 13, 13);
  fillRect(map, 160, 9, 4, 1, 2);
  put(map, 162, 8, 4);
  put(map, 163, 8, 3);
  put(map, 70, 12, 10);
  put(map, 110, 12, 10);
  put(map, 175, 12, 10);
  addEnemy(map, 'walker', 24, 11);
  addEnemy(map, 'walker', 60, 11);
  addEnemy(map, 'walker', 100, 12);
  addEnemy(map, 'walker', 155, 12);
  addEnemy(map, 'walker', 190, 12);
  addEnemy(map, 'sheller', 88, 12);
  addEnemy(map, 'sheller', 170, 12);
  addEnemy(map, 'flyer', 75, 6);
  addEnemy(map, 'flyer', 145, 6);
  map.spawn = { x: 3 * 16, y: 11 * 16 };
  put(map, 206, 11, 11);
  put(map, 206, 12, 11);
  return map;
}
