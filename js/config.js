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
/** Valores calibrados para sensação próxima ao Super Mario World */
export const SNES_MOVE = {
  GRAVITY: 0.42,
  MAX_FALL: 7,
  WALK_MAX: 1.52,
  RUN_MAX: 2.72,
  GROUND_ACCEL: 0.102,
  RUN_ACCEL: 0.148,
  AIR_ACCEL_MUL: 0.42,
  GROUND_FRICTION: 0.092,
  SKID_DECEL: 0.26,
  SKID_THRESHOLD: 1.15,
  JUMP_V: -6.65,
  JUMP_CUT: 0.38,
  JUMP_HOLD_GRAVITY_MUL: 0.42,
  JUMP_HOLD_MAX_FRAMES: 30,
  COYOTE: 6,
  JUMP_BUF: 8,
  STOMP_BOUNCE: -4.25,
  CROUCH_SPEED_MUL: 0.35,
  BUMP_VY: -2.2,
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
    jumpMul: 1.12,
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
