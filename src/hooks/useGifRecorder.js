import html2canvas from "html2canvas";
import GIF from "gif.js.optimized";

function useGifRecorder() {
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
      a.download = "test.gif";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
    gif.render();
  }
  async function render(frames, frameRate) {
    const canvases = await Promise.all(
      frames.map((frame, i) => {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        const div = document.createElement("div");
        div.classList.add(`frame${i}`);
        frame.forEach(row => {
          const rowDiv = document.createElement("div");
          rowDiv.style.display = "flex";
          row.forEach(color => {
            const pixel = document.createElement("div");
            pixel.style.height = `20px`;
            pixel.style.width = `20px`;
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

  return render;
}

export default useGifRecorder;
