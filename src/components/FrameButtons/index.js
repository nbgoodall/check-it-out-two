import React, { useState } from "react";

import css from "./FrameButtons.module.css";
import FrameButton from "../FrameButton";

function FrameButtons({ images, setCurrentFrameIndex, currentFrameIndex, reorder }) {
  const [dragIndex, setDragIndex] = useState(null)

  return (
    <div className={css.buttonContainer}>
      {images.map((image, i) => (
        <FrameButton
          reorder={ reorder }
          key={i}
          image={image}
          i={i}
          setDragIndex={setDragIndex}
          dragIndex={dragIndex}
          setCurrentFrameIndex={setCurrentFrameIndex}
          currentFrameIndex={currentFrameIndex}
        />
      ))}
    </div>
  );
}

export default FrameButtons;
