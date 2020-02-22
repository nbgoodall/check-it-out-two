import React from "react";
import css from "./FrameButtons.module.css";

function FrameButtons({ frames, setCurrentFrameIndex, currentFrameIndex }) {
  return (
    <div>
      {frames.map((_, i) => (
        <button
          key={i}
          className={css.button}
          onClick={() => setCurrentFrameIndex(i)}
          style={{ "--color": currentFrameIndex === i ? "yellowgreen" : "" }}
        >
          frame {i + 1}
        </button>
      ))}
    </div>
  );
}

export default FrameButtons;
