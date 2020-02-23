import React, { useState } from "react";

import Display from "../Display";
import css from "./FrameButton.module.css";

function FrameButton({ setCurrentFrameIndex, i, currentFrameIndex, frame }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      key={i}
      className={css.button}
      onClick={() => setCurrentFrameIndex(i)}
      style={{
        "--color": currentFrameIndex === i ? "#5bff25ad" : ""
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && <Display display={frame} className={css.frameDisplay} />}
    </button>
  );
}
export default FrameButton;
