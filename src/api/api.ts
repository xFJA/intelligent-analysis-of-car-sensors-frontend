import axios from "axios";
import { DatasetsRequest, DatasetRequest, Dataset } from "../models/dataset";

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

  pca = async (id: number): Promise<Dataset> => {
    return await axios(`${BASE_URL}pca/${id}`).then((response: any) => {
      if (response.status !== 200) throw new Error(JSON.stringify(Response));
      return response.data;
    });
  };
}
