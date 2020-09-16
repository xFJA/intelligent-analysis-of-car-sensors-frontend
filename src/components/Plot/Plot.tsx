import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import React from "react";
import { PlotData } from "../../models/plot";

interface Props {
  data: PlotData[];
  measureUnit: string;
}

export const Plot: React.FC<Props> = (props) => {
  const { data, measureUnit } = props;

  return (
    <ResponsiveScatterPlot
      data={data}
      margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
      xScale={{ type: "linear", min: 0, max: "auto" }}
      xFormat={function (e) {
        return e + " log ID";
      }}
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      // TODO: Add measure unit
      yFormat={function (e) {
        return e + "";
      }}
      colors={{ scheme: "category10" }}
      blendMode="multiply"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Row index from dataset",
        legendPosition: "middle",
        legendOffset: 46,
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: measureUnit,
        legendPosition: "middle",
        legendOffset: -60,
      }}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 130,
          translateY: 0,
          itemWidth: 100,
          itemHeight: 12,
          itemsSpacing: 5,
          itemDirection: "left-to-right",
          symbolSize: 12,
          symbolShape: "circle",
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
    />
  );
};
