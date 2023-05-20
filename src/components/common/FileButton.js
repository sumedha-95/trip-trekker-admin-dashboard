import React from "react";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button } from "@mui/material";
import colors from "../../assets/styles/colors";

const FileButton = ({ onClick }) => {
  return (
    <React.Fragment>
      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={onClick}
          sx={{
            backgroundColor: colors.purpal,
            height: 56,
            borderRadius: "5px 5px 5px 5px",
            boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: colors.darkPurpal },
          }}
        >
          <AddPhotoAlternateIcon />
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default FileButton;
