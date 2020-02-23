import React from "react";

import css from "./FrameButton.module.css";

function FrameButton({ setCurrentFrameIndex, i, currentFrameIndex, image }) {
  return (
    <button
      key={i}
      className={css.button}
      onClick={() => setCurrentFrameIndex(i)}
      style={{
        "--color": currentFrameIndex === i ? "#5bff25ad" : ""
      }}
    >
      <img src={image} className={css.frameDisplay} alt={ `Frame ${ i }` } />
    </button>
  );
}
export default FrameButton;
