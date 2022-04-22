import { Box, Typography } from "@mui/material";
import React from "react";

const Banner = () => {
  return (
    <Box m={5}>
      <Typography variant="h3" sx={{ textTransform: "uppercase" }}>
        Wikipedia shortest path finder
      </Typography>
    </Box>
  );
};

export default Banner;
