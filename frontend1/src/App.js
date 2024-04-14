import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Homepages/HomePage";
import Chatpage from "./components/Chatpage/Chatpage";
import "./App.css";
import VideoCall from "./components/micelenous/VideoCall";
function App() {
  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/chats" element={<Chatpage />} />
        <Route exact path="/room/:RoomId" element={<VideoCall />} />
      </Routes>
    </div>
  );
}

export default App;
