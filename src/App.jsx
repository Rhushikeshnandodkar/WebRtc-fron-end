import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import NotFound from './pages/NotFound'
import Users from './pages/Users'
import Counter from './pages/Counter'
import WebSocket from './pages/WebSocketComponent'
import CreateRoom from './pages/CreateRoom'
import MainRoom from './pages/MainRoom'
import ChatRoom from './pages/ChatRoom'
import VideoRoom from './pages/VideoRoom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/counter' element={<Counter/>}/>
        <Route path='/users' element={<Users/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/product/:id' element={<Products/>}/>
        <Route path='/send-message' element={<WebSocket/>}/>
        <Route path='/create-room' element={<CreateRoom/>}/>
        <Route path='/main-room' element={<MainRoom/>}/>
        <Route path='/chat-room/:id' element={<ChatRoom/>}/>
        <Route path='/video-room' element={<VideoRoom/>}/>




        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
