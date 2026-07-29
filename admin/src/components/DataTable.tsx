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
          className="admin-input max-w-xs"
        />
        {toolbar}
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table w-full text-sm">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="py-3 pr-4">
                  {col.label}
                </th>
              ))}
              <th className="py-3 text-right">Actions</th>
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
                  <div className="flex gap-2 items-center justify-end">
                    {extraActions?.(row)}
                    {onView && (
                      <button
                        type="button"
                        className="admin-btn-secondary text-xs py-1.5 px-3"
                        onClick={() => onView(row)}
                      >
                        {viewLabel}
                      </button>
                    )}
                    {onEdit && (
                      <button
                        type="button"
                        className="admin-btn-secondary text-xs py-1.5 px-3"
                        onClick={() => onEdit(row)}
                      >
                        {editLabel}
                      </button>
                    )}
                    <button
                      type="button"
                      className="admin-btn-danger text-xs py-1.5 px-3"
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
