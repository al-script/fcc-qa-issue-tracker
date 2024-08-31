"use strict";

module.exports = function (app) {
  let id = "1";
  let projectObject = {};

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let projectQueried = projectObject[project];

      let query = req.query;
      if (query.open == "true") {
        query.open = true;
      }
      if (query.open == "false") {
        query.open = false;
      }

      // help from: https://stackoverflow.com/questions/69010671/filter-an-array-of-objects-by-another-object-of-filters
      let filteredQuery = projectQueried.filter((o) =>
        Object.keys(query).every((k) => query[k] === o[k])
      );

      if (query == {}) {
        res.json(projectQueried);
      } else {
        res.json(filteredQuery);
      }

      // do I need to handle an invalid query? aka query that contains fields that dont exist?
    })

    .post(function (req, res) {
      // console.log('***')
      // console.log(req.params)
      // console.log('***')
      // console.log(req.body)
      let project = req.params.project;
      // console.log(req.params.project);

      if (!projectObject[project]) {
        projectObject[project] = [];
      }

      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_by = req.body.created_by;

      let assigned_to = req.body.assigned_to || "";
      let status_text = req.body.status_text || "";

      let created_on = new Date().toISOString();
      let updated_on = new Date().toISOString();
      let open = true;
      let _id = id;

      let objectToReturn = {
        assigned_to: assigned_to,
        status_text: status_text,
        open: true,
        _id: _id,
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        created_on: created_on,
        updated_on: updated_on,
      };

      if (!issue_title || !issue_text || !created_by) {
        // console.log('ERROR')
        res.json({ error: "required field(s) missing" });
      } else {
        // console.log('SUCCESS')
        // console.log(id)
        projectObject[project].push(objectToReturn);
        res.json(objectToReturn);
        // console.log(projectObject)
        id += "a"; // make this more elegant, use a function to randomly gen an id that doesn't exist
        // console.log(id)
      }
    })

    .put(function (req, res) {
      let project = req.params.project;

      // console.log('req.body:', req.body)

      let id = req.body._id;
      if (!id) {
        res.json({ error: "missing _id" });
      } else {
        let updatedIssueTitle = req.body.issue_title;
        let updatedIssueText = req.body.issue_text;
        let updatedCreatedBy = req.body.created_by;
        let updatedAssignedTo = req.body.assigned_to;
        let updatedStatusText = req.body.status_text;
        let closeIssue = req.body.open;
        if (
          !updatedIssueTitle &&
          !updatedIssueText &&
          !updatedCreatedBy &&
          !updatedAssignedTo &&
          !updatedStatusText &&
          !closeIssue
        ) {
          res.json({ error: "no update field(s) sent", _id: id });
        } else if (
          updatedIssueTitle ||
          updatedIssueText ||
          updatedCreatedBy ||
          updatedAssignedTo ||
          updatedStatusText ||
          closeIssue
        ) {
          let indexToUpdate = projectObject[project].findIndex(
            (x) => x._id == id
          );
          let issueToUpdate = projectObject[project][indexToUpdate];

          if (issueToUpdate == undefined) {
            res.json({ error: "could not update", _id: id });
          } else {
            // console.log('issueToUpdate:', issueToUpdate)

            if (updatedIssueTitle) {
              issueToUpdate.issue_title = updatedIssueTitle;
            }
            if (updatedIssueText) {
              issueToUpdate.issue_text = updatedIssueText;
            }
            if (updatedCreatedBy) {
              issueToUpdate.created_by = updatedCreatedBy;
            }
            if (updatedAssignedTo) {
              issueToUpdate.assigned_to = updatedAssignedTo;
            }
            if (updatedStatusText) {
              issueToUpdate.status_text = updatedStatusText;
            }
            if (closeIssue) {
              issueToUpdate.open = false;
            }
            issueToUpdate.updated_on = new Date().toISOString();

            res.json({ result: "successfully updated", _id: id });

            // console.log('issueToUpdate after updating:', issueToUpdate)
            // console.log('project after updating:', projectObject[project])
            // console.log('projectObject after updating:', projectObject)
          }
        } else {
          res.json({ error: "could not update", _id: id });
        }
      }
    })

    .delete(function (req, res) {
      let project = req.params.project;
      let id = req.body._id;
      if (!id) {
        res.json({ error: "missing _id" });
      } else {
        let indexToDelete = projectObject[project].findIndex(
          (x) => x._id == id
        );
        let issueToDelete = projectObject[project][indexToDelete];
        if (issueToDelete == undefined) {
          res.json({ error: "could not delete", _id: id });
        } else if (issueToDelete) {
          projectObject[project].splice(indexToDelete, 1);
          res.json({ result: "successfully deleted", _id: id });
        } else {
          res.json({ error: "could not delete", _id: id });
        }
      }
    });
};
