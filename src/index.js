import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import { DarkModeContextProvider } from "./context/darkModeContext";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { socket, SocketContext } from "./context/socketContext";
TimeAgo.addDefaultLocale(en);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
    <SocketContext.Provider value={socket}>
      <DarkModeContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </DarkModeContextProvider>
    </SocketContext.Provider>
);
