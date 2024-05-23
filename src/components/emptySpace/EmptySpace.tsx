import React from "react";

type Props = {
  spaceTop?: number;
  spaceBottom?: number;
  spaceLeft?: number;
};

const EmptySpace = ({
  spaceBottom = 0,
  spaceTop = 0,
  spaceLeft = 0,
}: Props) => {
  const getStyle = () => ({
    paddingTop: spaceTop,
    paddingBottom: spaceBottom,
    paddingLeft: spaceLeft,
  });

  return <div style={getStyle()} />;
};

export default EmptySpace;
