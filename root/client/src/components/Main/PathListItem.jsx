import { Box, ListItem, Typography } from "@mui/material";
import React from "react";

const PathListItem = ({ path }) => {
  return (
    <ListItem className="div">
      <Box display={"flex"} flexDirection="row" alignItems={"baseline"}>
        <Typography variant="h5">{"Path: "}</Typography>
        <Typography variant="h6">{path[0] + " --> "}</Typography>
        {path.map((node) => (
          <>
            {node !== path[0] && node !== path[path.length - 1] && (
              <Typography variant="h6">{node + " --> "}</Typography>
            )}
          </>
        ))}
        <Typography variant="h6">{path[path.length - 1]}</Typography>
      </Box>
    </ListItem>
  );
};

export default PathListItem;
