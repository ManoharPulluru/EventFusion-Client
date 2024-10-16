import React, { useContext } from "react";
import "./RightPanel.css";
import Schedule from "./Schedule/Schedule";
import AppContext from "../../../../Context/AppContext";
import Meetings from "./Meetings/Meetings";
import Invites from "./Invites/Invites";
import UpComing from "./Upcoming/UpComing";

const RightPanel = () => {
  const { myVal } = useContext(AppContext);

  return <div className="RightPanelMain">{myVal === 0 ? <Schedule /> : myVal === 1 ? <Meetings /> : myVal === 2 ? <Invites /> : myVal === 3 ? <UpComing /> : null}</div>;
};

export default RightPanel;
