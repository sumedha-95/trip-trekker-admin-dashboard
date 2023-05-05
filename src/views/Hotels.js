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
import EditButton from "../components/common/EditButton";
import DeleteButton from "../components/common/DeleteButton";
import { useSelector } from "react-redux";

//table columns
const tableColumns = [ 
  {
    id: "name",
    label: "Name",
    align: "center",
  },
  {
    id: "unit",
    label: "UoM",
    align: "left",
  },
  {
    id: "unitAmount",
    label: "Units",
    align: "left",
  },
    {
    id: "price",
    label: "Price",
    align: "left",
  },
  {
    id: "seller",
    label: "Seller",
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    align: "left",
  },
  {
    id: "updatedAt",
    label: "Date",
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
  console.log("ado weda karapan",id);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState('');
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
  const [isSeller,setisSeller] = useState(false)

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

    useEffect(() => {

    if (authState.user.role == 'seller') {
      setisSeller(true)
    }
    
    if (!window.location.href.includes("auth") && !authState?.isLoggedIn)
      window.location.replace("/auth/sign-in");
  }, [authState.isLoggedIn]);

   
  const handleSubmit = () => {
    
  }

  const handleClear = () => {
    
  }
  
  const updateSubmit = () => {

  }

  const handleUpdateClear = () => {
    
  }

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
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    description: e.target.value,
                  })
                }
              />
              {errors["description"] && (
                <Typography color="error">
                  {errors["description"]}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="price"
                variant="filled"
                label="Product Price"
                fullWidth
                value={inputs.price}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    price: e.target.value,
                  })
                }
              />
              {errors["price"] && (
                <Typography color="error">{errors["price"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="unit"
                variant="filled"
                label="Units"
                fullWidth
                value={inputs.unit}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    unit: e.target.value,
                  })
                }
              />
              {errors["unit"] && (
                <Typography color="error">{errors["unit"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 1 }}>
              <TextField
                name="unitAmount"
                variant="filled"
                label="Unit Amount"
                fullWidth
                value={inputs.unitAmount}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    unitAmount: e.target.value,
                  })
                }
              />
              {errors["unitAmount"] && (
                <Typography color="error">{errors["unitAmount"]}</Typography>
              )}
            </Box>
           <Box sx={{ mb: 1 }}>
  <Typography>File</Typography>
  <input
    name="file"
    type="file"
    onChange={(e) => {
      const file = e.target.files[0];
      setInputs({
        ...inputs,
        file: file,
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
            <Popup title='Update Hotel' width={800} show={showUpdatePopup} onClose={handleUpdatePopupClose}>
        <Box sx={{ mb: 1 }}>
        
          <form onSubmit={updateSubmit} >
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
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    description: e.target.value,
                  })
                }
              />
              {errors["description"] && (
                <Typography color="error">
                  {errors["description"]}
                </Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="price"
                variant="filled"
                label="Product Price"
                fullWidth
                value={inputs.price}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    price: e.target.value,
                  })
                }
              />
              {errors["price"] && (
                <Typography color="error">{errors["price"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="unit"
                variant="filled"
                label="Units"
                fullWidth
                value={inputs.unit}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    unit: e.target.value,
                  })
                }
              />
              {errors["unit"] && (
                <Typography color="error">{errors["unit"]}</Typography>
              )}
            </Box>
            <Box sx={{ mb: 1 }}>
              <TextField
                name="unitAmount"
                variant="filled"
                label="Unit Amount"
                fullWidth
                value={inputs.unitAmount}
                type="number"
                InputProps={{ inputProps: { min: 0 }, shrink: "true" }}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    unitAmount: e.target.value,
                  })
                }
              />
              {errors["unitAmount"] && (
                <Typography color="error">{errors["unitAmount"]}</Typography>
              )}
            </Box>

            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="reset"
                variant="contained"
                onClick={handleUpdateClear}
                sx={{ py: 2, px: 5, mr: 2, backgroundColor: colors.grey }}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ py: 2, px: 5 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress color="secondary" /> : "Save"}
              </Button>
            </Box>
          </form>
        </Box>
      </Popup>      
      {/* custom popup */}
      <Popup width={700} show={showDeletePopup} onClose={handleDeletePopupClose}>
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ mt: 2 }}>
                        {loading ? (
                            <Box
                                sx={{
                                    width: '100%',
                                    mt: '3%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
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