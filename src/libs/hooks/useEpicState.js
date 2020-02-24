import { useState } from 'react'

const useEpicState = initialState => {
  const [state, mutateState] = useState(initialState || {})

  // mutateState can take a function with the latest value as the arg to prevent stale closures
  const setState = newState => mutateState(_state => ({ ..._state, ...newState }))

  return [state, setState]
}

export default useEpicState