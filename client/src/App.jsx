import { useEffect, useState } from "react";
import HospitalsTable from "./HospitalsTable.jsx";

// The fetch + filter-state plumbing is given, so your 25 minutes go to the
// table component itself (see HospitalsTable.jsx). The API is expected on
// :3001 (or proxied through Vite, see vite.config.js).
export default function App() {
  const [measure, setMeasure] = useState("mortality");
  const [state, setState] = useState("");
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | empty
  const [sort, setSort] = useState({ field: "name", order: "asc" });

  useEffect(() => {
    const params = new URLSearchParams({ measure, sort: sort.field, order: sort.order, pageSize: "24" });
    if (state) params.set("state", state);
    setStatus("loading");
    fetch(`/api/hospitals?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setRows(json.data || []);
        setStatus(json.data && json.data.length ? "idle" : "empty");
      })
      .catch(() => setStatus("error"));
  }, [measure, state, sort]);

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Hospital quality — practice table</h1>
      <label>
        Measure{" "}
        <select value={measure} onChange={(e) => setMeasure(e.target.value)}>
          <option value="readmission">Readmission</option>
          <option value="mortality">Mortality</option>
          <option value="safety">Safety</option>
          <option value="experience">Patient experience</option>
        </select>
      </label>{" "}
      <label>
        State{" "}
        <input
          value={state}
          onChange={(e) => setState(e.target.value.toUpperCase())}
          placeholder="e.g. CA (blank = all)"
          maxLength={2}
          style={{ width: 90 }}
        />
      </label>
      <HospitalsTable rows={rows} status={status} sort={sort} onSort={setSort} measure={measure} />
    </main>
  );
}
