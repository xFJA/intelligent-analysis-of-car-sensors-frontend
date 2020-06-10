import axios from "axios";
import { DatasetsRequest, DatasetRequest } from "../models/dataset";

// TODO: Add the base url by config or env
const BASE_URL: string = "http://localhost:8080/";

// TODO: Add type to fetch
export class Api {
  getDatasets = async (): Promise<DatasetsRequest> => {
    return await axios(BASE_URL + "datasets").then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
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

  pca = async (id: number): Promise<DatasetRequest> => {
    return await axios(`${BASE_URL}pca/${id}`).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };

}
