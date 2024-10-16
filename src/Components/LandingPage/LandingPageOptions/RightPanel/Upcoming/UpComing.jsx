import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // For managing cookies
import './UpComing.css';
import EventCard from "./EventCard/EventCard";
import loader from "../../../../../assets/loader.svg"; // Import the loader image
import noSearch from "../../../../../assets/noSearch.png"

const UpComing = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]); // State to store upcoming events
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const token = Cookies.get("authToken"); // Get the token from cookies

      if (!token) {
        // console.log("User is not authenticated.");
        setLoading(false); // Set loading to false if not authenticated
        return;
      }

      try {
        const now = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(now.getDate() + 7);

        const response = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            timeMin: now.toISOString(),
            timeMax: oneWeekLater.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: "startTime",
          },
        });

        // Set the upcoming events in state
        setUpcomingEvents(response.data.items || []);
        // console.log("Upcoming events:", response.data.items);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchUpcomingEvents(); // Call the function to fetch events
  }, []);

  return (
    <div className='UpComingMain'>
      {loading ? ( // Check if loading
        <div className="searchingDiv">
          <img className="searchingDivImg" src={loader} alt="Loading..." /> {/* Loading indicator */}
        </div>
      ) : upcomingEvents.length > 0 ? (
        upcomingEvents.map((event, index) => (
          <div className="eventCardParent" key={event.id || index}> {/* Use event.id as key if available */}
            <EventCard event={event}  /> {/* Pass event data */}
          </div>
        ))
      ) : (
        <div className="noSearchResults">
            <img src={noSearch}/>
        </div> // Message if no events are available
      )}
    </div>
  );
};

export default UpComing;
