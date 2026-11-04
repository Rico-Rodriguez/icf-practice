// YOUR 25 MINUTES GO HERE.
// Props: rows (hospital objects), status ("idle" | "loading" | "error" | "empty"),
// sort ({ field, order }), onSort (setSort), measure (the active measure key).
//
// Build a table with:
//   - Columns: Name, City, State, and the active measure's score.
//   - Clickable column headers that toggle sort asc/desc via onSort.
//   - A loading state, an error state, and an empty state ("No hospitals match").
//   - A selected row highlight is a bonus, not required.
//
// Row shape: { id, name, city, state, measures: { readmission, mortality, safety, experience } }
export default function HospitalsTable({ rows, status, sort, onSort, measure }) {
  // TODO: replace this placeholder with the real table.
  return (
    <div style={{ marginTop: "1rem", border: "1px dashed #999", padding: "1rem" }}>
      <p>
        TODO: render {rows.length} row(s) — status is “{status}”, sorted by {sort.field} {sort.order},
        measure is {measure}.
      </p>
    </div>
  );
}
