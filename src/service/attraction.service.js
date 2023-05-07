import { getApi, getApiForFormData } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const getPaginatedAttractions = async (
  keyword,
  page,
  limit,
  orderBy
) => {
  const response = await getApi()
    .get("/attractions", {
      params: {
        keyword,
        page,
        limit,
        orderBy,
      },
    })
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};

export const createAttraction = async (data) => {
  const { files } = data;
  console.log(files);
  const formData = new FormData();
  formData.append("strigifiedBody", JSON.stringify(data));
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await getApiForFormData()
    .post("/attractions", formData)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      console.log("errr", err.response.data);
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
