import React from "react";
import "./FirstLevel.css";

function FirstLevel() {
  //Levels Bar that shows how many levels are there

  //Stack-Bar that shows the contnent of the Stack
  const numberOfFieldsDynamic = Math.floor(Math.random() * 10) + 2;
  const dynamicFields = [];
  for (let i = 0; i < numberOfFieldsDynamic; i++) {
    dynamicFields.push(
      <div key={i} className="stack-field">
        {i}
      </div>
    );
  }

  return (
    <div>
      <div className="stack-bar">{dynamicFields}</div>
    </div>
  );
}

export default FirstLevel;
