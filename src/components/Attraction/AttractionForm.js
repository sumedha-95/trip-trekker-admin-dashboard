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

const AttractionForm = ({ type, data }) => {
  const [inputs, setInputs] = useState(AttractionModel);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            label="Product Name"
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
            label="Product Description"
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
                </>
              )}
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
                inputs.openHours.open
                  ? moment(inputs.openHours.open).tz("UTC")
                  : null
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
                </>
              )}
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
          <Typography>Images</Typography>
          <input
            name="images"
            type="file"
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
