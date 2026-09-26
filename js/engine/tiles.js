export const T = {
  empty: 0,
  ground: 1,
  brick: 2,
  qCoin: 3,
  qMush: 4,
  pipe: 5,
  used: 6,
  oneWay: 7,
  coin: 8,
  lava: 9,
  spike: 10,
  goal: 11,
  door: 12,
  solidDecor: 13,
};

export function isSolid(id) {
  return id === 1 || id === 2 || id === 3 || id === 4 || id === 5 || id === 6 || id === 13;
}

export function isOneWay(id) {
  return id === 7;
}

export function isHazard(id) {
  return id === 9 || id === 10;
}

export function isGoal(id) {
  return id === 11;
}

export function isDoor(id) {
  return id === 12;
}

export function isCoin(id) {
  return id === 8;
}
