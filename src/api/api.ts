import axios from "axios";
import {
  DatasetsRequest,
  DatasetRequest,
  Dataset,
  SensorsRequest,
} from "../models/dataset";
import { PredictionFeaturesType } from "../models/prediction";

// TODO: Add the base url by config or env
const BASE_URL: string = "http://localhost:8080/";

// TODO: Add type to fetch
export class Api {
  getDatasets = async (
    limit: number,
    page: number
  ): Promise<DatasetsRequest> => {
    return await axios(`${BASE_URL}datasets?limit=${limit}&page=${page}`).then(
      (response: any) => {
        if (response.status !== 200) throw new Error(JSON.stringify(Response));
        return response.data;
      }
    );
  };

  getDataset = async (id: number): Promise<DatasetRequest> => {
    return await axios(`${BASE_URL}datasets/${id}`).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };

  addDataset = async (file: File) => {
    let form = new FormData();
    form.append("csv", file);

    return await axios(BASE_URL + "datasets", {
      method: "POST",
      data: form,
    });
  };

  deleteDataset = async (id: number) => {
    return await axios(`${BASE_URL}datasets/${id}`, {
      method: "DELETE",
    });
  };

  getDatasetCSV = async (id: number) => {
    return await axios(`${BASE_URL}datasets/${id}/csv`).then(
      (response: any) => {
        if (response.status !== 200) throw new Error(JSON.stringify(Response));
        return response.data;
      }
    );
  };

  classify = async (
    id: number,
    clustersNumber: number,
    componentsNumber: number
  ): Promise<Dataset> => {
    return await axios(
      `${BASE_URL}classify/${id}?clusters-number=${clustersNumber}&components-number=${componentsNumber}`
    ).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };

  classifySVM = async (id: number, file: File) => {
    let form = new FormData();
    form.append("csv", file);
    form.append("id", id.toString());

    return await axios(`${BASE_URL}classify-svm`, {
      method: "POST",
      data: form,
    }).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };

  getSensors = async (): Promise<SensorsRequest> => {
    return await axios(`${BASE_URL}sensors`).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };

  predict = async (
    id: number,
    feature: string,
    epochs: number,
    predictionsFeatureType: PredictionFeaturesType,
    principalComponentsNumber: number
  ): Promise<Dataset> => {
    return await axios(
      `${BASE_URL}predict/${id}?feature=${feature}&epochs=${epochs}&predictions-feature-type=${predictionsFeatureType}&pc-number=${principalComponentsNumber}`
    ).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };
}
