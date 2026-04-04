import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

export function DataTable({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  pageSize = 8,
  searchPlaceholder = "Search...",
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = data.filter((item) =>
    columns.some((col) => {
      const val = item[col.key];
      return val?.toString().toLowerCase().includes(search.toLowerCase());
    })
  );

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        const cmp =
          typeof aVal === "number"
            ? aVal - bVal
            : String(aVal).localeCompare(String(bVal));

        return sortDir === "asc" ? cmp : -cmp;
      })
    : filtered;

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="data-table">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-border">
        <h2 className="text-lg font-display font-semibold text-foreground">
          {title}
        </h2>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {onAdd && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Add
            </motion.button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() =>
                    col.sortable !== false && handleSort(col.key)
                  }
                  className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.sortable !== false
                      ? "cursor-pointer hover:text-foreground"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </span>
                </th>
              ))}

              {(onEdit || onDelete) && (
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paged.map((item, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-5 py-3.5 text-sm text-foreground"
                  >
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onEdit && (
                        <button onClick={() => onEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(item)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}

            {paged.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-5 py-12 text-center text-muted-foreground text-sm"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {page * pageSize + 1}–
            {Math.min((page + 1) * pageSize, sorted.length)} of{" "}
            {sorted.length}
          </p>

          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}>
                {i + 1}
              </button>
            ))}

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}