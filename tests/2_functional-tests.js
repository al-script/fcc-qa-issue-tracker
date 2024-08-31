const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // may want to go back and add text to each test to describe each subtest

  // 1
  test("Create an issue with every field: POST request to /api/issues/{project}", function () {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "title",
        issue_text: "text",
        created_by: "created_by",
        assigned_to: "assigned_to",
        status_text: "status_text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.created_by, "created_by");
        assert.equal(res.body.assigned_to, "assigned_to");
        assert.equal(res.body.status_text, "status_text");
        assert.equal(res.body.open, true);
        assert.property(res.body, "_id");
        assert.property(res.body, "created_on");
        assert.property(res.body, "updated_on");
      });
  });

  // 2
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function () {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "title",
        issue_text: "text",
        created_by: "created_by",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.created_by, "created_by");
        assert.equal(res.body.open, true);
        assert.property(res.body, "_id");
        assert.property(res.body, "created_on");
        assert.property(res.body, "updated_on");
      });
  });

  // 3
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function () {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .send({
        issue_title: "title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
      });
  });

  // 4
  test("View issues on a project: GET request to /api/issues/{project}", function () {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 2);
      });
  });

  // 5
  test("View issues on a project with one filter: GET request to /api/issues/{project}", function () {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 2);
      });
  });

  // 6
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function () {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true&_id=1a")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.lengthOf(res.body, 1);
      });
  });

  // 7
  test("Update one field on an issue: PUT request to /api/issues/{project}", function () {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "1",
        issue_title: "updated_title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
      });
  });

  // 8
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function () {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "1",
        issue_title: "updated_title",
        issued_text: "updated_text",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, "1");
      });
  });

  // 9
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function () {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        issue_title: "updated title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
      });
  });

  // 10
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function () {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, "1");
      });
  });

  // 11
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function () {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: "2",
        issue_title: "updated title",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "2");
      });
  });

  // 12
  test("Delete an issue: DELETE request to /api/issues/{project}", function () {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, "1");
      });
  });

  // 13
  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function () {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({
        _id: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "2");
      });
  });

  // 14
  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function () {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
      });
  });
});
