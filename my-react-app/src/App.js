import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar/Navbar";
import { themeContext } from "./Context";
//import SignInForm from "./components/SignInForm";
import Login from "./components/Login";
import Signup from "./components/SignUp";
function App() {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  return (
    <div
      className="App"
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
      }}
    >
      <Router>  
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
       
      </Router>
    </div>
  );
}

export default App;
