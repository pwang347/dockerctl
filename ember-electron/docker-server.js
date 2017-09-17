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

  // Dynamic API endpoints
  //
  let dockerFns = ["listContainers", "createContainer", "listImages"];
  for (let fn of dockerFns) {
    app.post(`/api/v1/${fn}`, (req, res) => {
      docker[fn](req.body)
        .then(data => res.json(data))
        .catch(error => res.status(500).send({ error }));
    });
  }
  let containerFns = [
    "inspect",
    "rename",
    "update",
    "top",
    "changes",
    "listCheckpoint",
    "deleteCheckpoint",
    "createCheckpoint",
    "export",
    "start",
    "pause",
    "unpause",
    "exec",
    "commit",
    "stop",
    "restart",
    "kill",
    "resize",
    "attach",
    "wait",
    "remove",
    "copy",
    "getArchive",
    "infoArchive",
    "putArchive",
    "logs",
    "stats"
  ];
  for (let fn of containerFns) {
    app.post(`/api/v1/containers/:id/${fn}`, (req, res) => {
      docker
        .getContainer(req.params.id)
        [fn](req.body)
        .then(data => res.json(data))
        .catch(error => res.status(500).send({ error }));
    });
  }
  let imageFns = ["start", "stop", "remove", "inspect", "rename"];
  for (let fn of imageFns) {
    app.post(`/api/v1/images/:id/${fn}`, (req, res) => {
      docker
        .getContainer(req.params.id)
        [fn](req.body)
        .then(data => res.json(data))
        .catch(error => res.status(500).send({ error }));
    });
  }
  //
  // Start the Server
  //
  let server = require("http").Server(app);
  let port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log("API server listening on port " + port);
  });
})();
