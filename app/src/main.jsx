import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

const preventDefault = (event) => {
  event.preventDefault();
};

document.addEventListener("contextmenu", preventDefault, { passive: false });
document.addEventListener("selectstart", preventDefault, { passive: false });
document.addEventListener("dragstart", preventDefault, { passive: false });
document.addEventListener("gesturestart", preventDefault, { passive: false });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
