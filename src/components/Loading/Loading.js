import React from "react";
import { useState } from "react";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin:0 auto
  border-color: red;
`;
const Loading = () => {
  let [color, setColor] = useState("#3b82f6");

  return (
    <div>
      <div className="sweet-loading absolute top-1/2 right-1/2">
        <ClipLoader color={color} loading={true} css={override} size={60} />
      </div>
    </div>
  );
};

export default Loading;
