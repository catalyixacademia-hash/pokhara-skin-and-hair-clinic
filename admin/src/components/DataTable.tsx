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

function cellValue<T extends { id: string }>(col: Column<T>, row: T): ReactNode {
  if (col.render) return col.render(row);
  return String((row as Record<string, unknown>)[col.key as string] ?? '');
}

function RowActions<T extends { id: string }>({
  row,
  onDelete,
  onView,
  onEdit,
  viewLabel,
  editLabel,
  extraActions,
}: {
  row: T;
  onDelete: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  viewLabel: string;
  editLabel: string;
  extraActions?: (row: T) => ReactNode;
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center justify-end min-w-[9rem]">
      {extraActions?.(row)}
      {onView && (
        <button type="button" className="admin-btn-secondary" onClick={() => onView(row)}>
          {viewLabel}
        </button>
      )}
      {onEdit && (
        <button type="button" className="admin-btn-secondary" onClick={() => onEdit(row)}>
          {editLabel}
        </button>
      )}
      <button type="button" className="admin-btn-danger" onClick={() => onDelete(row)}>
        Delete
      </button>
    </div>
  );
}

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
  const [primaryCol, ...detailCols] = columns;

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

      {/* Mobile: stacked cards — avoids sticky-column bleed on iOS Safari */}
      <div className="admin-table-cards md:hidden space-y-3">
        {rows.length === 0 && (
          <p className="py-10 text-center text-muted">No records found.</p>
        )}
        {rows.map((row) => (
          <article key={row.id} className="admin-table-card">
            {primaryCol && (
              <h3 className="admin-table-card__title">{cellValue(primaryCol, row)}</h3>
            )}
            <dl className="admin-table-card__fields">
              {detailCols.map((col) => (
                <div key={String(col.key)} className="admin-table-card__field">
                  <dt>{col.label}</dt>
                  <dd>{cellValue(col, row)}</dd>
                </div>
              ))}
            </dl>
            <div className="admin-table-card__actions">
              <RowActions
                row={row}
                onDelete={onDelete}
                onView={onView}
                onEdit={onEdit}
                viewLabel={viewLabel}
                editLabel={editLabel}
                extraActions={extraActions}
              />
            </div>
          </article>
        ))}
      </div>

      {/* Desktop / tablet: wide table with sticky name column */}
      <div className="admin-table-scroll hidden md:block overflow-x-auto -mx-1 px-1">
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
                    {cellValue(col, row)}
                  </td>
                ))}
                <td className="py-3.5">
                  <RowActions
                    row={row}
                    onDelete={onDelete}
                    onView={onView}
                    onEdit={onEdit}
                    viewLabel={viewLabel}
                    editLabel={editLabel}
                    extraActions={extraActions}
                  />
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
