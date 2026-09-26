export function blit(ctx, grid, map, x, y, flipX = false) {
  const h = grid.length;
  const w = grid[0].length;
  for (let row = 0; row < h; row++) {
    const line = grid[row];
    for (let col = 0; col < w; col++) {
      const fc = flipX ? line[w - 1 - col] : line[col];
      if (fc === '.') continue;
      const color = map[fc];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x + col), Math.floor(y + row), 1, 1);
    }
  }
}
