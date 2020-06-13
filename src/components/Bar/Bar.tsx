import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Record as DataRecord } from "./../../models/bar";

interface Props {
  data: DataRecord[];
  dataKey: string;
}

export const Bar: React.FC<Props> = (props) => {
  const { data, dataKey } = props;

  return (
    <ResponsiveBar
      data={data}
      keys={[dataKey]}
      indexBy="logID"
      margin={{ top: 50, right: 300, bottom: 50, left: 300 }}
      padding={0}
      colors={["#3f51b5"]}
      borderColor={{
        from: "color",
        modifiers: [
          ["darker", 0.6],
          ["opacity", 0.6],
        ],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Row",
        legendPosition: "middle",
        legendOffset: 32,
        tickValues: [],
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        legend: "value", // TODO: add measure unit
        legendPosition: "middle",
        legendOffset: -54,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  );
};
