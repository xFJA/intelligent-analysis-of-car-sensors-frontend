// TODO: Add the base url by config or env
const BASE_URL: string = "http://localhost:8080/";

// TODO: Add type to fetch
export class Api {
  getDatasets = async () => {
    return await fetch(BASE_URL + "datasets");
  };

  addDataset = async () => {
      return await fetch(BASE_URL + "datasets", {
          method: "POST",
          
      })
  }
}
