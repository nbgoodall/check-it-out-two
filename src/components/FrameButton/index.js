import React, { useRef } from "react";

import css from "./FrameButton.module.css";

function FrameButton({ setCurrentFrameIndex, i, currentFrameIndex, image, dragIndex, setDragIndex, reorder }) {
  const frameRef = useRef(null)

  function isLeft(evt) {
    let rect = evt.target.getBoundingClientRect();

    return evt.clientX < rect.left + 20
  }

  function onDragStart(evt) {
    evt.dataTransfer.effectAllowed = 'move';

    setDragIndex(i)

    evt.target.style.opacity = 0.3;
  }

  function onDragEnd(evt) {
    evt.target.style.opacity = 1
  }

  function onDrop(evt) {
    evt.target.style.padding = '0px'

    if (dragIndex === i) return false

    let newPosition = isLeft(evt) ? i : i + 1

    if (dragIndex <= i) {
      newPosition--
    }

    return reorder(dragIndex, newPosition)
  }

  function onDragOver(evt) {
    evt.preventDefault()

    evt.dataTransfer.dropEffect = 'move'

    if (isLeft(evt)) {
      evt.target.style.padding = '0px 0px 0px 50px'
    }
    else {
      evt.target.style.padding = '0px 50px 0px 0px'
    }

    return false;
  }

  function onDragLeave(evt) {
    evt.target.style.padding = '0px'
  }

  return (
    <button
      ref={ frameRef }
      className={css.button}
      onClick={() => setCurrentFrameIndex(i)}
      draggable
      onDragStart={ onDragStart }
      onDragEnd={ onDragEnd }
      onDragOver={ onDragOver }
      onDragLeave={ onDragLeave }
      onDrop={ onDrop }
    >
      <div style={{ "--color": currentFrameIndex === i ? "#5bff25ad" : "" }}>
        <img src={image} className={css.frameDisplay} alt={ `Frame ${ i }` } />
      </div>
    </button>
  );
}
export default FrameButton;
