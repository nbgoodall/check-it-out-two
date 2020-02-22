import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import GIF from "gif.js.optimized";

function Display({
  isMouseDown,
  display: displayTop,
  handleClick,
  className,
  active,
  isRecording,
  setIsRecording,
  frames
}) {
  const [canvases, setCanvases] = useState([]);
  const [display, setDisplay] = useState(displayTop);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayRef = useRef(null);

  useEffect(() => {
    setDisplay(displayTop);
  }, [displayTop]);

  useEffect(() => {
    if (isRecording) {
      setDisplay(frames[currentIndex]);
    }
  }, [isRecording, frames, currentIndex]);

  useEffect(() => {
    if (isRecording) {
      captureFrameAsCanvas();
    }
  }, [display, isRecording]);

  async function captureFrameAsCanvas() {
    const canvas = await html2canvas(displayRef.current);
    setCanvases([...canvases, canvas]);
    if (currentIndex < frames.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  }
  useEffect(() => {
    if (isFinished) {
      getImage();
      setIsFinished(false);
      setIsRecording(false);
      setCanvases([]);
      setCurrentIndex(0);
    }
  }, [isFinished]);

  async function getImage() {
    var gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvases[0].width,
      height: canvases[0].height
    });
    canvases.forEach((canvas, i) => {
      gif.addFrame(canvas);
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

  function handleMouseEvent(x, y) {
    active && handleClick(x, y);
  }
  return (
    <div className={className} ref={displayRef}>
      {display.map((row, y) => (
        <div key={y} className="row">
          {row.map((color, x) => (
            <div
              key={x + color}
              className="pixel"
              style={{ "--color": color }}
              onMouseOver={() => isMouseDown && handleMouseEvent(x, y)}
              onClick={() => handleMouseEvent(x, y)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Display;
