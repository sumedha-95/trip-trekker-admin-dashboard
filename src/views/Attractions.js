import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "../components/common/SearchBar";
import AddButton from "../components/common/AddButton";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import Popup from "../components/common/Popup";
import ReusableTable from "../components/common/ReusableTable";
import TableAction from "../components/common/TableActions";
import ReportButton from "../components/common/ReportButton";
import { useSelector } from "react-redux";
import AttractionForm from "../components/attraction/AttractionForm";
import constants from "../constants";
import { getPaginatedAttractions } from "../service/attraction.service";

//table columns
const tableColumns = [
  {
    id: "name",
    label: "Name",
    align: "left",
  },
  {
    id: "open",
    label: "Open At",
    align: "left",
  },
  {
    id: "close",
    label: "Close At",
    align: "left",
  },
  {
    id: "accessibilityOptions",
    label: "Accessibility Options",
    align: "left",
  },
  {
    id: "action",
    label: "Action",
    align: "right",
  },
];

const Attractions = () => {
  const authState = useSelector((state) => state.auth);
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    orderBy: "desc",
  });
  const [tableRows, setTableRows] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page: page });
  };

  const handleLimitChange = (limit) => {
    setPagination({ ...pagination, limit: limit });
  };

  const handlePopupClose = () => setShowPopup(false);
  const handleUpdatePopupClose = () => setShowUpdatePopup(false);

  const handleOnCreationSuccess = (data) => {
    handlePopupClose();
    setRefresh(!refresh);
  };

  const handleEdit = () => {
    setShowUpdatePopup(true);
  };

  const handleDelete = (id) => {};

  const handleSearch = (input) => {
    setKeyword(input);
  };

  //get paginated Hotel
  useEffect(() => {
    let unmounted = false;

    if (!unmounted) setIsLoading(true);

    const fetchAndSet = async () => {
      const response = await getPaginatedAttractions(
        keyword,
        pagination.page,
        pagination.limit,
        pagination.orderBy
      );
      if (response.success) {
        if (!response.data) return;

        let tableDataArr = [];
        for (const attraction of response.data.content) {
          tableDataArr.push({
            name: attraction.name,
            open: attraction.openHours.open.substring(11, 16),
            close: attraction.openHours.close.substring(11, 16),
            accessibilityOptions: attraction.accessibilityOptions
              .map((item) => item)
              .join(", "),
            action: (
              <TableAction
                id={attraction._id}
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
  }, [pagination, keyword, refresh]);

  useEffect(() => {
    if (!window.location.href.includes("auth") && !authState?.isLoggedIn)
      window.location.replace("/auth/sign-in");
  }, [authState.isLoggedIn]);

  return (
    <React.Fragment>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Attractions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <SearchBar
            onSearch={handleSearch}
            placeholderText="Search Attractions..."
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

      {/* add popup */}
      <Popup
        title="Add Attractions"
        width={800}
        show={showPopup}
        onClose={handlePopupClose}
      >
        <AttractionForm
          type={constants.FORM_TYPE.CREATE}
          onSuccess={handleOnCreationSuccess}
        />
      </Popup>

      {/* update popup */}
      <Popup
        title="Update Attractions"
        width={800}
        show={showUpdatePopup}
        onClose={handleUpdatePopupClose}
      ></Popup>
    </React.Fragment>
  );
};

export default Attractions;
