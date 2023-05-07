import { getApi } from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const signIn = async (data) => {
  const response = await getApi()
    .post("/auth/sign-in", data)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(
        false,
        err.response.data,
        err.response.status,
        err.response.status
      );
    });

  return response;
};
