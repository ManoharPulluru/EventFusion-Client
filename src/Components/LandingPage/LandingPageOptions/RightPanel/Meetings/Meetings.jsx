import React, { useEffect, useState } from "react";
import "./Meetings.css";
import EventCard from "./EventCard/EventCard";
import loader from "../../../../../assets/loader.svg"; // Import the loader image
import noSearch from "../../../../../assets/noSearch.png"


const Meetings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const userId = localStorage.getItem("googleID"); // Get userId from localStorage

  useEffect(() => {
    // Fetch user events from backend API
    const fetchUserEvents = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(`https://eventfusion-server.onrender.com/user/getUserEvents/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching events: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("User Events:", data.events); // Log the events data to console
        setEvents(data.events); // Set the events in the state
      } catch (error) {
        console.error("Error fetching user events:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    if (userId) {
      fetchUserEvents(); // Call the function if userId exists
    }
  }, [userId]);

  // Function to handle event deletion
  const handleEventDelete = (eventId) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
  };

  return (
    <div className="MeetingsMain">
      {loading ? (
        <div className="searchingDiv">
          <img className="searchingDivImg" src={loader} alt="Loading..." />
        </div> // Show loading message while fetching events
      ) : events.length > 0 ? ( // Check if there are events
        events.map((event, index) => (
          <div className="eventCardParent" key={index}>
            <EventCard event={event} onDelete={handleEventDelete} />
          </div>
        ))
      ) : (
        <div className="noSearchResults">
        <img src={noSearch}/>
    </div>
      )}
    </div>
  );
};

export default Meetings;
