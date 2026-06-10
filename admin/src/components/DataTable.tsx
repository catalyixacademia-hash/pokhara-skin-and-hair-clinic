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
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  extraActions?: (row: T) => ReactNode;
};

export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  search,
  onSearchChange,
  onEdit,
  onDelete,
  extraActions,
}: DataTableProps<T>) {
  return (
    <div className="admin-card">
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="admin-input max-w-xs"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-blush text-left text-xs uppercase tracking-wider text-warm-gray">
              {columns.map((col) => (
                <th key={String(col.key)} className="py-2 pr-4">
                  {col.label}
                </th>
              ))}
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-blush/50 hover:bg-ivory/50">
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-3 pr-4">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                  </td>
                ))}
                <td className="py-3">
                  <div className="flex gap-2 items-center">
                    {extraActions?.(row)}
                    <button type="button" className="admin-btn-secondary text-[10px] py-1 px-2" onClick={() => onEdit(row)}>
                      Edit
                    </button>
                    <button type="button" className="admin-btn-danger text-[10px] py-1 px-2" onClick={() => onDelete(row)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="py-8 text-center text-warm-gray">
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
