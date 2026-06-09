interface Column<T> {
    key: keyof T;
    header: string;
    render?: (
      row: T
    ) => React.ReactNode;
  }
  
  interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
  }
  
  export function DataTable<T>({
    data,
    columns
  }: DataTableProps<T>) {
    return (
      <div className="overflow-x-auto">
        <table
          className="
            w-full
            border-collapse
          "
        >
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="
                    px-4
                    py-3
                    text-left
                  "
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {data.map(
              (row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b"
                >
                  {columns.map(
                    (column) => (
                      <td
                        key={String(
                          column.key
                        )}
                        className="
                          px-4
                          py-3
                        "
                      >
                        {column.render
                          ? column.render(
                              row
                            )
                          : String(
                              row[
                                column.key
                              ]
                            )}
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    );
  }