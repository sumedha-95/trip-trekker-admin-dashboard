import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import colors from "../../assets/styles/colors";
import AttractionModel from "../../models/attraction";
import moment from "moment-timezone";
import { DesktopTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createAttraction } from "../../service/attraction.service";
import { popAlert } from "../../utils/alerts";
import dayjs from "dayjs";

const AttractionForm = ({ type, data, onSuccess }) => {
  const [inputs, setInputs] = useState(AttractionModel);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    e.preventDefault();
    setLoading(true);

    // process inputs
    inputs.location = {
      coordinates: [inputs.location.lng, inputs.location.lat],
    };

    const response = await createAttraction(inputs);

    if (response.success) {
      popAlert(
        "Success!",
        "Successfully created the attraction!",
        "success"
      ).then((res) => {
        onSuccess(response.data);
      });
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setInputs(AttractionModel);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 1 }}>
          <TextField
            name="name"
            variant="filled"
            label="Name"
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
            name="description"
            variant="filled"
            label="Description"
            fullWidth
            value={inputs.description}
            multiline
            rows={10}
            onChange={(e) =>
              setInputs({
                ...inputs,
                description: e.target.value,
              })
            }
          />
          {errors["description"] && (
            <Typography color="error">{errors["description"]}</Typography>
          )}
        </Box>
        <Box sx={{ mb: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopTimePicker
              name="openHour"
              variant="filled"
              label="Open Hour"
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
              name="closeHour"
              variant="filled"
              label="Close Hour"
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
            name="accessibilityOptions"
            variant="filled"
            label="Accessibility Options"
            fullWidth
            value={inputs.unit}
            type="text"
            InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
            onChange={(e) =>
              setInputs({
                ...inputs,
                accessibilityOptions: e.target.value
                  .split(",")
                  .map((f) => f.trim()),
              })
            }
          />
          {errors["unit"] && (
            <Typography color="error">{errors["unit"]}</Typography>
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
            <Typography color="error">
              {errors["location.coordinates.0"]}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <TextField
            name="location.lat"
            variant="filled"
            label="Latitudes"
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
            <Typography color="error">
              {errors["location.coordinates.1"]}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography>Images</Typography>
          <input
            name="images"
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
  );
};

export default AttractionForm;
