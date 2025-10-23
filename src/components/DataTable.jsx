import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import SearchBar from './SearchBar';
import EmptyState from './EmptyState';
import Loader from './Loader';

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyStateTitle = 'No data found',
  emptyStateDescription = 'No items match your search criteria.',
  pageSize = 10,
  className = '',
  onRowClick = null,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
        <Loader text="Loading..." />
      </div>
    );
  }

  const filteredData = table.getFilteredRowModel().rows;
  const showEmptyState = filteredData.length === 0;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-100">
          <SearchBar
            value={globalFilter}
            onChange={setGlobalFilter}
            placeholder={searchPlaceholder}
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="
                      px-4 py-4 text-left text-xs font-medium text-gray-500 
                      uppercase tracking-wider bg-gray-50 first:rounded-tl-none 
                      last:rounded-tr-none
                    "
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`
                          flex items-center space-x-2
                          ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                        `}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className="flex flex-col">
                            <ChevronUp 
                              className={`
                                h-3 w-3
                                ${header.column.getIsSorted() === 'asc' ? 'text-primary-600' : 'text-gray-400'}
                              `} 
                            />
                            <ChevronDown 
                              className={`
                                h-3 w-3 -mt-1
                                ${header.column.getIsSorted() === 'desc' ? 'text-primary-600' : 'text-gray-400'}
                              `} 
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {showEmptyState ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <EmptyState 
                    title={emptyStateTitle}
                    description={emptyStateDescription}
                  />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr 
                  key={row.id} 
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!showEmptyState && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              of {table.getFilteredRowModel().rows.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="
                  p-2 rounded-lg border border-gray-300 disabled:opacity-50 
                  disabled:cursor-not-allowed hover:bg-gray-50
                "
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-gray-700">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="
                  p-2 rounded-lg border border-gray-300 disabled:opacity-50 
                  disabled:cursor-not-allowed hover:bg-gray-50
                "
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
