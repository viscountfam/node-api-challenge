const express = require("express")
const actionsdb = require(`../data/helpers/actionModel.js`)
const router = express.Router();

router.get("/", (req, res) => {
    actionsdb.get()
        .then(actions => {
            res.status(200).json(actions)
        }).catch(error => {
            console.log(error)
            res.status(500).json({message: "Unable to retrieve actions"})
        })
})

router.post("/", validateActionId, validateActions, (req, res) => {
    actionsdb.insert(req.body)
        .then(action=> {
            res.status(201).json(action)
        })
        .catch(err => {
            console.log(error)
            res.status(500).json({message: "The new action could not be added"})
        })
})

router.put("/:id", validateActionId, validateActions, (req, res) => {
    actionsdb.update(req.params.id, req.body)
        .then(updatedaction => {
            res.status(200).json(updatedaction)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "update unsuccessful"})
        })
})

router.delete("/:id", validateActionId, (req, res) => {
    actionsdb.remove(req.params.id)
        .then(count => {
            res.status(200).json(count)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ messaage: "Deletion failed"})
        })
})

function validateActionId(req, res, next) {
    actionsdb.get(req.params.id)
        .then(action => {
            console.log("project exists", action);
            if (action) {
                req.action = action
                next();
            } else {
                res.status(404).json({message: "no project with that id exists"})
            }
        })
}

function validateActions(req, res, next) {
    if(!req.body) {
        res.status(400).json({message: "Missing action data"})
    } else if (!req.body.name || !req.body.description || !req.body.notes) {
        res.status(400).json({ message: "missing required name, description or notes"})
    } else {
        next();
    }
}

module.exports = router;