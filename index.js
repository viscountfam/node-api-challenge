const express = require("express");
const cors = require("cors");
const projectsRouter = require(`./routes/projectsRouter.js`);
const server = express();

server.use(express.json());
server.use(cors());
server.use(logger);
server.use("/api/projects", projectsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2> Welcome to the project helper API</h2>`);
});

function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.originalUrl} at ${new Date()}`);
  next();
}

const port = 8000;
server.listen(port, () => console.log(`\n** API listening on ${port} **\n`));
