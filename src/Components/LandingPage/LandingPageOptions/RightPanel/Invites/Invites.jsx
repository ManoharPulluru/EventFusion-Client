import React, { useEffect, useState } from "react";
import "./Invites.css";
import EventCard from "./EventCard/EventCard";
import loader from "../../../../../assets/loader.svg";
import noSearch from "../../../../../assets/noSearch.png"

const Invites = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const userId = localStorage.getItem("googleID"); // Get userId (email) from localStorage

  // console.log(userId, 99999);

  useEffect(() => {
    // Fetch user invites from backend API
    const fetchUserInvites = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(`https://eventfusion-server.onrender.com/user/getInvites/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching invites: ${response.statusText}`);
        }
        const data = await response.json();
        // console.log("User Invites:", data.invitations); // Log the invite data to console
        setInvites(data.invitations); // Set the invites in the state
      } catch (error) {
        console.error("Error fetching user invites:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    if (userId) {
      fetchUserInvites(); // Call the function if userId exists
    }
  }, [userId]);

  // Function to handle invitation deletion (or any other action)
  const handleInviteDelete = (inviteId) => {
    setInvites((prevInvites) => prevInvites.filter((invite) => invite.eventId !== inviteId));
  };

  return (
    <div className="InvitesMain">
      {loading ? (
        <div className="searchingDiv">
          <img className="searchingDivImg" src={loader} />
        </div> // Show loading message while fetching invites
      ) : invites.length > 0 ? (
        invites.map((invite, index) => (
          <div className="eventCardParent" key={index}>
            <EventCard event={invite} onDelete={handleInviteDelete} />
          </div>
        ))
      ) : (
        <div className="noSearchResults">
          <img src={noSearch} />
        </div> // Show message if no invites are found
      )}
    </div>
  );
};

export default Invites;
