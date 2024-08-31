"use strict";

module.exports = function (app) {
  let id = "1";
  let projectObject = {};

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      let projectQueried = projectObject[project];

      // handle filtering based on query
      // check the url being requested to make sure arent missing any queries

      console.log("query:", req.query);
      // filter objects to return from an array based on a query
      // get the objects to return, add them to an array, and then return that array

      // get the query
      let query = req.query;

      //    // can I do this with a function or will I have to manually do it for the available fields?

      //    // filter the query
      //    // let filteredQuery = projectToReturn.filter(x => )

      // let testQuery = {
      //    _id: 'id',
      //    issue_title: 'issuetitle',
      //    issue_text: 'issuetext',
      //    created_on: 'createdon',
      //    created_by: 'createdby',
      //    assigned_to: 'assignedto',
      //    open: 'open',
      //    status_text: 'statustext'
      //  }

      //    // manual method

      //    let idFilter, issueTitleFilter, issueTextFilter, createdOnFilter, updatedOnFilter, createdByFilter, assignedToFilter, openFilter, statusTextFilter

      //      // filter one by one and then filter that contains all?
      //      if (query._id) { idFilter = projectQueried.filter(x => x) }

      //    // test if each query exists, and if it does then add that query to the filterQuery string in proper filter format, eg concat && that filter to the end of it
      //    let filterQuery
      //    if (query._id) { filterQuery }
      //    // then, execute a filter based on the filter string
      //    let filteredQuery = projectQueried.filter(filterQuery);

      //    // or, perhaps can filter based on the query object itself

      let filteredQuery = projectQueried.filter((o) =>
        Object.keys(query).every((k) => query[k] === o[k])
      );

      if (query == {}) {
        res.json(projectQueried);
      } else {
        res.json(filteredQuery);
      }

      // handle an invalid query? aka query that contains fields that dont exist?
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
