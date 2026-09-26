import { P } from './palette.js';
import { VIEW_W, VIEW_H } from '../config.js';
import { drawPortrait } from './portraits.js';

const CX = VIEW_W / 2;
const CY = VIEW_H / 2 + 18;
const FOV = 220;

function project(x, y, z) {
  const s = FOV / (z + 0.001);
  return { x: CX + x * s, y: CY - y * s, s };
}

function drawQuad(ctx, pts, fill, stroke) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function starfield(ctx, tick) {
  const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  grad.addColorStop(0, '#080820');
  grad.addColorStop(0.45, '#1a2868');
  grad.addColorStop(1, '#3a58a8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (let i = 0; i < 48; i++) {
    const sx = (i * 37 + tick * 0.2) % VIEW_W;
    const sy = (i * 53) % (VIEW_H - 40);
    ctx.fillStyle = i % 7 === 0 ? P.gold : P.w;
    ctx.fillRect(sx, sy, 1, 1);
  }
}

function drawFloor(ctx) {
  for (let row = 0; row < 8; row++) {
    const z0 = 40 + row * 28;
    const z1 = z0 + 28;
    const w0 = 1.6 + row * 0.35;
    const c = row % 2 === 0 ? '#2848a0' : '#1c3278';
    const p0l = project(-w0, -0.35, z0);
    const p0r = project(w0, -0.35, z0);
    const p1r = project(w0, -0.35, z1);
    const p1l = project(-w0, -0.35, z1);
    drawQuad(ctx, [p0l, p0r, p1r, p1l], c, '#101030');
  }
}

function drawPedestal(ctx, wx, wz, active) {
  const h = 0.55;
  const hw = 0.22;
  const faces = [
    { ax: -hw, az: -hw, bx: hw, bz: -hw, shade: active ? '#5080e0' : '#304878' },
    { ax: hw, az: -hw, bx: hw, bz: hw, shade: active ? '#3868c8' : '#283858' },
    { ax: hw, az: hw, bx: -hw, bz: hw, shade: active ? '#2850a8' : '#202848' },
    { ax: -hw, az: hw, bx: -hw, bz: -hw, shade: active ? '#6090f0' : '#384888' },
  ];
  for (const f of faces) {
    const p1 = project(wx + f.ax, 0, wz + f.az);
    const p2 = project(wx + f.bx, 0, wz + f.bz);
    const p3 = project(wx + f.bx, h, wz + f.bz);
    const p4 = project(wx + f.ax, h, wz + f.az);
    drawQuad(ctx, [p1, p2, p3, p4], f.shade, P.k);
  }
  const top = [
    project(wx - hw, h, wz - hw),
    project(wx + hw, h, wz - hw),
    project(wx + hw, h, wz + hw),
    project(wx - hw, h, wz + hw),
  ];
  drawQuad(ctx, top, active ? P.gold : '#888898', P.k);
}

export function drawSelectMenu3D(ctx, heroes, selected, tick) {
  starfield(ctx, tick);
  drawFloor(ctx);
  heroes.forEach((hero, i) => {
    const active = i === selected;
    const wx = (i - (heroes.length - 1) / 2) * 1.05;
    const wz = 72 + Math.sin(tick / 35 + i) * 3;
    drawPedestal(ctx, wx, wz, active);
    const bob = Math.sin(tick / 14 + i) * 0.06;
    const pr = project(wx, 0.95 + bob, wz);
    const scale = Math.max(1, Math.floor(pr.s * 0.11));
    const pw = 32 * scale;
    const ph = 28 * scale;
    ctx.save();
    ctx.translate(pr.x, pr.y - ph * 0.55);
    if (active) {
      ctx.shadowColor = P.gold;
      ctx.shadowBlur = 8;
    }
    drawPortrait(ctx, hero.id, -pw / 2, 0, scale, false);
    ctx.restore();
    const ppr = project(wx + 0.38, 0.8, wz + 0.12);
    const pscale = Math.max(1, Math.floor(ppr.s * 0.055));
    drawPortrait(ctx, hero.partnerId, ppr.x - 16 * pscale, ppr.y - 20 * pscale, pscale, i === 1);
  });
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, VIEW_H - 28, VIEW_W, 28);
  ctx.font = '8px monospace';
  ctx.fillStyle = P.w;
  ctx.textAlign = 'center';
  ctx.fillText('← → PERSONAGEM    ENTER JOGAR', CX, VIEW_H - 10);
  ctx.textAlign = 'left';
}
