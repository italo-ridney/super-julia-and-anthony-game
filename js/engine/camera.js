import { VIEW_W } from '../config.js';

export const camera = { x: 0, y: 0, lock: false };

export function updateCamera(player, map) {
  if (camera.lock) return;
  const center = camera.x + VIEW_W / 2;
  const px = player.x + player.w / 2;
  const dead = 40;
  if (px < center - dead) camera.x = px + dead - VIEW_W / 2;
  if (px > center + dead) camera.x = px - dead - VIEW_W / 2;
  const maxX = Math.max(0, map.pixelW - VIEW_W);
  camera.x = Math.max(0, Math.min(camera.x, maxX));
  camera.y = 0;
}

export function resetCamera() {
  camera.x = 0;
  camera.y = 0;
  camera.lock = false;
}
