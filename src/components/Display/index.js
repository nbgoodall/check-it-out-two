import React from "react";

function Display({ isMouseDown, display, handleClick, className, active }) {
  function handleMouseEvent(x, y) {
    active && handleClick(x, y);
  }
  return (
    <div className={className}>
      {display.map((row, y) => (
        <div key={y} className="row">
          {row.map((color, x) => (
            <div
              key={x + color}
              className="pixel"
              style={{ "--color": color }}
              onMouseEnter={ e => isMouseDown && handleMouseEvent(x, y) }
              onMouseDown={() => handleMouseEvent(x, y)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Display;
