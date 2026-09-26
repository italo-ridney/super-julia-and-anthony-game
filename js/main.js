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

const bootHint = document.getElementById('boot-hint');

function showBootError(msg) {
  if (!bootHint) return;
  bootHint.textContent = msg;
  bootHint.classList.add('boot-error');
  bootHint.classList.remove('boot-ok');
}

if (window.location.protocol === 'file:') {
  showBootError(
    'O jogo não funciona abrindo o arquivo HTML direto.\n\nNo terminal, na pasta do projeto:\n  python3 -m http.server 8080\n\nDepois abra: http://localhost:8080',
  );
} else {
  try {
    const canvas = document.getElementById('game');
    if (!canvas) throw new Error('Canvas #game não encontrado.');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Não foi possível criar o contexto 2D do canvas.');
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

    if (bootHint) {
      bootHint.textContent = 'Clique na tela ou pressione uma tecla para ativar o som.';
      bootHint.classList.add('boot-ok');
    }
  } catch (err) {
    console.error(err);
    showBootError(`Erro ao iniciar o jogo:\n${err?.message ?? err}\n\nVeja o Console (F12) para detalhes.`);
  }
}

window.addEventListener('error', (e) => {
  showBootError(`Erro: ${e.message}\nArquivo: ${e.filename ?? ''}:${e.lineno ?? ''}`);
});
