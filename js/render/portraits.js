import { P } from './palette.js';
import { blit } from './blit.js';

const map = { k: P.k, w: P.w, s: P.skin, h: P.hair, p: P.pink, pd: P.pinkD, b: P.blue, bd: P.blueD, r: P.red, rd: P.redD, c: P.cyan, cd: P.cyanD, g: P.gold, br: P.brown };

function pad32(rows) {
  while (rows.length < 40) rows.push('.'.repeat(32));
  return rows.map((r) => (r.length >= 32 ? r.slice(0, 32) : r + '.'.repeat(32 - r.length)));
}

const PORTRAITS = {
  julia: pad32(['..........gggg..................','........gggggggg................','.......gggghhhggg...............','......ggghhhhhggg...............','......gghhhhhhgg................','.......gssssssg.................','......gssssssssg................','.....gppppppppppg...............','....gppppppppppppg..............','...gppppppppppppppg.............','...gppppppppppppppg.............','...gppppppppppppppg.............','....gppppppppppppg..............','.....gppppppppppg...............','......gppppppppg................','........gppppg..................']),
  anthony: pad32(['..........rrrr..................','........rrrrrrrr................','.......rrrrrrrrr................','......rrrssssrrr................','......rrssssssrr................','.......ssssssss.................','......ssssssssss................','.....sbbbbbbbbbs................','....sbbbbbbbbbbbs...............','...sbbbbbbbbbbbbbs..............','...sbbbbbbbbbbbbbs..............','...sbbbbbbbbbbbbbs..............','....sbbbbbbbbbbbs...............','.....sbbbbbbbbbs................','......sbbbbbbbs.................','........sbbbs...................']),
  rosalina: pad32(['..........gggg..................','........gggggggg................','.......gggghhhggg...............','......ggghhhhhggg...............','......gghhhhhhgg................','.......gssssssg.................','......gssssssssg................','.....gccccccccccg...............','....gccccccccccccg..............','...gccccccccccccccg.............','...gccccccccccccccg.............','...gccccccccccccccg.............','....gccccccccccccg..............','.....gccccccccccg...............','......gccccccccg................','........gccccg..................']),
  mario: pad32(['..........rrrr..................','........rrrrrrrr................','.......rrrrrrrrr................','......rrrssssrrr................','......rrssssssrr................','.......ssssssss.................','......ssssssssss................','.....sbbbbbbbbbs................','....sbbbbbbbbbbbs...............','...sbbbbbbbbbbbbbs..............','...sbbbbbbbbbbbbbs..............','...sbbbbbbbbbbbbbs..............','....sbbbbbbbbbbbs...............','.....sbbbbbbbbbs................','......sbbbbbbbs.................','........sbbbs...................']),
};

export function drawPortrait(ctx, id, x, y, scale = 1, flipX = false) {
  const grid = PORTRAITS[id];
  if (!grid) return;
  if (scale <= 1) {
    blit(ctx, grid, map, Math.floor(x), Math.floor(y), flipX);
    return;
  }
  const h = grid.length;
  const w = grid[0].length;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  for (let row = 0; row < h; row++) {
    const line = grid[row];
    for (let col = 0; col < w; col++) {
      const fc = flipX ? line[w - 1 - col] : line[col];
      if (fc === '.') continue;
      const color = map[fc];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x + col * scale), Math.floor(y + row * scale), scale, scale);
    }
  }
  ctx.restore();
}
