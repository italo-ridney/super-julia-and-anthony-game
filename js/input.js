const held = new Set();
const pressed = new Set();

const BIND = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  jump: ['Space', 'KeyZ', 'KeyW', 'ArrowUp'],
  run: ['ShiftLeft', 'ShiftRight', 'KeyX'],
  special: ['KeyC', 'KeyK'],
  confirm: ['Enter'],
  pause: ['Escape', 'KeyP'],
};

function actionForCode(code) {
  for (const [action, codes] of Object.entries(BIND)) {
    if (codes.includes(code)) return action;
  }
  return null;
}

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
    return codes.some((c) => held.has(c));
  },
  justPressed(action) {
    const codes = BIND[action];
    return codes.some((c) => pressed.has(c));
  },
};
