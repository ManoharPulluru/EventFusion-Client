import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies
import "./Schedule.css";
import FirstComponent from "./Calendar/Calendar";
import axios from "axios";

const Schedule = () => {
  const navigate = useNavigate();
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    location: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
  });

  useEffect(() => {
    const tokenFromCookies = Cookies.get("authToken"); // Get token from cookies

    if (!tokenFromCookies) {
      navigate("/"); // Redirect if token doesn't exist
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFromDateChange = (newValue) => {
    setEventDetails((prevState) => ({
      ...prevState,
      startDateTime: newValue,
    }));
  };

  const handleToDateChange = (newValue) => {
    setEventDetails((prevState) => ({
      ...prevState,
      endDateTime: newValue,
    }));
  };

  const createEvent = async () => {
    const token = Cookies.get("authToken"); // Get token from cookies

    if (!token) {
        // console.log("User not authenticated");
        return;
    }

    const { startDateTime, endDateTime } = eventDetails;

    // Validate start and end date/time
    if (!startDateTime || !endDateTime) {
        console.error("Start and end date/time must be filled");
        return;
    }

    const event = {
        summary: eventDetails.summary,
        location: eventDetails.location,
        description: eventDetails.description,
        start: {
            dateTime: startDateTime,
            timeZone: "America/Los_Angeles",
        },
        end: {
            dateTime: endDateTime,
            timeZone: "America/Los_Angeles",
        },
    };

    try {
        // Step 1: Create the event in Google Calendar
        const googleResponse = await axios.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", event, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("Google Calendar Event created successfully:", googleResponse.data);

        // Step 2: Prepare the data for your own API
        const eventData = googleResponse.data; // Capture the response from Google Calendar

        const eventPayload = {
            userId: localStorage.getItem("googleID"), // User ID should be correctly sourced
            summary: eventDetails.summary,
            location: eventDetails.location,
            description: eventDetails.description,
            start: {
                dateTime: startDateTime,
                timeZone: "America/Los_Angeles",
            },
            end: {
                dateTime: endDateTime,
                timeZone: "America/Los_Angeles",
            },
            eventData, // Use the response from Google Calendar as eventData
        };

        // Step 3: Send the event data to your own API
        const response = await axios.post("https://eventfusion-server.onrender.com/user/createEvent", eventPayload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        // console.log("Event data saved successfully:", response.data);
        alert("Event created and saved!");
        
    } catch (error) {
        console.error("Error creating or saving event:", error);
    }
};


  return (
    <div style={{ fontSize: "14px" }} className="ScheduleMain">
      <div className="formSchedule">
        <div className="formRow0">
          <FirstComponent onFromDateChange={handleFromDateChange} onToDateChange={handleToDateChange} fromDate={eventDetails.startDateTime} toDate={eventDetails.endDateTime} />
        </div>
        <div className="formRow1">
          <input name="summary" placeholder="Enter Event Name" className="formIp1" value={eventDetails.summary} onChange={handleInputChange} />
          <input name="location" placeholder="Enter Location" value={eventDetails.location} onChange={handleInputChange} />
        </div>
        <div className="formRow2">
          <textarea name="description" placeholder="Add Description" value={eventDetails.description} onChange={handleInputChange} />
        </div>
        <div className="formRow3">
          <div className="formSubmitBtn" onClick={createEvent}>
            Confirm Schedule
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
