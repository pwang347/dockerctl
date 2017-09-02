(function() {
  "use strict";
  // Initialize Dockerode
  //
  let Docker = require("dockerode");
  let options = {};
  if (process.platform === "win32") {
    options = {
      host: process.env.DOCKER_HOST || "127.0.0.1",
      port: process.env.DOCKER_PORT || 2375
    };
  } else {
    options = {
      socketPath: process.env.DOCKER_SOCKET_PATH || "/var/run/docker.sock"
    };
  }
  let docker = new Docker(options);

  // Create JSON-serving endpoints using Express
  //
  let express = require("express");
  let app = express();
  let bodyParser = require("body-parser");
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // API endpoints
  //
  // List all running containers
  app.get("/api/v1/containers", (req, res) =>
    docker.listContainers(function(err, containers) {
      res.json(containers);
    })
  );
  // List all available images
  app.get("/api/v1/images", (req, res) =>
    docker.listImages(function(err, images) {
      res.json(images);
    })
  );
  app.post("/api/v1/", function(req, res) {});

  // Start the Server
  //
  let server = require("http").Server(app);
  let port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log("API server listening on port " + port);
  });
})();
