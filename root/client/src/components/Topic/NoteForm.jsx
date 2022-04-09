import { Alert, Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

const NoteForm = () => {
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (topic === "" || name === "" || text === "") {
      setError("Fields cannot be left empty");
      setShowError(true);
      return;
    }
    var response = await fetch("/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic,
        name: name,
        text: text,
      }),
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });

    if (response.status === 200) {
      setTopic("");
      setName("");
      setText("");
      window.location.href = "/";
    } else {
      setError("Something went wrong... reload and try again");
      setShowError(true);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <form>
        <Box m={1}>
          <Typography variant="h4">NEW NOTE</Typography>
        </Box>
        {showError && (
          <Box display={"flex"} flexDirection={"column"} alignItems="center">
            <Alert severity="error" sx={{ width: "40%" }}>
              {error}
            </Alert>
          </Box>
        )}
        <Box m={1}>
          <TextField
            required
            error={false}
            helperText=""
            id="outlined-required"
            placeholder="Topic"
            defaultValue={topic}
            sx={{ width: "300px" }}
            inputProps={{ maxLength: 30 }}
            onChange={(e) => {
              setTopic(e.target.value);
            }}
          />
        </Box>
        <Box m={1}>
          <TextField
            required
            id="outlined-required"
            placeholder="Name"
            defaultValue={topic}
            sx={{ width: "40%" }}
            inputProps={{ maxLength: 30 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Box>
        <TextField
          placeholder="Your note"
          multiline
          rows={15}
          sx={{ width: "60%" }}
          defaultValue={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <Box m={2}>
          <Button variant="contained" onClick={(e) => submit(e)}>
            ADD
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NoteForm;
