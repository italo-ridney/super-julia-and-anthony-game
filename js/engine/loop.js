import { DT } from '../config.js';

export function start(update, draw, ctx) {
  let acc = 0;
  let last = performance.now();

  function frame(now) {
    const elapsed = Math.min((now - last) / 1000, 0.1);
    last = now;
    acc += elapsed;
    let steps = 0;
    while (acc >= DT && steps < 5) {
      update(DT);
      acc -= DT;
      steps++;
    }
    draw(ctx);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
