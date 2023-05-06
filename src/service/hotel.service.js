import { getApi, getApiForFormData} from "../utils/axios";
import { buildResponse } from "../utils/responseBuilder";

export const createHotel = async (data) => {
     const { files } = data;
  
  const formData = new FormData();
  formData.append("strigifiedBody", JSON.stringify(data));
  formData.append("files", files);

  const response = await getApi()
    .post("/hotels/", formData)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      console.log("errr",err.response.data);
      return buildResponse(false, err.response.data, err.response.status);
      
    });
  
  return response;
  
};

export const getPaginatedHotels = async (keyword,page,limit,orderBy) => {
    const response = await getApi()
      .get("/hotels", {
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

  export const deleteHotel = async (hotelId) => {
  const response = await getApi()
    .delete(`/hotels/${hotelId}`)
    .then((res) => {
      return buildResponse(true, res.data);
    })
    .catch((err) => {
      return buildResponse(false, err.response.data, err.response.status);
    });

  return response;
};
