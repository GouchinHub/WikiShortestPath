var express = require("express");
const { Result } = require("express-validator");
var router = express.Router();
const Topic = require("../models/topics.js");
const Wikipediadomain = "https://en.wikipedia.org/f/";
const fetch = require("node-fetch");

/* status codes */
const Ok = 200;
const ServiceUnavailable = 503;
const NoContent = 204;
const NotFound = 404;

/* Query snippet from wikipedia API with given searchterm */
async function fetchWikipediaText(searchterm) {
  console.log(searchterm);
  var url =
    Wikipediadomain +
    "api.php?action=query&list=search&format=json&srwhat=text&srsearch=" +
    searchterm;
  const response = await fetch(url).then((res) => {
    return res;
  });

  if (response.status === Ok) {
    var data = await response.json();
    if (data.query.search.length === 0) return NoContent;
    return data.query.search[0];
  } else {
    return null;
  }
}

/* Filter out html tags from wikipedia snippets */
function snippetWithoutHtmlTags(snippet) {
  const regex = /(<([^>]+)>)/gi;
  return snippet.replace(regex, "");
}

/* GET all snippets. */
router.get("/", async (req, res, next) => {
  Topic.find({}, (err, topics) => {
    if (err) return next(err);
    if (topics) {
      return res.json(topics);
    } else {
      return res.status(NotFound).send();
    }
  });
});

/* GET a wikipedia article based on the search term. */
router.get("/:searchterm", async (req, res, next) => {
  var result = await fetchWikipediaText(req.params.searchterm);

  if (result === NoContent) return res.status(NoContent).send();

  if (result === null) return res.status(ServiceUnavailable).send();

  Topic.findOne({ topic: req.params.searchterm }, (err, topic) => {
    if (err) return next(err);
    var note = {
      name: result.title,
      text: snippetWithoutHtmlTags(result.snippet),
    };
    if (!topic) {
      var noteList = [];
      noteList.push(note);
      new Topic({
        topic: req.params.searchterm,
        notes: noteList,
      }).save((err) => {
        if (err) return next(err);
        return res.send(result);
      });
    } else {
      var updatedNotes = topic.notes;
      updatedNotes.push(note);
      Topic.findByIdAndUpdate(
        topic._id,
        { notes: updatedNotes },
        function (err) {
          if (err) return next(err);
          return res.send(result);
        }
      );
    }
  });
});

/* POST a new note, or update if topic exists. */
router.post("/", async (req, res, next) => {
  Topic.findOne({ topic: req.body.topic }, (err, topic) => {
    if (err) return next(err);
    var note = {
      name: req.body.name,
      text: req.body.text,
    };
    if (!topic) {
      var noteList = [];
      noteList.push(note);
      new Topic({
        topic: req.body.topic,
        notes: noteList,
      }).save((err) => {
        if (err) return next(err);
        return res.send(req.body);
      });
    } else {
      var updatedNotes = topic.notes;
      updatedNotes.push(note);
      Topic.findByIdAndUpdate(
        topic._id,
        { notes: updatedNotes },
        function (err) {
          if (err) return next(err);
          return res.send(req.body);
        }
      );
    }
  });
});

module.exports = router;
