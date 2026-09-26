import { start } from './engine/loop.js';
import { input } from './input.js';
import { audio } from './audio.js';
import * as title from './scenes/title.js';
import * as select from './scenes/select.js';
import * as play from './scenes/play.js';
import * as result from './scenes/result.js';

const scenes = { title, select, play, result };
let activeScene = 'title';

const game = {
  resultKind: null,
  characterId: 'julia',
  levelIndex: 0,
  lives: 3,
  coins: 0,
  score: 0,
  time: 400,
  inBoss: false,
};

Object.defineProperty(game, 'scene', {
  get() {
    return activeScene;
  },
  set(name) {
    if (name === activeScene) return;
    scenes[activeScene]?.exit?.();
    activeScene = name;
    scenes[activeScene]?.enter?.(game);
  },
});

play.setRouter((scene, kind) => {
  game.resultKind = kind;
  game.scene = scene;
});

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

input.attach(window);
audio.hookFirstGesture();
scenes.title.enter(game);

start(
  () => {
    scenes[activeScene].update(game);
    input.clearPressed();
  },
  (c) => {
    c.clearRect(0, 0, 256, 224);
    scenes[activeScene].draw(game, c);
  },
  ctx,
);
