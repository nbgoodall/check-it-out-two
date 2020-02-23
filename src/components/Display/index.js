import React, { useEffect, useRef } from "react";

const PIXEL_SIZE = 20

const pixelPosition = pos =>
  Math.max(0, Math.floor(pos / PIXEL_SIZE))

let ctx;

function Display({ display, handleClick, className, saveImage }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    ctx = canvasRef.current.getContext('2d')

    ctx.scale(2, 2)

    render()
  }, [])

  function handleMouseEvent(evt) {
    const rect = canvasRef.current.getBoundingClientRect()

    const x = pixelPosition(evt.clientX - rect.left),
          y = pixelPosition(evt.clientY - rect.top )

    return handleClick(x, y)
  }

  useEffect(() => {
    render()
  }, [display])

  function render() {
    if (!display) return null

    ctx.clearRect(0, 0, 800, 800)

    for (let [y, row] of display.entries()) {
      for (let [x, color] of row.entries()) {
        ctx.fillStyle = color
        ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
      }
    }
  }

  return (
    <div className={className}>
      <canvas
        ref={ canvasRef }
        width={ 800 }
        height={ 800 }
        style={{ width: '400px', height: '400px', display: 'block' }}
        onMouseDown={ evt => handleMouseEvent(evt) }
        onMouseUp={ () => saveImage(canvasRef.current.toDataURL()) }
        onMouseMove={ evt => evt.buttons === 1 && handleMouseEvent(evt) }
      />
    </div>
  )

  return (
    <div className={className}>
      {display.map((row, y) => (
        <div key={y} className="row">
          {row.map((color, x) => (
            <div
              key={x + color}
              className="pixel"
              style={{ "--color": color }}
              // onMouseEnter={ evt => isMouseDown && handleMouseEvent(evt) }
              onMouseDown={ handleMouseEvent }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Display;
