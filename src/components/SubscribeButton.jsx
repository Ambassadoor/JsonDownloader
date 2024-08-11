// src/components/SubscribeButton.jsx
import React from "react";

const SubscribeButton = ({ onClick }) => {
  return (
    <button id="subscribeButton" onClick={onClick}>
      Subscribe!
    </button>
  );
};

export default SubscribeButton;
