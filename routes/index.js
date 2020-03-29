const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const fs = require("fs");

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => 
  res.render("dashboard", {
      name: req.user.name
  }))

// Movie links object
const movieLinks = {
  FREDDY1 : "public/movies/noes2.mp4"
}

// Videos
router.get("/video", function(req, res) {
  var id = req.query.id;
  let path = "";
  
  for (let k in movieLinks) {
    if (k === id) {
      path = movieLinks[k]
    }
  }
  // const path = "public/movies/noes2.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0],10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(path, {start,end} );
    const head = {
      'Content-Range' : `bytes ${start}-${end}/${fileSize}`,
      'Content-Ranges' : 'bytes',
      'Content-Length' : chunkSize,
      'Content-Type' : 'video/mp4'
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length' : fileSize,
      'Content-Type' : 'video/mp4'
    }
    res.writeHead(200,head);
    fs.createReadStream(path).pipe(res);
  }
  // res.render('video', {layout: 'videoLayout'});
})

module.exports = router;