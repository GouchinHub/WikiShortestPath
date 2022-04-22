import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import PathListItem from "./PathListItem";

const Search = () => {
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [searchTime, setSearchTime] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [pathList, setPathList] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setDisabled(true);
    await fetch("/findpath", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: from,
        end: to,
      }),
    })
      .then((response) => {
        setIsSearching(false);
        setDisabled(false);
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setShowError(true);
          setShowList(false);
        } else {
          setShowError(false);
          setShowList(true);
          setPathList(data.shortest_paths);
          setSearchTime(data.execution_time_in_seconds);
        }
      });
  };

  return (
    <>
      <Box display={"flex"} justifyContent="center" flexDirection="row">
        <TextField
          required
          id="outlined-required"
          label="From"
          defaultValue={from}
          onChange={(e) => {
            setFrom(e.target.value);
          }}
        />
        <TextField
          required
          id="outlined-required"
          label="To"
          defaultValue={to}
          onChange={(e) => {
            setTo(e.target.value);
          }}
        />
        <Button
          variant="contained"
          disabled={disabled}
          onClick={(e) => submit(e)}
        >
          Find
        </Button>
      </Box>

      {isSearching && (
        <Box display={"flex"} justifyContent="center" m={2}>
          <CircularProgress />
        </Box>
      )}

      <Box display={"flex"} justifyContent="center" m={2}>
        {showError && <Alert severity="error">{error}</Alert>}
      </Box>

      {showList && (
        <Box display={"flex"} justifyContent="center" m={2}>
          {pathList.length === 0 && <Alert severity="info">No topics</Alert>}
          {pathList.length > 0 && (
            <Box
              display={"flex"}
              justifyContent="center"
              flexDirection="column"
              m={2}
            >
              <Alert severity="info">
                Search exectution took: {searchTime} seconds
              </Alert>

              <List
                sx={{
                  maxHeight: "600px",
                  position: "relative",
                  overflow: "auto",
                }}
              >
                {pathList.map((path) => (
                  <PathListItem key={path} path={path} />
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Search;
