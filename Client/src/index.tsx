import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import brickbix from './assets/brick-bix.png'; // Ensure the correct path to your logo

// Set the page title
document.title = "BrickBix - Your Property Solution";

// Function to set the favicon
const setFavicon = (url: string) => {
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
  link.type = 'image/png';
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

// Set the favicon to the brickbix logo
setFavicon(brickbix);

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
