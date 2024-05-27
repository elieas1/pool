import React from "react";
import classes from "./PercentButton.module.css";

type Props = { percent: number; onClick: () => void };

const PercentButton = ({ percent, onClick }: Props) => {
  return (
    <button onClick={onClick} className={classes.button}>
      {percent}%
    </button>
  );
};

export default PercentButton;
