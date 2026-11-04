// ICF practice scaffold — Node API (zero dependencies, Node 18+).
// Your job: implement the two endpoints below. Run `node test.js`
// (with this server running) to check yourself.
//
// Spec:
//   GET  /api/hospitals?measure=&state=&minScore=&sort=&order=&page=&pageSize=
//     - measure: one of readmission | mortality | safety | experience
//     - state:   2-letter state code, e.g. CA
//     - minScore: keep only hospitals whose score for `measure` is >= minScore
//       (if no measure is given, minScore applies to... decide and defend it)
//     - sort:    field to sort by: name | <a measure name>
//     - order:   asc | desc (default asc)
//     - page / pageSize: 1-based page, default page=1, pageSize=10
//     - Response shape: { data: [...], page, pageSize, total, totalPages }
//     - Errors: unknown measure -> 400 { error: "unknown measure" }
//   POST /api/compare   body: { ids: ["H001", "H005"] }
//     - Returns the 2-3 matching hospitals side by side: { data: [...] }
//     - Errors: not 2-3 ids, or an unknown id -> 400 with an error message.
//
// Edge cases the tests check: empty result set, invalid measure name,
// page beyond the last page, compare with an unknown id.

const http = require("http");
const hospitals = require("./data/hospitals.json");

const PORT = 3001;

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/api/hospitals") {
    // TODO: implement filtering, sorting, pagination.
    sendJson(res, 501, { error: "not implemented" });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/compare") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      // TODO: parse { ids }, validate, return matches.
      sendJson(res, 501, { error: "not implemented" });
    });
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`Practice API listening on http://localhost:${PORT}`);
});
