import React, { useEffect } from "react";
import "./TryAgain.css";

const TryAgainAnimation = ({ active }) => {
  useEffect(() => {
    if (active) {
      document.body.classList.remove("shake");
      void document.body.offsetWidth; // Trigger reflow to restart the animation
      document.body.classList.add("shake");

      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 500); // Duration of the shake animation
    }
  }, [active]);

  return null; // No need to render any additional elements
};

export default TryAgainAnimation;
