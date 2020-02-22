import React, { useState, useEffect } from "react";
import "./App.css";
import Display from "../Display";

const initialState = new Array(30).fill(new Array(50).fill("#ffffff"));

function App() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [display, setDisplay] = useState(initialState);
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [color, setColor] = useState("#000000");

  function handleClick(x, y) {
    setDisplay([
      ...display.slice(0, y),
      [...display[y].slice(0, x), color, ...display[y].slice(x + 1)],
      ...display.slice(y + 1)
    ]);
  }

  useEffect(() => {
    let id;
    if (isAnimating) {
      setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setCurrentFrameIndex(currentFrameIndex + 1);
          return;
        }
        setCurrentFrameIndex(0);
      }, 100);
    }
    return () => {
      clearInterval(id);
    };
  }, [isAnimating, currentFrameIndex]);

  useEffect(() => {
    if (frames.length) {
      setDisplay(frames[currentFrameIndex]);
    }
  }, [currentFrameIndex]);

  function saveFrame() {
    setFrames([...frames, display]);
    setDisplay(initialState);
  }
  function clear() {
    setFrames([]);
    setCurrentFrameIndex(0);
    setDisplay(initialState);
  }
  return (
    <div
      className="App"
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
    >
      <div className="display-container">
        <Display
          className={"active-container"}
          display={display}
          isMouseDown={isMouseDown}
          color={color}
          handleClick={handleClick}
          active={true}
        />
        {!isAnimating && frames.length > 0 && (
          <Display
            className={"onion-container"}
            display={frames[frames.length - 1]}
          />
        )}
      </div>
      <div>
        {frames.map((_, i) => (
          <button key={i} onClick={() => setCurrentFrameIndex(i)}>
            frame {i + 1}
          </button>
        ))}
        <br />
        <button onClick={saveFrame}>Add Frame</button>
        <input
          type="color"
          value={color}
          onChange={e => setColor(e.target.value)}
        ></input>
        <button onClick={() => setIsAnimating(!isAnimating)}>
          {isAnimating ? "Stop" : "Play"}
        </button>
        <button onClick={clear}>CLEAR</button>
      </div>
    </div>
  );
}

export default App;
