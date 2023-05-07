import React, { useEffect } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/SideBar";
import NavBar from "./components/common/NavBar";
import Dashboard from "./views/Dashboard";
import PageNotFound from "./views/PageNotFound";
import Hotels from "./views/Hotels";
import Attractions from "./views/Attractions";
import TourGuides from "./views/TourGuides";
import { useSelector } from "react-redux";
import SignIn from "./views/SignIn";

const App = () => {
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!window.location.href.includes("auth") && !authState?.isLoggedIn)
      window.location.replace("/auth/sign-in");
  }, [authState.isLoggedIn]);

  if (!window.location.href.includes("auth") && authState?.isLoggedIn) {
    return (
      <React.Fragment>
        <Stack flexDirection="row">
          <Box sx={{ width: "18vw" }}>
            <Sidebar />
          </Box>
          <Box sx={{ width: "80vw", padding: 3 }}>
            <Grid container>
              <Grid item xs={12}>
                <NavBar />
              </Grid>
              <Grid item xs={12} sx={{ pt: 3 }}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/hotel" element={<Hotels />} />
                    <Route path="/attractions" element={<Attractions />} />
                    <Route path="/tour-guides" element={<TourGuides />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </BrowserRouter>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </React.Fragment>
    );
  } else {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    );
  }
};
export default App;
