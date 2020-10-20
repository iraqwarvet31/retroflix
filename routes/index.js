const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const fs = require("fs");

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    name: req.user.name,
  })
);

// Movie links object
const movieLinks = {
  FREDDY1: "public/movies/noes1.mp4",
  FREDDY2: "public/movies/noes2.mp4",
  FREDDY3: "public/movies/noes3.mp4",
  FREDDY4: "public/movies/noes4.mp4",
  GOONIES: "public/movies/goonies.mp4",
  FERRIS: "public/movies/bueller.mp4",
  HELL: "public/movies/hellraiser.mp4",
  BTF1: "public/movies/btf1.mp4",
  BTF2: "public/movies/btf2.mp4",
  BTF3: "public/movies/btf3.mp4",
  GREMLINS1: "public/movies/gremlins1.mp4",
  GREMLINS2: "public/movies/gremlins2.mp4",
  STANDBYME: "public/movies/standbyme.mp4",
  JASON1: "public/movies/friday13.mp4",
  JASON2: "public/movies/friday13-2.mp4",
  TEMPLEDOOM: "public/movies/templedoom.mp4",
  LASTCRUSADE: "public/movies/lastcrusade.mp4",
  POLTERGEIST: "public/movies/poltergeist.mp4",
  TOTALRECALL: "public/movies/totalrecall.mp4",
  DUMB: "public/movies/dumb.mp4",
  FEARNLOATHING: "public/movies/fearnloathing.mp4",
  FIGHTCLUB: "public/movies/fightclub.mp4",
  FRIDAY: "public/movies/friday.mp4",
  TERMINATOR2: "public/movies/terminator2.mp4",
  DOORS: "public/movies/doors.mp4",
  SHAWSHANK: "public/movies/shawshank.mp4",
  ACEVENTURA1: "public/movies/aceventura1.mp4",
  CASTAWAY: "public/movies/castaway.mp4",
  GLADIATOR: "public/movies/gladiator.mp4",
  INTOWILD: "public/movies/intowild.mp4",
  STEPBROS: "public/movies/stepbros.mkv",
  GIRLNEXTDOOR: "public/movies/girlnextdoor.mp4",
  TRAININGDAY: "public/movies/trainingday.mp4",
  WALKLINE: "public/movies/walkline.mp4",
  WALKHARD: "public/movies/walkhard.mp4",
};

// Videos
router.get("/video", ensureAuthenticated, function (req, res) {
  var id = req.query.id;
  let path = "";

  for (let k in movieLinks) {
    if (k === id) {
      path = movieLinks[k];
    }
  }
  // const path = "public/movies/noes2.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    console.log("RANGE: " + start + " - " + end + " = " + chunkSize);

    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
  // res.render('video', {layout: 'videoLayout'});
});

module.exports = router;
