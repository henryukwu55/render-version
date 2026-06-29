/**
 * utils/csv.js
 * Tiny CSV serializer — no external dependency needed for this.
 * Handles quoting fields that contain commas, quotes, or newlines.
 */

function escapeCsvField(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(rows, columns) {
  // columns: [{ key: "id", label: "ID" }, ...]
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvField(row[c.key])).join(","),
  );
  return [header, ...lines].join("\r\n");
}

module.exports = { rowsToCsv, escapeCsvField };
