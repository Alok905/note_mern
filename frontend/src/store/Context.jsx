import React, { createContext, useEffect, useState } from "react";
import { fetchUserDetails } from "../handlers/handleApiCalls";

export const TopLevelContext = createContext({
  state: null,
  setState: null,
});

const Context = ({ children }) => {
  const [state, setState] = useState(() => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    const user = JSON.parse(localStorage.getItem("user"));

    return {
      user,
      token,
      notes: {},
      isRemember: null,
    };
  });

  // If anyone update the state, then all the logged in sites should update those state from backend.
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("authToken"));

    if (token) {
      fetchUserDetails(state, setState);
    }
  }, []);

  // if logout or logout from all, then we set the state as null (so delete all details from localstorage in that case).
  // or else if state is changes, then update the localstorage according to that
  useEffect(() => {
    if (!state) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    } else {
      const token = JSON.parse(localStorage.getItem("authToken"));
      token && localStorage.setItem("user", JSON.stringify(state?.user));
    }
  }, [state]);

  return (
    <TopLevelContext.Provider value={{ state, setState }}>
      {children}
    </TopLevelContext.Provider>
  );
};

export default Context;
