import { transformDataset } from "./../components/Home/Home";
import { Dataset } from "../models/dataset";
import { PredictionFeaturesType } from "../models/prediction";

describe("<Home />", () => {
  describe("when transform the dataset", () => {
    it("should transform the dataset correctly", () => {
      const dataset: Dataset = {
        id: 1,
        name: "",
        columnNames: "",
        rowsNumber: 27,
        logs: [],
        classificationApplied: true,
        predictionApplied: true,
        date: 1235135,
        kmeansResult: {
          twoFirstComponentsPlot: "",
          clusterList: "",
          componentsAndFeaturesPlot: "",
          cumulativeExplainedVarianceRatioPlot: "",
          explainedVarianceRatio: "",
          moreImportantFeatures: "",
          wcssPlot: "",
        },
        prediction: {
          epochs: 150,
          feature: "",
          learningCurvePlot: "",
          predictionFeaturesType: PredictionFeaturesType.All,
          predictionPlot: "",
          principalComponentsNumber: 2,
          rmse: "",
          time: "",
        },
        svmResult: { twoFirstComponentsPlot: "" },
      };

      const emptyDatasetTransformedExpected = {
        ABSOLUTE_BAROMETRIC_PRESSURE: [],
        ABSOLUTE_THROTTLE_B: [],
        CATALYST_TEMPERATURE_BANK1_SENSOR1: [],
        CATALYST_TEMPERATURE_BANK1_SENSOR2: [],
        COMMANDED_EVAPORATIVE_PURGE: [],
        COMMAND_THROTTLE_ACTUATOR: [],
        CONTROL_MODULE_VOLTAGE: [],
        COOLANT_TEMPERATURE: [],
        DISTANCE_TRAVELED_WITH_MIL_ON: [],
        ENGINE_LOAD: [],
        ENGINE_RPM: [],
        FUEL_AIR_COMMANDED_EQUIV_RATIO: [],
        FUEL_TANK: [],
        INTAKE_AIR_TEMP: [],
        INTAKE_MANIFOLD_PRESSURE: [],
        LONG_TERM_FUEL_TRIM_BANK_1: [],
        PEDAL_D: [],
        PEDAL_E: [],
        RELATIVE_THROTTLE_POSITION: [],
        SHORT_TERM_FUEL_TRIM_BANK_1: [],
        THROTTLE: [],
        TIME_RUN_WITH_MIL_ON: [],
        TIME_SINCE_TROUBLE_CODES_CLEARED: [],
        TIMING_ADVANCE: [],
        VEHICLE_SPEED: [],
        WARM_UPS_SINCE_CODES_CLEARED: [],
      };

      const datasetTransformed = transformDataset(dataset);

      expect(datasetTransformed).toEqual(emptyDatasetTransformedExpected);
    });
  });
});
