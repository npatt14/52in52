import React from 'react'
import './App.css'

function App() {


 return (
    <div className="text-center p-6">
      <h1 className="text-3xl font-bold underline text-red-600">
        Hello world!
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
    </div>
  )};
export default App
