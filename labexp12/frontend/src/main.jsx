// This is the starting point of the React app.
// It takes the App component and puts it inside the <div id="root">.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
