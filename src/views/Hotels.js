import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "../components/common/SearchBar";
import AddButton from "../components/common/AddButton";
// import ReportButton from "../components/common/ReportButton";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Card,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TablePagination,
} from "@mui/material";
import Popup from "../components/common/Popup";
import ReusableTable from "../components/common/ReusableTable";
import { popAlert, popDangerPrompt } from "../utils/alerts";
import colors from "../assets/styles/colors";
import TableAction from "../components/common/TableActions";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import ReportButton from "../components/common/ReportButton";
import ProductCard from "../components/common/ProductCard";
import ProductDelete from "../components/common/ProductDelete";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  createHotel,
  deleteHotel,
  getPaginatedHotels,
} from "../service/hotel.service";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import Hotel from "../models/hotel";
import moment from "moment-timezone";
import dayjs from "dayjs";

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "registrationNumber",
    label: "Reg.Num",
    align: "left",
  },
  {
    id: "address",
    label: "Address",
    align: "left",
  },
  {
    id: "email",
    label: "Email",
    align: "left",
  },
  {
    id: "contactNumber",
    label: "Con.Num",
    align: "left",
  },
  {
    id: "hotelFacilities",
    label: "Facilities",
    align: "left",
  },
  {
    id: "openHours",
    label: "Open Hours",
    align: "left",
  },
  {
    id: "closeHours",
    label: "Close Hours",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const Hotels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(Hotel);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(false);
  const [isSeller, setisSeller] = useState(false);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handlePopupClose = () => setShowPopup(false);
  const handleUpdatePopupClose = () => setShowUpdatePopup(false);
  const handleDeletePopupClose = () => setShowDeletePopup(false);

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const authState = useSelector((state) => state.auth);

  const reqBody = {
    ...Hotel,
    coordinates: [Hotel.location.lng, Hotel.location.lat],
    location: {
      lng: inputs.location.lng,
      lat: inputs.location.lat,
    },

    openHours: {
      open: moment(inputs.openHours.open).toISOString(),
      close: moment(inputs.openHours.close).toISOString(),
    },
  };

  console.log("reqBody", reqBody);

  // edit hotel
  const handleEdit = () => {
    setShowUpdatePopup(true);
  };
  //delet hotel
  const handleDelete = (id) => {
    deleteHotelSubmit(id);
  };

  //delete products
  const deleteHotelSubmit = async (id) => {
    setIsLoading(true);

    popDangerPrompt(
      "DELETE",
      "Are You sure you want to delete this hotel!",
      "error"
    ).then(async (res) => {
      if (res.isConfirmed) {
        const response = await deleteHotel(id);

        if (response.success) {
          response?.data?.message &&
            popAlert("Success!", response?.data?.message, "success").then(
              (res) => {
                setShowPopup(true);
              }
            );
          window.location.reload();
        } else {
          response?.data?.message &&
            popAlert("Error!", response?.data?.message, "error");
          response?.data?.data && setErrors(response.data.data);
        }
      }
    });
    setIsLoading(false);
  };

  //get paginated Hotel
  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getPaginatedHotels(
        keyword,
        pagination.page,
        pagination.limit,
        pagination.orderBy
      );
      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const hotel of response.data.content) {
          tableDataArr.push({
            name: hotel.name,
            address: hotel.address,
            registrationNumber: hotel.registrationNumber,
            email: hotel.email,
            contactNumber: hotel.contactNumber,
            hotelFacilities: hotel.hotelFacilities
              .map((item) => item)
              .join(", "),
            openHours: hotel.openHours.open.substring(11, 16),
            closeHours: hotel.openHours.close.substring(11, 16),
            action: (
              <TableAction
                id={hotel._id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ),
          });
        }
        if (!unmounted) {
          setTotalElements(response.data.totalElements);
          setTableRows(tableDataArr);
        }
      } else {
        console.error(response?.data);
      }
      if (!unmounted) setIsLoading(false);
    };
    fetchAndSet();
    return () => {
      unmounted = true;
    };
  }, [pagination, refresh, keyword]);

  const handleSubmit = async (e) => {
    console.log("Hi");
    e.preventDefault();
    setLoading(true);

    const response = await createHotel(inputs);

    if (response.success) {
      setRefresh(!refresh);
      response?.data?.message &&
        popAlert("Success!", response?.data?.message, "success").then((res) => {
          setShowPopup(false);
        });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  const handleClear = () => {};

  const updateSubmit = () => {};

  const handleUpdateClear = () => {};

  return (
    <React.Fragment>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Hotel
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <SearchBar
            onSearch={handleSearch}
            placeholderText="Search Product..."
          />
        </Grid>
        <Grid item xs={1}>
          <AddButton onClick={() => setShowPopup(true)} />
        </Grid>
        <Grid item xs={1}>
          <ReportButton />
        </Grid>
      </Grid>

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            mt: "3%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ mr: 2 }} />
          Loading...
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            mt: "3%",
          }}
        >
          <ReusableTable
            rows={tableRows}
            columns={tableColumns}
            totalElements={totalElements}
            limit={pagination.limit}
            page={pagination.page}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </Box>
      )}

      {/* custom popup */}
      <Popup
        title="Add Hotel"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="name"
                variant="filled"
                label="Hotel Name"
                fullWidth
                value={inputs.name}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    name: e.target.value,
                  })
                }
              />
              {errors["name"] && (
                <Typography color="error">{errors["name"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="registrationNumber"
                variant="filled"
                label="Hotel Registration Number"
                fullWidth
                value={inputs.registrationNumber}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    registrationNumber: e.target.value,
                  })
                }
              />
              {errors["registrationNumber"] && (
                <Typography color="error">
                  {errors["registrationNumber"]}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="address"
                variant="filled"
                label="Hotel Address"
                fullWidth
                value={inputs.address}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    address: e.target.value,
                  })
                }
              />
              {errors["address"] && (
                <Typography color="error">{errors["address"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="contactNumber"
                variant="filled"
                label="Contact Number"
                fullWidth
                value={inputs.contactNumber}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    contactNumber: e.target.value,
                  })
                }
              />
              {errors["contactNumber"] && (
                <Typography color="error">{errors["contactNumber"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="email"
                variant="filled"
                label="Email"
                fullWidth
                value={inputs.email}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    email: e.target.value,
                  })
                }
              />
              {errors["email"] && (
                <Typography color="error">{errors["email"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  name="openHours"
                  variant="filled"
                  label="Open Hours"
                  slotProps={{ textField: { fullWidth: true } }}
                  value={inputs.openHours.open ? dayjs(inputs.openHours.open) : ""}
                  inputFormat="YYYY-MM-DD hh:mm A"
                  onChange={(val) => {
                    const selectedTime = moment(val).tz("UTC").format();
                      setInputs({
                        ...inputs,
                         openHours: { ...inputs.openHours, open: selectedTime },
                    });
                  }}
                />
              </LocalizationProvider>
              {errors["openHours.open"] && (
                <Typography color="error">{errors["openHours.open"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  name="closeHours"
                  variant="filled"
                  label="Close Hours"
                  slotProps={{ textField: { fullWidth: true } }}
                   value={
                    inputs.openHours.close ? dayjs(inputs.openHours.close) : ""
                  }
                  inputFormat="YYYY-MM-DD hh:mm A"
                  onChange={(e) => {
                    const selectedTime = moment(e).tz("UTC").format();
                      setInputs({
                        ...inputs,
                        openHours: { ...inputs.openHours, close: selectedTime },
                      });
                  }}
                />
              </LocalizationProvider>
              {errors["openHours.close"] && (
            <Typography color="error">{errors["openHours.close"]}</Typography>
          )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="hotelFacilities"
                variant="filled"
                label="HotelFacilities (Separated by comma)"
                fullWidth
                value={inputs.hotelFacilities}
                type="text"
                 InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    hotelFacilities: e.target.value
                      .split(",")
                      .map((f) => f.trim()),
                  })
                }
              />
              {errors["hotelFacilities"] && (
                <Typography color="error">{errors["hotelFacilities"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="location.lng"
                variant="filled"
                label="Longitude"
                fullWidth
                value={inputs.location.lng}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    location: {
                      ...inputs.location,
                      lng: Number(e.target.value),
                    },
                  })
                }
              />
              {errors["location.coordinates.0"] && (
                <Typography color="error">{errors["location.coordinates.0"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="location.lat"
                variant="filled"
                label="Latitude"
                fullWidth
                value={inputs.location.lat}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    location: {
                      ...inputs.location,
                      lat: Number(e.target.value),
                    },
                  })
                }
              />
              {errors["location.coordinates.1"] && (
                <Typography color="error">{errors["location.coordinates.1"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography>File</Typography>
              <input
                name="files"
                type="file"
                multiple
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    files: Array.from(e.target.files),
                  });
                }}
              />
              {errors["file"] && (
                <Typography color="error">{errors["file"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="reset"
                variant="contained"
                onClick={handleClear}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>

      {/* custom popup */}
      <Popup
        title="Update Hotel"
        width={800}
        show={showUpdatePopup}
        onClose={handleUpdatePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={updateSubmit}>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="name"
                variant="filled"
                label="Hotel Name"
                fullWidth
                value={inputs.name}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    name: e.target.value,
                  })
                }
              />
              {errors["name"] && (
                <Typography color="error">{errors["name"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="registrationNumber"
                variant="filled"
                label="Hotel Registration Number"
                fullWidth
                value={inputs.registrationNumber}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    registrationNumber: e.target.value,
                  })
                }
              />
              {errors["registrationNumber"] && (
                <Typography color="error">
                  {errors["registrationNumber"]}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="address"
                variant="filled"
                label="Hotel Address"
                fullWidth
                value={inputs.address}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    address: e.target.value,
                  })
                }
              />
              {errors["address"] && (
                <Typography color="error">{errors["address"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="contactNumber"
                variant="filled"
                label="Contact Number"
                fullWidth
                value={inputs.contactNumber}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    contactNumber: e.target.value,
                  })
                }
              />
              {errors["contactNumber"] && (
                <Typography color="error">{errors["contactNumber"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="email"
                variant="filled"
                label="Email"
                fullWidth
                value={inputs.email}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    email: e.target.value,
                  })
                }
              />
              {errors["email"] && (
                <Typography color="error">{errors["email"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  name="openHours"
                  variant="filled"
                  label="Open Hours"
                  slotProps={{ textField: { fullWidth: true } }}
                  value={
                    inputs.openHours.open
                      ? moment(inputs.openHours.open).tz("UTC")
                      : null
                  }
                  inputFormat="YYYY-MM-DD hh:mm A"
                  onChange={(e) => {
                    const selectedTime = moment(e).tz("UTC").format();
                    setInputs({
                      ...inputs,
                      openHours: { ...inputs.openHours, open: selectedTime },
                    });
                  }}
                  renderInput={(props) => (
                    <>
                      <TextField
                        {...props}
                        InputProps={{ shrink: true }}
                        inputProps={{ min: 0 }}
                      />
                      {errors["openHours"] && (
                        <Typography color="error">
                          {errors["openHours"]}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  name="closeHours"
                  variant="filled"
                  label="Close Hours"
                  slotProps={{ textField: { fullWidth: true } }}
                  value={
                    (inputs.openHours.close = moment(inputs.openHours.close).tz(
                      "UTC"
                    ))
                  }
                  inputFormat="YYYY-MM-DD hh:mm A"
                  onChange={(e) => {
                    const selectedTime = moment(e).tz("UTC").format();
                    setInputs({
                      ...inputs,
                      openHours: { ...inputs.openHours, close: selectedTime },
                    });
                  }}
                  renderInput={(props) => (
                    <>
                      <TextField
                        {...props}
                        InputProps={{ shrink: true }}
                        inputProps={{ min: 0 }}
                      />
                      {errors["openHours"] && (
                        <Typography color="error">
                          {errors["openHours"]}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="hotelFacilities"
                variant="filled"
                label="HotelFacilities (Separated by comma)"
                fullWidth
                value={inputs.hotelFacilities}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    hotelFacilities: e.target.value
                      .split(",")
                      .map((f) => f.trim()),
                  })
                }
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="location.lng"
                variant="filled"
                label="Longitude"
                fullWidth
                value={inputs.location.lng}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    location: {
                      ...inputs.location,
                      lng: Number(e.target.value),
                    },
                  })
                }
              />
              {errors["location"] && (
                <Typography color="error">{errors["location"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="location.lat"
                variant="filled"
                label="Latitude"
                fullWidth
                value={inputs.location.lat}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    location: {
                      ...inputs.location,
                      lat: Number(e.target.value),
                    },
                  })
                }
              />
              {errors["location"] && (
                <Typography color="error">{errors["location"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography>File</Typography>
              <input
                name="files"
                type="file"
                multiple
                onChange={(e) => {
                  setInputs({
                    ...inputs,
                    files: Array.from(e.target.files),
                  });
                }}
              />
              {errors["files"] && (
                <Typography color="error">{errors["files"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="reset"
                variant="contained"
                onClick={handleClear}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>
      {/* custom popup */}
      <Popup
        width={700}
        show={showDeletePopup}
        onClose={handleDeletePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box
                sx={{
                  width: "100%",
                  mt: "3%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress sx={{ mr: 5 }} />
                <Typography sx={{ mb: 2 }} variant="h3">
                  LOADING
                </Typography>
              </Box>
            ) : (
              <ProductDelete />
            )}
          </Box>
        </Box>
      </Popup>
    </React.Fragment>
  );
};

export default Hotels;
