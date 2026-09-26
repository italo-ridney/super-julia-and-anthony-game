/**
 * Sprites de personagens — arte original 16×24 / 16×16, contorno preto estilo SNES.
 */

function pad16(rows) {
  while (rows.length < 16) rows.push('................');
  return rows.map((r) => (r.length >= 16 ? r.slice(0, 16) : r + '.'.repeat(16 - r.length)));
}

function pad24(rows) {
  while (rows.length < 24) rows.push('................');
  return rows.map((r) => (r.length >= 16 ? r.slice(0, 16) : r + '.'.repeat(16 - r.length)));
}

export function walkLegs(base, phase) {
  const g = base.slice();
  if (phase === 0) {
    g[12] = '.kbbb.....bbbbk.';
    g[13] = '.kbr.......kbrk.';
    g[14] = '..kk.........kk.';
  } else {
    g[12] = '.kbbbk.....bbbk.';
    g[13] = '.kbrk.......kbr.';
    g[14] = '...kk.......kk..';
  }
  return g;
}

export function jumpLegsPose(base) {
  const g = base.slice();
  g[12] = '.kbbk.....kbbbk.';
  g[13] = '.kbr.......kbrk.';
  g[14] = '..kk.........kk.';
  return g;
}

/** @deprecated use walkLegs */
export function shiftLegs(base, _l, _r) {
  return walkLegs(base, 0);
}

export const anthonySuper = pad24([
  '................',
  '....kkkkkkkk....',
  '.kkrrrrrrrrrrkk.',
  'krrrrrrrrrrrrrrk',
  'krrrdsssssdrdrrk',
  '.kssssssssssssk.',
  '.ksekksskkkesk...',
  '.kssskkkksssssk.',
  'kbbbbbbbbbbbbbbk',
  'kbbbbrbbbbrbbbbk',
  'kbbbbbbbbbbbbbbk',
  '.kbbbbbbbbbbbbk.',
  '.kbbb.....bbbbk.',
  '.kbr.......kbrk.',
  '.kk.........kk..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const anthonySmall = pad16([
  '................',
  '...kkkkkkkkk....',
  '.krrrrrrrrrrrk..',
  'krrdsssssdrdrrk.',
  '.ksssssssssssk..',
  '.ksekkkkkesk....',
  'kbbbbbbbbbbbbbk.',
  'kbbbbrbbbbrbbbbk',
  '.kbbb.....bbbbk.',
  '.kbr.......kbrk.',
  '..kk.........kk.',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const marioSuper = pad24([
  '................',
  '....kkkkkkkk....',
  '.kkrrrrrrrrrrkk.',
  'krrrrrrrrrrrrrrk',
  'krrrdsssssdrdrrk',
  '.kssssssssssssk.',
  '.ksekksskkkesk...',
  '.kssbrbrbrssssk.',
  'kbbbbbbbbbbbbbbk',
  'kbbbgbbbbbgbbbbk',
  'kbbbbbbbbbbbbbbk',
  '.kbbbbbbbbbbbbk.',
  '.kbbb.....bbbbk.',
  '.kbr.......kbrk.',
  '.kk.........kk..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const juliaSuper = pad24([
  '................',
  '...kgggggggk....',
  '.kkghhhhhhhgkk..',
  '.khhhhhhhhhhhkk.',
  '..khhhhhhhhhk...',
  '..ksssssssssk...',
  '..ksekkkkkesk...',
  '.kpppppppppppk..',
  'kppppppppppppppk',
  'kppppkppppkppppk',
  'kppppppppppppppk',
  '.kppppppppppppk.',
  '.kppk.....kpppk.',
  '.kpd......kpdpk.',
  '..kk.......kk...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const juliaSmall = pad16([
  '................',
  '..kgggggggk.....',
  '.khhhhhhhhhk....',
  '..kssssssssk....',
  '..ksekkkkkesk...',
  'kpppppppppppppk.',
  'kppppkppppkppppk',
  '.kppk.....kpppk.',
  '.kpd......kpdpk.',
  '..kk.......kk...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const rosalinaSuper = pad24([
  '................',
  '..kwkgkkkwkgk...',
  '.kkghhhhhhhgkk..',
  '.khhhhhhhhhhhkk.',
  '..khhhhhhhhhk...',
  '..ksssssssssk...',
  '..ksekkkkkesk...',
  '.kccccccccccck..',
  'kcccccccccccccck',
  'kcccwccccwccccck',
  'kcccccccccccccck',
  '.kcccccccccccck.',
  '.kcck.....kccck.',
  '.kcd......kcdck.',
  '..kk.......kk...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const goombaIdle = pad16([
  '................',
  '....kkkkkkkk....',
  '..kbrbrbrbrbrk..',
  '.kbrssssssssbrk.',
  'kbrssekkkessbrk.',
  'kbrssssssssssbrk',
  '.kbrbrbrbrbrbrk.',
  '..kbr.....kbr...',
  '..kbr.....kbr...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const goombaWalk = pad16([
  '................',
  '....kkkkkkkk....',
  '..kbrbrbrbrbrk..',
  '.kbrssssssssbrk.',
  'kbrssekkkessbrk.',
  'kbrssssssssssbrk',
  '.kbrbrbrbrbrbrk.',
  '..kbr...kbr.....',
  '.....kbr...kbr..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const koopaWalk = pad16([
  '................',
  '....kkkkkkkk....',
  '..kgngngngngnk..',
  '.kgngnssssngnk..',
  '.kgnssseessgnk..',
  '..kgnssssssgnk..',
  '..kgngngngngnk..',
  '..kgn.....gnk...',
  '..kgn.....gnk...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const koopaShell = pad16([
  '................',
  '................',
  '..kkkkkkkkkkkk..',
  '.kgngngngngngnk.',
  'kgngngngngngngnk',
  'kgngngngngngngnk',
  '.kgngngngngngnk.',
  '..kkkkkkkkkkkk..',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const flyerIdle = pad16([
  '................',
  '..kwwwwwwwwwwk..',
  '.kwwgrgrgrgrwwk.',
  '..kgrgrgrgrgrk..',
  '...kgrgrgrgrk...',
  '....kgrgrgrk....',
  '.....kgrgrk.....',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);

export const flyerFlap = pad16([
  '................',
  '.kwwwwwwwwwwwwk.',
  'kwwgrgrgrgrgrwwk',
  '.kgrgrgrgrgrgrk.',
  '..kgrgrgrgrgrk..',
  '...kgrgrgrgrk...',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
]);
