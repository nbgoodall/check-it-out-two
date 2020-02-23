import React, { useState, useEffect } from "react";

import "./App.css";
import Display from "../Display";
import FrameButtons from "../FrameButtons";
import render from "../../libs/utils/renderGif";

const initialState = new Array(20).fill(new Array(30).fill("#ffffff"));

function App() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [display, setDisplay] = useState(initialState);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [color, setColor] = useState("#000000");
  const [frames, setFrames] = useState([]);
  const [frameRate, setFrameRate] = useState(100);

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
      id = setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setCurrentFrameIndex(currentFrameIndex + 1);
          return;
        }
        setCurrentFrameIndex(0);
      }, frameRate);
    }
    return () => {
      clearInterval(id);
    };
  }, [isAnimating, currentFrameIndex, frames, frameRate]);

  useEffect(() => {
    if (frames.length) {
      setDisplay(frames[currentFrameIndex]);
    }
  }, [currentFrameIndex]);

  useEffect(() => {
    setDisplay(initialState);
  }, [frames]);

  function saveFrame() {
    setFrames([...frames, display]);
    setCurrentFrameIndex(currentFrameIndex + 1);
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
          color={color}
          isMouseDown={isMouseDown}
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
      <FrameButtons
        frames={frames}
        setCurrentFrameIndex={setCurrentFrameIndex}
        currentFrameIndex={currentFrameIndex}
      />
      <div>
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
        <button onClick={() => render(frames, frameRate)}>Capture</button>
        <input
          type="range"
          value={frameRate}
          min="100"
          max="1000"
          onChange={e => setFrameRate(e.target.value)}
        ></input>
      </div>
    </div>
  );
}

export default App;
