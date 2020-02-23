import React from "react";

import css from "./FrameButtons.module.css";
import FrameButton from "../FrameButton";

function FrameButtons({ images, setCurrentFrameIndex, currentFrameIndex }) {
  return (
    <div className={css.buttonContainer}>
      {images.map((image, i) => (
        <FrameButton
          key={i}
          image={image}
          i={i}
          setCurrentFrameIndex={setCurrentFrameIndex}
          currentFrameIndex={currentFrameIndex}
        />
      ))}
    </div>
  );
}

export default FrameButtons;
