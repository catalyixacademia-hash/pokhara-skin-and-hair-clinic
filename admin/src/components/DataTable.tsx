import { type ReactNode } from 'react';

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
};

type DataTableProps<T extends { id: string }> = {
  columns: Column<T>[];
  rows: T[];
  search: string;
  onSearchChange: (v: string) => void;
  onDelete: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  viewLabel?: string;
  editLabel?: string;
  toolbar?: ReactNode;
  extraActions?: (row: T) => ReactNode;
};

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  search,
  onSearchChange,
  onDelete,
  onView,
  onEdit,
  viewLabel = 'View',
  editLabel = 'Edit',
  toolbar,
  extraActions,
}: DataTableProps<T>) {
  return (
    <div className="admin-card">
      <div className="mb-4 flex flex-wrap items-center gap-3 justify-between">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="admin-input w-full sm:max-w-xs"
        />
        {toolbar}
      </div>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="py-3 pr-4 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="py-3 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-3.5 pr-4">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
                <td className="py-3.5">
                  <div className="flex flex-wrap gap-2 items-center justify-end min-w-[9rem]">
                    {extraActions?.(row)}
                    {onView && (
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        onClick={() => onView(row)}
                      >
                        {viewLabel}
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        onClick={() => onEdit(row)}
                      >
                        {editLabel}
                      </button>
                    )}
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => onDelete(row)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
