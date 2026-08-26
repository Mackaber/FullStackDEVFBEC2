import { useState } from 'react'
import './App.css'
// Place the OR logic inside the template literal or evaluate it first
const baseUrl = import.meta.env.VITE_BACKEND_INTERNAL_URL || "http://localhost:3000";
const ENDPOINT = `${baseUrl}/api`;

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
    
    const text = response.text()
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
