import html2canvas from "html2canvas";
import GIF from "gif.js.optimized";

import useEpicState from "./useEpicState";

function useGifRenderer() {
  const [state, setState] = useEpicState({
    status: "inactive",
    isRendering: false
  });

  async function createGif(canvases, frameRate) {
    if (!canvases.length) return;
    setState({ status: "creating gif" });

    var gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvases[0].width,
      height: canvases[0].height
    });

    canvases.forEach(img => {
      console.log(gif.addFrame(img, { delay: frameRate }));
    });

    gif.on("finished", function(blob) {
      setState({ status: "downloading" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "myGif.gif";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setState({ status: "inactive", isRendering: false });
    });
    gif.render();
  }

  async function render(frameImages, frameRate) {
    setState({ status: "creating images", isRendering: true });
    const images = await Promise.all(
      frameImages.map(frameImage => {
        return new Promise((resolve, reject) => {
          const img = document.createElement("img");
          img.src = frameImage;
          img.onload = function() {
            resolve(this);
          };
          img.onerror = function() {
            reject("error loading image");
          };
        });
      })
    );
    createGif(images, frameRate);
  }
  return { ...state, render };
}

export default useGifRenderer;
