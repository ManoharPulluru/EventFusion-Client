import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import "./LeftPanel.css";
import Logo from "../../../../assets/Logo.png";
import AppContext from "../../../../Context/AppContext";

const LeftPanel = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");

  const { myVal, triggerSetMyval } = useContext(AppContext);

  // console.log(myVal);

  useEffect(() => {
    // console.log(myVal);
  }, [myVal]);

  useEffect(() => {
    // Set the timezone
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(timeZone);

    // Fetch user's country using Geolocation API
    const fetchCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setCountry(data.country_name);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchCountry();

    // Update time every second
    // const interval = setInterval(updateTime, 1000);
    // return () => clearInterval(interval);
  }, []);

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("authToken"); // Remove the token from cookies
    navigate("/"); // Navigate to the home page
    localStorage.removeItem("googleID");
  };

  return (
    <div className="LeftPanelMain">
      <img src={Logo} alt="Logo" />
      <div
        style={{ border: myVal === 0 ? "2px solid black" : "" }}
        onClick={() => {
          triggerSetMyval(0);
        }}
        className="LeftPanelBtn1"
      >
        <p>+</p> Schedule
      </div>
      <div
        onClick={() => {
          triggerSetMyval(1);
        }}
        style={{ border: myVal === 1 ? "2px solid grey" : "" }}
        className="LeftPanelBtn2"
      >
        Your Meetings
      </div>
      <div
        onClick={() => {
          triggerSetMyval(2);
        }}
        style={{ border: myVal === 2 ? "2px solid grey" : "" }}
        className="LeftPanelBtn2"
      >
        Invitations
      </div>
      <div
        onClick={() => {
          triggerSetMyval(3);
        }}
        style={{ border: myVal === 3 ? "2px solid grey" : "" }}
        className="LeftPanelBtn2"
      >
        All Meetings
      </div>
      <div
        className="LeftPanelBtn1 logout"
        style={{ backgroundColor: "#ee2d4d" }}
        onClick={handleLogout} // Set onClick to handleLogout
      >
        LogOut
      </div>
    </div>
  );
};

export default LeftPanel;
