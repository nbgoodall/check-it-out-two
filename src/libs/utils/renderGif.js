import html2canvas from "html2canvas";
import GIF from "gif.js.optimized";

async function createGif(canvases, frameRate) {
  if (!canvases.length) return;
  var gif = new GIF({
    workers: 2,
    quality: 10,
    width: canvases[0].width,
    height: canvases[0].height
  });
  canvases.forEach((canvas, i) => {
    gif.addFrame(canvas, { delay: frameRate });
  });
  gif.on("finished", function(blob) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "myGif.gif";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
  gif.render();
}

async function render(frames, frameRate) {
  const canvases = await Promise.all(
    frames.map((frame, i) => {
      const container = document.createElement("div");
      container.classList.add("App");
      const div = document.createElement("div");
      div.classList.add(`frame${i}`);
      div.classList.add(`active-container`);
      frame.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.forEach(color => {
          const pixel = document.createElement("div");
          pixel.classList.add("pixel");
          pixel.style.backgroundColor = color;
          rowDiv.appendChild(pixel);
        });
        div.appendChild(rowDiv);
      });
      container.appendChild(div);
      document.body.appendChild(container);
      const canvas = html2canvas(document.querySelector(`.frame${i}`));
      document.body.removeChild(container);
      return canvas;
    })
  );
  createGif(canvases, frameRate);
}

export default render;
