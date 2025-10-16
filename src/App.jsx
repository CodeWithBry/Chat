import { Routes, Route } from 'react-router-dom';
import Chat from './Pages/chat';
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path='/' element={(<Chat />)}></Route>
    </Routes>
  )
}

export default App
