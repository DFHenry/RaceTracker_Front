import './App.css'

//router imports
import { BrowserRouter, Routes, Route } from 'react-router';
import Standby from "../pages/Standby";

function App() 
{

  return(
    <>
      {/* <BrowserRouter>
      <Routes>
        <Route index element={<Standby />} />
      </Routes>

      </BrowserRouter> */}
      <Standby />
    </>
  )
}

export default App
