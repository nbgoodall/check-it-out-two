import React, { useEffect } from "react";

import "./App.css";
import Display from "../Display";
import FrameButtons from "../FrameButtons";
import render from "../../libs/utils/renderGif";
import useEpicState from "../../libs/hooks/useEpicState";

const initialState = new Array(20).fill(new Array(20).fill("#ffffff"));

function App() {
  const [state, setState] = useEpicState({
    isMouseDown: false,
    isAnimating: false,
    display: initialState,
    currentFrameIndex: 0,
    selectionColor: "#000000",
    color: "#000000",
    frames: [],
    frameRate: 100
  });

  const {
    isMouseDown,
    isAnimating,
    display,
    currentFrameIndex,
    selectionColor,
    color,
    frames,
    frameRate
  } = state;

  function handleClick(x, y) {
    let newColor = display[y][x] === color ? "#FFFFFF" : color;

    if (isMouseDown && !selectionColor) {
      setState({ selectionColor: newColor });
    }

    setState({
      display: [
        ...display.slice(0, y),
        [
          ...display[y].slice(0, x),
          selectionColor || newColor,
          ...display[y].slice(x + 1)
        ],
        ...display.slice(y + 1)
      ]
    });
  }

  useEffect(() => {
    let id;
    if (isAnimating) {
      id = setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setState({ currentFrameIndex: currentFrameIndex + 1 });

          return;
        }
        setState({ currentFrameIndex: 0 });
      }, frameRate);
    }
    return () => {
      clearInterval(id);
    };
  }, [isAnimating, currentFrameIndex, frames, frameRate]);

  useEffect(() => {
    if (frames.length) {
      setState({ display: frames[currentFrameIndex] });
    }
  }, [currentFrameIndex, frames]);

  useEffect(() => {
    setState({ display: initialState });
  }, [frames]);

  function saveFrame() {
    setState({
      frames: [...frames, display],
      currentFrameIndex: currentFrameIndex + 1
    });
  }

  function clear() {
    setState({
      frames: [],
      currentFrameIndex: 0,
      display: initialState
    });
  }

  return (
    <div
      className="App"
      onMouseDown={() => setState({ isMouseDown: true })}
      onMouseUp={() => setState({ isMouseDown: false, selectionColor: null })}
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
        setCurrentFrameIndex={index => setState({ currentFrameIndex: index })}
        currentFrameIndex={currentFrameIndex}
      />
      <div>
        <button onClick={saveFrame}>Add Frame</button>
        <input
          type="color"
          value={color}
          onChange={e => setState({ color: e.target.value })}
        ></input>
        <button onClick={() => setState({ isAnimating: !isAnimating })}>
          {isAnimating ? "Stop" : "Play"}
        </button>
        <button onClick={clear}>CLEAR</button>
        <button onClick={() => render(frames, frameRate)}>Capture</button>
        <input
          type="range"
          value={frameRate}
          min="100"
          max="1000"
          onChange={e => setState({ frameRate: e.target.value })}
        ></input>
      </div>
    </div>
  );
}

export default App;
