import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Typography } from "@mui/material";

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Box sx={{ flex: "100%" }} />
        <Typography variant="button">{window.location.host}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
