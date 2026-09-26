export const TILE = 16;
export const VIEW_W = 256;
export const VIEW_H = 224;
export const SCALE = 3;
export const DT = 1 / 60;
export const GRAVITY = 0.35;
export const MAX_FALL = 6;
export const WALK_ACCEL = 0.08;
export const RUN_ACCEL = 0.12;
export const WALK_MAX = 1.4;
export const RUN_MAX = 2.5;
export const FRICTION = 0.08;
export const JUMP_V = -6.2;
export const JUMP_CUT = 0.45;
export const COYOTE = 6;
export const JUMP_BUF = 8;
export const INVULN = 90;
export const START_LIVES = 3;
export const LEVEL_TIME = 400;
export const PARTNER_CD = 240;

export const CHARACTERS = {
  julia: {
    id: 'julia',
    name: 'Julia Ferreira',
    tag: 'Ginasta · inteligente · educada · amorosa',
    partnerId: 'rosalina',
    partnerName: 'Princesa Rosalina',
    jumpMul: 1.18,
    runMul: 0.92,
    breakBricks: false,
  },
  anthony: {
    id: 'anthony',
    name: 'Anthony Ferreira',
    tag: 'Forte · rápido · inteligente · carinhoso · educado',
    partnerId: 'mario',
    partnerName: 'Mario',
    jumpMul: 1.0,
    runMul: 1.18,
    breakBricks: true,
  },
};
