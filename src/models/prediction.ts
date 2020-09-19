export enum PredictionFeaturesType {
  All = "AllFeatures",
  One = "OneFeature",
  PCA = "PCA",
}

export const getPredictionFeaturesTypeString = (
  type: PredictionFeaturesType
) => {
  switch (type) {
    case PredictionFeaturesType.All:
      return "All features";
    case PredictionFeaturesType.One:
      return "One features";
    case PredictionFeaturesType.PCA:
      return "PCA";
  }
};

export interface PredictionInformationList {
  title: string;
  list: PredictionInformationSection[];
}

interface PredictionInformationSection {
  title: string;
  value: any;
}
