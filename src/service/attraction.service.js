import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const getPaginatedAttractions = async (keyword, page, limit, orderBy) => {
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

