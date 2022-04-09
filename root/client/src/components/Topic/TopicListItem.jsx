import { Box, Card, ListItem, Typography } from "@mui/material";
import React from "react";
import moment from "moment";

const TopicListItem = ({ topic }) => {
  return (
    <ListItem className="div">
      <Box width="600px">
        <Card>
          <Box m={2} flex={"auto"}>
            <Typography variant="h4">{topic.topic}</Typography>
            <Typography variant="h7">Notes</Typography>
            <Box m={1}></Box>
            {topic.notes.map((note) => (
              <Box m={1} key={note._id}>
                <Card>
                  <Box m={1} display={"flex"} flexDirection={"column"}>
                    <Typography variant="h5">{note.name}</Typography>
                  </Box>
                  <Box m={2} display={"flex"} flexDirection={"column"}>
                    <Typography variant="h7">{note.text}</Typography>
                  </Box>
                  <Box m={1}></Box>
                  <Typography variant="p">
                    Last updated:{" "}
                    {moment(note.timestamp).format("DD.MM.YYYY HH:mm")}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </ListItem>
  );
};

export default TopicListItem;
