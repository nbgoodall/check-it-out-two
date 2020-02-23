import React, { useEffect } from "react";

import "./App.css";
import Display from "../Display";
import FrameButtons from "../FrameButtons";
import useGifRenderer from "../../libs/hooks/useGifRenderer";
import useEpicState from "../../libs/hooks/useEpicState";

import loadingGif from "../../assets/loading.gif";

const BLANK_DISPLAY = new Array(20).fill(new Array(20).fill("transparent"));

function App() {
  const [state, setState] = useEpicState({
    isMouseDown: false,
    isAnimating: false,
    currentFrameIndex: 0,
    selectionColor: "#000000",
    color: "#000000",
    frames: [BLANK_DISPLAY],
    frameRate: 100
  });

  const {
    isMouseDown,
    isAnimating,
    currentFrameIndex,
    selectionColor,
    color,
    frames,
    frameRate
  } = state;


  const { status, isRendering, render } = useGifRenderer();

  useEffect(() => {
    console.log({ status, isRendering });
  }, [status]);

  function setCurrentFrame(frame) {
    return setState({
      frames: [
        ...frames.slice(0, currentFrameIndex),
        frame,
        ...frames.slice(currentFrameIndex + 1)
      ]
    })
  }

  function handleClick(x, y) {
    const display = frames[currentFrameIndex]

    let newColor = display[y][x] === color ? "transparent" : color;

    if (isMouseDown && !selectionColor) {
      setState({ selectionColor: newColor });
    }

    const nextDisplay = [
      ...display.slice(0, y),
      [
        ...display[y].slice(0, x),
        selectionColor || newColor,
        ...display[y].slice(x + 1)
      ],
      ...display.slice(y + 1)
    ]

    return setCurrentFrame(nextDisplay)
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

  function addFrame() {
    setState({
      frames: [...frames, BLANK_DISPLAY],
      currentFrameIndex: frames.length
    });
  }

  function duplicateFrame() {
    setState({
      frames: [...frames, frames[currentFrameIndex]],
      currentFrameIndex: currentFrameIndex + 1
    });
  }

  function confirmReset() {
    let confirmText = "Are you sure? This will reset e-v-e-r-y-t-h-i-n-g."

    if (window.confirm(confirmText)) {
      setState({
        frames: [BLANK_DISPLAY],
        currentFrameIndex: 0
      })
    }
  }

  function clear() {
    setCurrentFrame(BLANK_DISPLAY)
  }

  return (
    <div
      className="App"
      onMouseDown={() => setState({ isMouseDown: true })}
      onMouseUp={() => setState({ isMouseDown: false, selectionColor: null })}
    >
      <dialog className="loading-dialog" open={isRendering}>
        <img alt="loading" src={loadingGif} />
        <h1>{status}</h1>
      </dialog>
      <div className="display-container">
        {!isAnimating && frames.length > 1 && currentFrameIndex > 0 && (
          <Display
            className="onion-container"
            display={frames[currentFrameIndex - 1]}
          />
        )}
        <Display
          className="active-container"
          display={frames[currentFrameIndex]}
          color={color}
          isMouseDown={isMouseDown}
          handleClick={handleClick}
          active={true}
        />
      </div>
      <FrameButtons
        frames={frames}
        setCurrentFrameIndex={index => setState({ currentFrameIndex: index })}
        currentFrameIndex={currentFrameIndex}
      />
      <div>
        <button onClick={addFrame}>Add Frame</button>
        <button onClick={duplicateFrame}>Duplicate</button>
        <input
          type="color"
          value={color}
          onChange={e => setState({ color: e.target.value })}
        ></input>
        <button onClick={() => setState({ isAnimating: !isAnimating })}>
          {isAnimating ? "Stop" : "Play"}
        </button>
        <button onClick={clear}>Clear</button>
        <button onClick={confirmReset}>Reset</button>
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
