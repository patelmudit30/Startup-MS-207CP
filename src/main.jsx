import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// 🔥 FORCE DARK MODE
document.documentElement.classList.add("dark");

const root = document.getElementById("root");
createRoot(root).render(<App />);