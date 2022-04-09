import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const SearchTopic = ({ refetch }) => {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (topic === "") {
      setError("Field cannot be left empty");
      setShowError(true);
      return;
    }

    var response = await fetch("/topics/" + topic).then((response) => response);

    if (response.status === 200) {
      setTopic("");
      setError("");
      setShowError(false);
      refetch();
    } else if (response.status === 204) {
      setError("No results for searchterm: " + topic);
      setShowError(true);
    } else if (response.status === 503) {
      setError("Could not connect to wikipedia.org");
      setShowError(true);
    } else {
      setError("Something went wrong...");
      setShowError(true);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <form>
        <Box m={1}>
          <TextField
            required
            id="outlined-required"
            placeholder="Search wikipedia for a topic"
            error={showError}
            helperText={error}
            value={topic}
            sx={{ width: "300px" }}
            inputProps={{ maxLength: 30 }}
            onChange={(e) => {
              setTopic(e.target.value);
            }}
          />
        </Box>
        <Box m={2}>
          <Button variant="contained" onClick={(e) => submit(e)}>
            Search
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SearchTopic;
