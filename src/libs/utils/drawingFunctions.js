const PIXEL_SIZE = 20;

export function renderFrame({ frame, ctx, backgroundColor = "#ffffff" }) {
  ctx.clearRect(0, 0, 800, 800);
  for (let [y, row] of frame.entries()) {
    for (let [x, color] of row.entries()) {
      ctx.fillStyle = color === "transparent" ? backgroundColor : color;
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }
}

export function frameArrayToCanvas({ frame, backgroundColor }) {
  const canvas = document.createElement("canvas");
  canvas.height = frame.length * PIXEL_SIZE;
  canvas.width = frame[0].length * PIXEL_SIZE;
  const ctx = canvas.getContext("2d");
  renderFrame({ frame, ctx, backgroundColor });
  return canvas;
}
