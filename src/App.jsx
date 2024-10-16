import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn/SignIn";
import LandingPage from "./Components/LandingPage/LandingPage";

const App = () => {
  return (
    <div className="AppMain">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignIn />} />
          <Route path="/landingPage" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
