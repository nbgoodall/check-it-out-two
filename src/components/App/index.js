import React, { useEffect } from "react";

import "./App.css";
import Display from "../Display";
import FrameButtons from "../FrameButtons";
import useGifRenderer from "../../libs/hooks/useGifRenderer";
import useEpicState from "../../libs/hooks/useEpicState";
import reorderArray from "../../libs/utils/reorderArray";

import loadingGif from "../../assets/loading.gif";

const BACKGROUND_COLOR = "transparent";

const BLANK_DISPLAY = new Array(20).fill(new Array(20).fill("transparent"));

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

function App() {
  const [state, setState] = useEpicState({
    isMouseDown: false,
    isAnimating: false,
    isOnionOn: true,
    currentFrameIndex: 0,
    selectionColor: "#000000",
    color: "#000000",
    frames: [BLANK_DISPLAY],
    frameImages: [BLANK_IMAGE],
    frameRate: 100
  });

  const {
    isMouseDown,
    isAnimating,
    isOnionOn,
    currentFrameIndex,
    selectionColor,
    color,
    frames,
    frameImages,
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
    });
  }

  function setCurrentFrameImage(image) {
    return setState({
      frameImages: [
        ...frameImages.slice(0, currentFrameIndex),
        image,
        ...frameImages.slice(currentFrameIndex + 1)
      ]
    });
  }

  function handleClick(x, y) {
    const display = frames[currentFrameIndex];

    let newColor = display[y][x] === color ? BACKGROUND_COLOR : color;

    if (!isMouseDown && !selectionColor) {
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
    ];

    return setCurrentFrame(nextDisplay);
  }

  function handleFill({ x, y, width, height }) {
    const nextDisplay = [
      ...frames[currentFrameIndex].slice(0, y),
      ...frames[currentFrameIndex]
        .slice(y, y + height)
        .map(row => [
          ...row.slice(0, x),
          ...row.slice(x, x + width).fill(color),
          ...row.slice(x + width)
        ]),
      ...frames[currentFrameIndex].slice(y + height)
    ];
    return setCurrentFrame(nextDisplay);
  }

  useEffect(() => {
    if (isAnimating) {
      const id = setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setState({ currentFrameIndex: currentFrameIndex + 1 });

          return;
        }
        setState({ currentFrameIndex: 0 });
      }, frameRate);
      return () => {
        clearInterval(id);
      };
    }
  }, [isAnimating, currentFrameIndex, frames, frameRate]);

  function addFrame({ duplicate } = {}) {
    setState({
      frames: [
        ...frames.slice(0, currentFrameIndex + 1),
        duplicate ? frames[currentFrameIndex] : BLANK_DISPLAY,
        ...frames.slice(currentFrameIndex + 1)
      ],
      frameImages: [
        ...frameImages.slice(0, currentFrameIndex + 1),
        duplicate ? frameImages[currentFrameIndex] : BLANK_IMAGE,
        ...frameImages.slice(currentFrameIndex + 1)
      ],
      currentFrameIndex: currentFrameIndex + 1
    });
  }

  function reorderFrames(index, position) {
    let newFrameIndex = currentFrameIndex;

    if (position <= currentFrameIndex && index > currentFrameIndex) {
      newFrameIndex++;
    }

    if (index < currentFrameIndex) {
      newFrameIndex--;
    } else if (index === currentFrameIndex) {
      newFrameIndex = position;
    }

    return setState({
      frames: reorderArray(frames, index, position),
      frameImages: reorderArray(frameImages, index, position),
      currentFrameIndex: newFrameIndex
    });
  }

  function deleteFrame() {
    setState({
      frames: [
        ...frames.slice(0, currentFrameIndex),
        ...frames.slice(currentFrameIndex + 1)
      ],
      frameImages: [
        ...frameImages.slice(0, currentFrameIndex),
        ...frameImages.slice(currentFrameIndex + 1)
      ],
      currentFrameIndex: Math.max(0, currentFrameIndex - 1)
    });
  }

  function confirmReset() {
    let confirmText = "Are you sure? This will reset e-v-e-r-y-t-h-i-n-g.";

    if (window.confirm(confirmText)) {
      setState({
        frames: [BLANK_DISPLAY],
        frameImages: [BLANK_IMAGE],
        currentFrameIndex: 0
      });
    }
  }

  function clear() {
    setCurrentFrame(BLANK_DISPLAY);
    setCurrentFrameImage(BLANK_IMAGE);
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
        {isOnionOn &&
          !isAnimating &&
          frames.length > 1 &&
          currentFrameIndex > 0 && (
            <img
              className="onion-container"
              alt="ghostly previous frame"
              src={frameImages[currentFrameIndex - 1]}
              style={{ width: "400px", height: "400px", opacity: 0.3 }}
            />
          )}

        <Display
          className="active-container"
          display={frames[currentFrameIndex]}
          color={color}
          handleClick={handleClick}
          saveImage={setCurrentFrameImage}
          handleFill={handleFill}
        />
      </div>
      <FrameButtons
        reorder={reorderFrames}
        images={frameImages}
        setCurrentFrameIndex={index => setState({ currentFrameIndex: index })}
        currentFrameIndex={currentFrameIndex}
      />
      <div>
        <button onClick={addFrame}>Add Frame</button>
        <button onClick={frames.length > 1 ? deleteFrame : clear}>
          Delete Frame
        </button>
        <button onClick={() => addFrame({ duplicate: true })}>Duplicate</button>
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
        <button onClick={() => render(frames, frameRate)}>Export to GIF</button>
        <input
          type="range"
          value={frameRate}
          min="100"
          max="1000"
          onChange={e => setState({ frameRate: e.target.value })}
        ></input>
        <button
          onClick={() => setState({ isOnionOn: !isOnionOn })}
          className={isOnionOn ? "onion-button-on" : "onion-button-off"}
        >
          Onion
        </button>
      </div>
    </div>
  );
}

export default App;
