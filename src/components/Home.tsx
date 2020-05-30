import React from "react";
import { DATASET } from "../dataset";
import { BarGroup } from "./Bar/BarGroup";

export const Home: React.FC = () => {
  return (
    <>
      <BarGroup dataset={DATASET} />
    </>
  );
};
