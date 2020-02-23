import React from "react";

import css from "./FrameButtons.module.css";
import FrameButton from "../FrameButton";

function FrameButtons({ frames, setCurrentFrameIndex, currentFrameIndex }) {
  const rows = frames.length && frames[0].length;
  const columns = frames.length && frames[0][0].length;

  return (
    <div
      className={css.buttonContainer}
      style={{ "--rows": rows, "--columns": columns }}
    >
      {frames.map((frame, i) => (
        <FrameButton
          key={`${frame}${i}`}
          frame={frame}
          i={i}
          setCurrentFrameIndex={setCurrentFrameIndex}
          currentFrameIndex={currentFrameIndex}
        />
      ))}
    </div>
  );
}

export default FrameButtons;
