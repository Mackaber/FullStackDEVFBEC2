import { useState } from 'react'
import './App.css'
const ENDPOINT = import.meta.env.VITE_ENDPOINT || '/api'
function App() {
  const [input, setInput] = useState("");

  function handleInputChange(e) {
    setInput(e.target.value)
  }

  async function handleBtnClick() {

    console.log("BODY EN EL FRONTEND: ", input)

    // FRONTEND ENVIA EL INPUT AL BACKEND
    const response = await fetch(`${ENDPOINT}/test`, 
      { method: "POST", body: input }
    )
    console.log(response)
    
    const text = await response.text()
    console.log(text)
  }

  return (
    <>
      <input type="text" onChange={handleInputChange} value={input} />
      <button onClick={handleBtnClick} >Enviar</button>
    </>
  )
}

export default App
