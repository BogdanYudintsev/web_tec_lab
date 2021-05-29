const request = require('supertest');
var app = require('./app');

describe("GET /api/contactrequest", () => {
    it("Respond with json", done => {
        request(app)
            .get('/api/contactrequest')
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
