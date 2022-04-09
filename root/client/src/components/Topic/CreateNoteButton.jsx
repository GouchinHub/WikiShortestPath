import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const CreateNote = () => {
  const [redirect, setRedirect] = useState(false);

  const redirectToAddNote = () => {
    setRedirect(true);
  };

  if (redirect) return <Navigate replace to="/addnote" />;

  return (
    <Box display={"flex"} justifyContent="center" m={2}>
      <Button variant="contained" onClick={(e) => redirectToAddNote()}>
        Add a new note
      </Button>
    </Box>
  );
};

export default CreateNote;
