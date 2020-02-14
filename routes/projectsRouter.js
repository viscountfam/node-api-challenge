const express = require("express");
const projectdb = require(`../data/helpers/projectModel.js`)
const router = express.Router();


router.get("/", (req, res) => {
    projectdb.get()
        .then(projects => {
            res.status(200).json(projects)
        }).catch(error => {
            console.log(error)
            res.status(500).json({message: "Unable to retrieve projects"})
        })
})

router.get("/:id", validateProjectId, (req, res) => {
    projectdb.get(req.params.id)
        .then(project => {
            res.status(200).json(project)
        }).catch(error => {
            console.log(error)
            res.status(500).json({message: "Unable to retrieve project"})
        })
})

router.get("/:id/actions", validateProjectId, (req, res) => {
    projectdb.getProjectActions(req.params.id)
        .then(actions => {
            res.status(200).json(actions)
        }).catch(error => {
            console.log(error)
            res.status(500).json({message: "Unable to retrieve the actions for this project"})
        })
})

router.post("/", validateProject, (req, res) => {
    projectdb.insert(req.body)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: "The new project could not be added"})
        })
})

router.put("/:id", validateProjectId, validateProject, (req, res) => {
    projectdb.update(req.params.id, req.body)
        .then(updatedProject => {
            res.status(200).json(updatedProject)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "update unsuccessful"})
        })
})

router.delete("/:id", validateProjectId, (req, res) => {
    projectdb.remove(req.params.id)
        .then(count => {
            res.status(200).json(count)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ message: "Deletion failed"})
        })
})

function validateProjectId(req, res, next) {
    projectdb.get(req.params.id)
        .then(project => {
            console.log("project exists", project);
            if (project) {
                req.project = project
                next();
            } else {
                res.status(404).json({message: "no project with that id exists"})
            }
        })
}

function validateProject(req, res, next) {
    if(!req.body) {
        res.status(400).json({message: "Missing project data"});
    } else if(!req.body.name || !req.body.description){
        res.status(400).json({ message: "missing required name or description"});
    } else {
        next();
    }
}

module.exports = router;