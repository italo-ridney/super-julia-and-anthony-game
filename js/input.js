const held = new Set();
const pressed = new Set();

const BIND = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  down: ['ArrowDown', 'KeyS'],
  jump: ['Space', 'KeyZ', 'KeyW', 'ArrowUp'],
  run: ['ShiftLeft', 'ShiftRight', 'KeyX'],
  special: ['KeyC', 'KeyK'],
  confirm: ['Enter'],
  pause: ['Escape', 'KeyP'],
};

export const input = {
  attach(target) {
    target.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (!held.has(e.code)) pressed.add(e.code);
      held.add(e.code);
    });
    target.addEventListener('keyup', (e) => {
      held.delete(e.code);
    });
  },
  clearPressed() {
    pressed.clear();
  },
  isDown(action) {
    const codes = BIND[action];
    return codes?.some((c) => held.has(c)) ?? false;
  },
  justPressed(action) {
    const codes = BIND[action];
    return codes?.some((c) => pressed.has(c)) ?? false;
  },
};
