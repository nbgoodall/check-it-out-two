import React, { useState, useEffect } from "react";

import "./App.css";
import Display from "../Display";
import FrameButtons from "../FrameButtons";

const initialState = new Array(20).fill(new Array(20).fill("#ffffff"));

function App() {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
    if (isAnimating && !isRecording) {
      id = setTimeout(() => {
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
  }, [isAnimating, currentFrameIndex, frames, isRecording]);

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
  }

  function clear() {
    setFrames([]);
    setCurrentFrameIndex(0);
    setDisplay(initialState);
  }
  function startRecording() {
    if (frames.length) {
      setIsRecording(true);
    }
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
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          frames={frames}
        />
        {!isAnimating && !isRecording && frames.length > 0 && (
          <Display
            className={"onion-container"}
            display={frames[frames.length - 1]}
          />
        )}
      </div>
      <FrameButtons
        frames={frames}
        setCurrentFrameIndex={setCurrentFrameIndex}
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
        <button onClick={startRecording}>Capture</button>
      </div>
    </div>
  );
}

export default App;
