import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement } from '../features/counterSlice'
function Counter() {
    const dispatch = useDispatch()
    const count = useSelector((state) => state.counter.count)
  return (
    <div>
        <h1>Counter using reduxt toolkit</h1>
        <h3>Current Count is {count}</h3>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  )
}

export default Counter