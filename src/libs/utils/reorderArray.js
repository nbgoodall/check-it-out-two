function reorderArray(arr, index, newPosition) {
  if (index > newPosition) {
    return [
      ...arr.slice(0, newPosition),
      arr[index],
      ...arr.slice(newPosition, index),
      ...arr.slice(index + 1)
    ]
  } else {
    return [
      ...arr.slice(0, index),
      ...arr.slice(index + 1, newPosition + 1),
      arr[index],
      ...arr.slice(newPosition + 1)
    ]
  }
}

export default reorderArray