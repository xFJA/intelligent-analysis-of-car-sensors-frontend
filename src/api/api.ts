import axios from "axios";

// TODO: Add the base url by config or env
const BASE_URL: string = "http://localhost:8080/";

// TODO: Add type to fetch
export class Api {
  getDatasets = async () => {
    return await fetch(BASE_URL + "datasets");
  };

  addDataset = async (file: File) => {
    let form = new FormData();
    form.append("csv", file);

    return await axios(BASE_URL + "datasets", {
      method: "POST",
      data: form,
    });
  };
}
