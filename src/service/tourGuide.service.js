import { getApi, getApiForFormData } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const getAllTourGuides = async (page, limit, orderBy, keyword) => {
  const response = await getApiForFormData()
    .get("/users", {
      params: {
        page,
        limit,
        orderBy,
        keyword,
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

export const verifyTourGuide = async (userId, data) => {
  console.log("id s: ", userId);
  const response = await getApi()
    .patch(`/users/${userId}`, data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
