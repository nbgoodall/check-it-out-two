import React, { useEffect, useRef, useState } from "react";
import useEpicState from "../../libs/hooks/useEpicState";

const PIXEL_SIZE = 20;

const pixelPosition = pos => Math.max(0, Math.floor(pos / PIXEL_SIZE));

let ctx;

function Display({ display, handleClick, className, saveImage, handleFill }) {
  const canvasRef = useRef(null);
  const [state, setState] = useEpicState({
    mouseStart: {},
    fillSize: {},
    isDrawingBox: false
  });

  const { mouseStart, fillSize, isDrawingBox } = state;

  useEffect(() => {
    ctx = canvasRef.current.getContext("2d");

    ctx.scale(2, 2);

    render();
  }, []);

  function handleMouseEvent({ evt, start }) {
    const { clientX, clientY, shiftKey } = evt;
    const rect = canvasRef.current.getBoundingClientRect();

    const x = pixelPosition(clientX - rect.left),
      y = pixelPosition(clientY - rect.top);

    if (shiftKey || isDrawingBox) {
      return handleFillSizeAndPosition({ start, x, y });
    }

    return handleClick(x, y);
  }

  function handleFillSizeAndPosition({ start, x, y }) {
    if (start) {
      return setState({
        mouseStart: { x, y },
        fillSize: { width: 1, height: 1 },
        isDrawingBox: true
      });
    }

    const width = Math.abs(x - mouseStart.x) + 1,
      height = Math.abs(y - mouseStart.y) + 1;

    if (width > fillSize.width || height > fillSize.height) {
      setState({ fillSize: { width, height } });
      return handleFill({
        width,
        height,
        x: Math.min(x, mouseStart.x),
        y: Math.min(y, mouseStart.y)
      });
    }
  }

  useEffect(() => {
    render();
  }, [display]);

  function render() {
    if (!display) return null;

    ctx.clearRect(0, 0, 800, 800);

    for (let [y, row] of display.entries()) {
      for (let [x, color] of row.entries()) {
        ctx.fillStyle = color;
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        style={{ width: "400px", height: "400px", display: "block" }}
        onMouseDown={evt => handleMouseEvent({ evt, start: true })}
        onMouseUp={() => {
          setState({ isDrawingBox: false });
          saveImage(canvasRef.current.toDataURL());
        }}
        onMouseMove={evt => evt.buttons === 1 && handleMouseEvent({ evt })}
      />
    </div>
  );
}

export default Display;
