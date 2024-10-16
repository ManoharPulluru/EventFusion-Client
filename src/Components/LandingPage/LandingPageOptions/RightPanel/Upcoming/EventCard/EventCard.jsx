import React from "react";
import "./EventCard.css";
import axios from "axios";
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies

const EventCard = ({ event, onDelete }) => {
  const userId = localStorage.getItem("googleID"); // Get userId from localStorage

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("en-US", options);
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return { formattedDate, time };
  };

  // Function to handle accepting the invite
  const handleAccept = async () => {
    const token = Cookies.get("authToken"); // Get token from cookies

    const eventDetails = {
      summary: event.summary, // Get event details from the object
      location: event.location,
      description: event.description,
      start: {
        dateTime: event.start.dateTime,
        timeZone: event.start.timeZone, // Ensure you get the correct timezone
      },
      end: {
        dateTime: event.end.dateTime,
        timeZone: event.end.timeZone, // Ensure you get the correct timezone
      },
    };

    try {
      // Step 1: Accept the invitation
      const response = await fetch("https://eventfusion-server.onrender.com/user/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,  // email stored in localStorage
          eventId: event.id,  // eventId from the Google Calendar object
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to accept the event.");
      }

      const result = await response.json();
      // console.log(result.message); // Event accepted successfully

      // Step 2: Sync with Google Calendar
      const googleResponse = await axios.post("https://www.googleapis.com/calendar/v3/calendars/primary/events", eventDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Google Calendar Event created successfully:", googleResponse.data);

      // Optional: Notify the user that the event was synced (e.g., using an alert or toast)
      alert("Event accepted and synced with Google Calendar!");

    } catch (error) {
      console.error("Error accepting event or syncing with Google Calendar:", error);
    }
  };

  // Format the start and end times
  const { formattedDate: startDate, time: startTime } = formatDateTime(event.start.dateTime);
  const { formattedDate: endDate, time: endTime } = formatDateTime(event.end.dateTime);

  return (
    <div className="EventCardMain">
      <div className="EventNavDiv">
        <div className="DateDiv">{startDate}</div>
        <div className="TimeDiv">{`From ${startTime} To ${endTime}`}</div>
      </div>
      <div className="EventBodyDiv">
        <div className="EventNameDiv">{event.summary}</div>
        <div className="EventVenueDiv">{event.location}</div>
        <div className="EventDescriptionDiv">{event.description}</div>
      </div>
      {/* <div className="EventFooterDiv">
        {!event.accepted ? (
          <div className="acceptButton" onClick={handleAccept}>Accept</div>
        ) : (
          <>
            <input placeholder="Enter Friend Email" className="shareFriendIp" />
            <div className="shareBtn">Share</div>
          </>
        )}
      </div> */}
    </div>
  );
};

export default EventCard;
