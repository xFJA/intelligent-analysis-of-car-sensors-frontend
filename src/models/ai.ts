export interface KMeansResult {
  twoFirstComponentsPlot: string;
  componentsAndFeaturesPlot: string;
  explainedVarianceRatio: string;
  wcssPlot: string;
  cumulativeExplainedVarianceRatioPlot: string;
  clusterList: string[];
  moreImportantFeatures: string; // TODO: Use the proper interface here
}

export interface SVMResult {
  twoFirstComponentsPlot: string;
}
