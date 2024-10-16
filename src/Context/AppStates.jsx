import React, { useState } from "react";
import AppContext from "./AppContext";

const AppStates = ({ children }) => {
  const [myVal, setMyVal] = useState(0);
  const [token, setToken] = useState(null);

  const triggerSetToken = (data) => {
    setToken(data);
  };

  const triggerSetMyval = (val) => {
    setMyVal(val);
  };

  return (
    <AppContext.Provider
      value={{
        myVal,
        token, // Include the token in the context
        triggerSetToken, // Provide the function to set the token
        triggerSetMyval
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppStates;
