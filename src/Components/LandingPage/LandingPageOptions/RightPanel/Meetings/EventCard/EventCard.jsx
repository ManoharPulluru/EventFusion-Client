import React, { useState } from "react";
import "./EventCard.css";
import link from "../../../../../../assets/link.png";
import axios from "axios"; // Import axios for HTTP requests
import Cookies from "js-cookie"; // Importing js-cookie to manage cookies

const EventCard = ({ event, onDelete }) => {
  const userId = localStorage.getItem("googleID"); // Get userId from localStorage
  const [friendEmail, setFriendEmail] = useState(""); // State for the friend's email

  // Function to format date and time
  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-US', options);
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { formattedDate, time };
  };

  // Function to copy the calendar URL to the clipboard
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        alert("Meeting link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
      });
  };

  // Function to handle event deletion
  const handleDeleteEvent = async () => {
    const token = Cookies.get("authToken"); // Get token from cookies
    const googleEventId = event.eventData.id; // Get the Google Calendar event ID

    try {
      // Step 1: Fetch all events to find the matching one
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(now.getDate() + 7);

      const allEventsResponse = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
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

      const allEvents = allEventsResponse.data.items;

      // Find the matching event based on title and time
      const matchingEvent = allEvents.find((gEvent) => {
        return gEvent.summary === event.summary && 
               gEvent.start.dateTime === event.start.dateTime && 
               gEvent.end.dateTime === event.end.dateTime;
      });

      if (!matchingEvent) {
        alert("Matching event not found in Google Calendar.");
        return;
      }

      const matchingGoogleEventId = matchingEvent.id; // Get the matching Google Calendar event ID

      // Step 2: Delete the matching event from Google Calendar
      await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${matchingGoogleEventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("Google Calendar Event deleted successfully");

      // Step 3: Delete the event from your application's backend
      const response = await fetch(`https://eventfusion-server.onrender.com/user/deleteEvent/${userId}/${event.eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Event deleted successfully!");
        // Optionally, call onDelete to refresh the event list
        if (onDelete) {
          onDelete(event.eventId);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  // Function to handle sharing the event with a friend
  const handleShareEvent = async () => {
    try {
      const response = await fetch("https://eventfusion-server.onrender.com/user/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromUser: userId,  // User ID from localStorage
          toUser: friendEmail, // Email entered by the user
          eventId: event.eventId, // Event ID from the event object
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const result = await response.json();
      alert(result.message); // Notify the user about the successful invitation
      setFriendEmail(""); // Clear the input field after sharing
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("An error occurred while sending the invitation.");
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
        {event.eventData && event.eventData.htmlLink && (
          <div className="copyURL" onClick={() => handleCopyLink(event.eventData.htmlLink)}>
            <img src={link} alt="Copy Link" />
          </div>
        )}
      </div>
      <div className="EventFooterDiv">
        <input 
          placeholder="Enter Friend Email" 
          className="shareFriendIp" 
          value={friendEmail} 
          onChange={(e) => setFriendEmail(e.target.value)} // Update state with input value
        />
        <div className="shareBtn" onClick={handleShareEvent}>Share</div>
      </div>
    </div>
  );
};

export default EventCard;
