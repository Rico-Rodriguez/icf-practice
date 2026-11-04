// Test harness for the ICF practice API.
// Usage: start the server first (`node server.js`), then `node test.js`.
// Exit code 0 = all pass, 1 = something failed.

const BASE = "http://localhost:3001";
const MEASURES = ["readmission", "mortality", "safety", "experience"];

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond, detail = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    failures.push(name);
    console.log(`  FAIL  ${name}${detail ? " — " + detail : ""}`);
  }
}

async function get(path) {
  const res = await fetch(BASE + path);
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

async function post(path, obj) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

// Safe accessor: unimplemented endpoints return { error } with no data array,
// which must read as FAIL, never crash the harness.
const arr = (b) => (Array.isArray(b.data) ? b.data : []);

(async () => {
  console.log("ICF practice API checks:\n");

  // 1. Baseline: unfiltered list returns data + paging metadata.
  let r = await get("/api/hospitals");
  check("GET /api/hospitals returns 200", r.status === 200, `got ${r.status}`);
  check("response has data array + total", Array.isArray(r.body.data) && typeof r.body.total === "number");
  check("total matches dataset (24)", r.body.total === 24, `got ${r.body.total}`);

  // 2. State filter.
  r = await get("/api/hospitals?state=CA");
  check("state=CA returns only CA rows", arr(r.body).every((h) => h.state === "CA") && r.body.total === 6, `total=${r.body.total}`);

  // 3. Measure + minScore filter.
  r = await get("/api/hospitals?measure=mortality&minScore=93");
  check(
    "measure=mortality&minScore=93 filters correctly",
    arr(r.body).length > 0 && arr(r.body).every((h) => h.measures.mortality >= 93),
    `got ${arr(r.body).length} rows`
  );

  // 4. Combined filter: state + measure + minScore.
  r = await get("/api/hospitals?state=CA&measure=safety&minScore=88");
  check(
    "state=CA + safety>=88 returns Cedars-Sinai + UCLA only",
    r.body.total === 2 && arr(r.body).map((h) => h.id).sort().join() === "H005,H006",
    `got ${arr(r.body).map((h) => h.id).join()}`
  );

  // 5. Sorting.
  r = await get("/api/hospitals?sort=mortality&order=desc&pageSize=3");
  const scores = arr(r.body).map((h) => h.measures.mortality);
  check("sort=mortality desc orders correctly", scores[0] === 96 && scores[0] >= scores[1] && scores[1] >= scores[2], `got ${scores.join()}`);
  r = await get("/api/hospitals?sort=name&order=asc&pageSize=24");
  const names = arr(r.body).map((h) => h.name);
  const sorted = [...names].sort();
  check("sort=name asc orders correctly", names.length === 24 && names.join() === sorted.join());

  // 6. Pagination.
  r = await get("/api/hospitals?page=2&pageSize=10");
  check("page 2 of 10 returns 10 rows", arr(r.body).length === 10 && r.body.page === 2);
  check("totalPages is 3 for 24 rows at 10/page", r.body.totalPages === 3, `got ${r.body.totalPages}`);
  const p1 = await get("/api/hospitals?page=1&pageSize=10");
  check("pages 1 and 2 do not overlap", arr(p1.body).length === 10 && !arr(p1.body).some((h) => arr(r.body).map((x) => x.id).includes(h.id)));

  // 7. Edge cases.
  r = await get("/api/hospitals?state=ZZ");
  check("unknown state returns empty data, not an error", r.status === 200 && r.body.total === 0);
  r = await get("/api/hospitals?measure=bogus");
  check("unknown measure returns 400", r.status === 400, `got ${r.status}`);
  r = await get("/api/hospitals?page=99&pageSize=10");
  check("page beyond last returns empty data", r.status === 200 && arr(r.body).length === 0);

  // 8. Compare endpoint.
  r = await post("/api/compare", { ids: ["H001", "H005"] });
  check("compare returns both hospitals", r.status === 200 && arr(r.body).length === 2);
  r = await post("/api/compare", { ids: ["H001"] });
  check("compare with 1 id returns 400", r.status === 400, `got ${r.status}`);
  r = await post("/api/compare", { ids: ["H001", "H999"] });
  check("compare with unknown id returns 400", r.status === 400, `got ${r.status}`);
  r = await post("/api/compare", { ids: ["H011", "H012", "H013"] });
  check("compare accepts 3 ids", r.status === 200 && arr(r.body).length === 3);

  console.log(`\n${passed} passed, ${failed} failed.`);
  if (failed) console.log("Failing checks: " + failures.join(", "));
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error("Harness error — is the server running on :3001?\n" + err.message);
  process.exit(1);
});
