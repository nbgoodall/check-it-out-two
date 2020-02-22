import React from "react";

function FrameButtons({ frames, setCurrentFrameIndex }) {
  return (
    <div>
      {frames.map((_, i) => (
        <button key={i} onClick={() => setCurrentFrameIndex(i)}>
          frame {i + 1}
        </button>
      ))}
    </div>
  );
}

export default FrameButtons;
