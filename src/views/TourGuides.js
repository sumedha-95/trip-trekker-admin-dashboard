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
  InputLabel,
  MenuItem,
  FormControl,
  Select,
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ReusableTable from "../components/common/ReusableTable";
import { popAlert, popDangerPrompt } from "../utils/alerts";
import colors from "../assets/styles/colors";
import TableAction from "../components/common/TableActions";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import ReportButton from "../components/common/ReportButton";
import ProductCard from "../components/common/ProductCard";
import ProductDelete from "../components/common/ProductDelete";
import { useParams } from "react-router-dom";
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import { useSelector } from "react-redux";
import { getAllTourGuides } from "../service/tourGuide.service";
import { verifyTourGuide } from "../service/tourGuide.service";
import tourGuide from "../models/tourGuide";
import { getDownloadURLFromFirebaseRef } from "../utils/firebase";

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "address",
    label: "Address",
    align: "left",
  },
  {
    id: "phone",
    label: "Mobile Number",
    align: "left",
  },
  {
    id: "verify",
    label: "Verification",
    align: "left",
  },
  {
    id: "certificate",
    label: "Certificate",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const TourGuides = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState(tourGuide);
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

  const handleSearch = (input) => {
    setKeyword(input);
  };

  const handleVerify = (tourGuide) => {
    setShowPopup(true);
    setInputs(tourGuide);
  };

  const handleDelete = () => {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await verifyTourGuide(inputs._id, inputs);

    if (response.success) {
      setRefresh(!refresh);
      response?.data &&
        popAlert("Success!", "Tour Guide Verification done", "success").then(
          (res) => {
            setShowPopup(false);
          }
        );
    } else {
      response?.data?.message &&
        popAlert("Error!", response?.data?.message, "error");
      response?.data?.data && setErrors(response.data.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getAllTourGuides(
        pagination.page,
        pagination.limit,
        pagination.orderBy
      );
      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const tourGuide of response.data.content) {
          const isVerified = tourGuide.tourGuide.isVerified ? "Yes" : "No";
          const pdfRef = tourGuide?.tourGuide.certificate?.firebaseStorageRef;
          if (pdfRef)
            tourGuide.certificate = await getDownloadURLFromFirebaseRef(pdfRef);

          tableDataArr.push({
            name: tourGuide.name,
            address: tourGuide.address,
            phone: tourGuide.mobileNumber,
            verify: isVerified,
            certificate: (
              <Link
                to={tourGuide.certificate}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PictureAsPdfIcon />
              </Link>
            ),
            action: (
              <TableAction
                id={tourGuide._id}
                onVerify={() => handleVerify(tourGuide)}
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
  }, [pagination, refresh]);

  return (
    <React.Fragment>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Tour Guides
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SearchBar
            onSearch={handleSearch}
            placeholderText="Search Tour Guides..."
          />
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
        title="Verify Tour Guides"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <Box sx={{ mb: 1 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ my: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Set Verification
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Set Verification"
                  value={inputs.tourGuide.isVerified}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      tourGuide: { isVerified: e.target.value },
                    })
                  }
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
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
    </React.Fragment>
  );
};

export default TourGuides;
