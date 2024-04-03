import React from "react";
import styles from "./Amongus.module.css"; // Import CSS module

function Amongus() {
  return (
    <div className={styles.character}>
      <div className={styles.body}></div>
      <div className={styles.glass}>
        <div className={styles["white-reflection"]}></div>
      </div>
      <div className={styles.legs}>
        <div className={styles["leg-left"]}></div>
        <div className={styles["leg-right"]}></div>
      </div>
    </div>
  );
}

export default Amongus;
