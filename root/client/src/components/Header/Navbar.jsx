import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Box, Typography } from "@mui/material";

const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <Button variant="h6" href="/">
          Topics
        </Button>
        <Button variant="h6" href="/addnote" sx={{ flex: "none" }}>
          Add note
        </Button>
        <Box sx={{ flex: "100%" }} />
        <Typography variant="button" href="/addnote">
          {window.location.host}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
