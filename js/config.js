export const TILE = 16;
export const VIEW_W = 256;
export const VIEW_H = 224;
export const SCALE = 3;
export const DT = 1 / 60;

/** Física base (inimigos / itens) */
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

/**
 * Parâmetros inspirados no game feel do Super Mario World (SNES).
 * Usados por js/entities/playerMovement.js
 */
export const SNES_MOVE = {
  GRAVITY: 0.38,
  MAX_FALL: 6.5,
  WALK_MAX: 1.45,
  RUN_MAX: 2.55,
  GROUND_ACCEL: 0.095,
  RUN_ACCEL: 0.135,
  AIR_ACCEL_MUL: 0.48,
  GROUND_FRICTION: 0.088,
  SKID_DECEL: 0.22,
  SKID_THRESHOLD: 1.05,
  JUMP_V: -6.35,
  JUMP_CUT: 0.42,
  /** Gravidade reduzida enquanto segura pulo (subida) */
  JUMP_HOLD_GRAVITY_MUL: 0.5,
  JUMP_HOLD_MAX_FRAMES: 26,
  COYOTE: 6,
  JUMP_BUF: 8,
  STOMP_BOUNCE: -4.0,
};

/** Estados de poder (small → super → fire) */
export const POWER = {
  SMALL: 'small',
  SUPER: 'super',
  FIRE: 'fire',
};

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
