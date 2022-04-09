import { Alert, Box, CircularProgress, List, Typography } from "@mui/material";
import React from "react";
import { useQuery } from "react-query";
import CreateNote from "./CreateNoteButton";
import SearchTopic from "./SearchTopic";
import TopicListItem from "./TopicListItem";

const fetchTopics = async () => {
  const res = await fetch("/topics");
  return res.json();
};

const NoteList = () => {
  const { data, status, refetch } = useQuery("topics", fetchTopics, {});

  return (
    <>
      <Box m={1}>
        <Typography variant="h4">TOPICS</Typography>
      </Box>
      <SearchTopic refetch={refetch} />
      <Box>
        {status === "loading" && <CircularProgress />}
        {status === "error" && (
          <Box display={"flex"} justifyContent="center">
            <Alert severity="error" sx={{ width: "40%" }}>
              Couldn't load topics... reload and try again
            </Alert>
          </Box>
        )}
        {status === "success" && (
          <Box display={"flex"} justifyContent="center" m={2}>
            {data.length === 0 && <Alert severity="info">No topics</Alert>}
            {data.length > 0 && (
              <List
                sx={{
                  maxHeight: "600px",
                  position: "relative",
                  overflow: "auto",
                }}
              >
                {data.map((topic) => (
                  <TopicListItem key={topic._id} topic={topic} />
                ))}
              </List>
            )}
          </Box>
        )}
        <CreateNote />
      </Box>
    </>
  );
};

export default NoteList;
