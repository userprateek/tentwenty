'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Types
type Timesheet = {
  id: number;
  week: number;
  dateRange: string;
  status: string;
  hours: number;
  userId: number;
  action: string;
};

type FilterOption = {
  value: string;
  label: string;
};

interface BodyProps {
  timesheets: Timesheet[];
  dateRanges: FilterOption[];
  statuses: FilterOption[];
  selectedDateRange: string;
  selectedStatus: string;
  rowsPerPage: number;
  currentPage: number;
  filterLoading: boolean;
  setSelectedDateRange: (value: string) => void;
  setSelectedStatus: (value: string) => void;
  setRowsPerPage: (value: number) => void;
  setCurrentPage: (value: number) => void;
}

const Body: React.FC<BodyProps> = ({
  timesheets,
  dateRanges,
  statuses,
  selectedDateRange,
  selectedStatus,
  rowsPerPage,
  currentPage,
  filterLoading,
  setSelectedDateRange,
  setSelectedStatus,
  setRowsPerPage,
  setCurrentPage
}) => {
  // Page options for rows per page
  const pageOptions = [5, 10, 20, 50, 100];

  // Filter timesheets based on selected filters
  const filteredTimesheets = timesheets.filter(timesheet => {
    const dateMatch = selectedDateRange === 'all-time' ||
      timesheet.dateRange.toLowerCase().includes(selectedDateRange.toLowerCase());
    const statusMatch = selectedStatus === 'all' ||
      timesheet.status.toLowerCase() === selectedStatus.toLowerCase();
    return dateMatch && statusMatch;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredTimesheets.length / rowsPerPage));
  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="app-content">
      <section className="content-card timesheets-card">
        <h1>Your Timesheets</h1>

        <div className="filter-row" aria-label="Timesheet filters">
          {/* Date Range Filter */}
          <div className="filter-group">
            <label className="filter-label">Date Range:</label>
            {filterLoading ? (
              <select className="select-button" disabled>
                <option value="">Loading...</option>
              </select>
            ) : (
              <select
                className="select-button"
                value={selectedDateRange}
                onChange={(e) => {
                  setSelectedDateRange(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <option value="all-time">All Time</option>
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            {filterLoading ? (
              <select className="select-button" disabled>
                <option value="">Loading...</option>
              </select>
            ) : (
              <select
                className="select-button"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <option value="all">All Statuses</option>
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="table-wrap">
          <table className="timesheet-table">
            <thead>
              <tr>
                <th scope="col">
                  <span className="sortable-heading">
                    Week #
                    <span className="sort-icon" aria-hidden="true" />
                  </span>
                </th>
                <th scope="col">
                  <span className="sortable-heading">
                    Date
                    <span className="sort-icon" aria-hidden="true" />
                  </span>
                </th>
                <th scope="col">
                  <span className="sortable-heading">
                    Status
                    <span className="sort-icon" aria-hidden="true" />
                  </span>
                </th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTimesheets.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    No timesheets match the current filters.
                  </td>
                </tr>
              ) : (
                paginatedTimesheets.map((timesheet) => (
                  <tr key={timesheet.id}>
                    <td>{timesheet.week}</td>
                    <td>{timesheet.dateRange}</td>
                    <td>
                      <span className={`status-pill ${timesheet.status.toLowerCase()}`}>
                        {timesheet.status}
                      </span>
                    </td>
                    <td>
                      {timesheet.action === 'View' ? (
                        <Link
                          href={`/timesheets/${timesheet.week}`}
                          className="action-link"
                        >
                          View
                        </Link>
                      ) : (
                        <button
                          className="action-link"
                          onClick={() => {
                            if (timesheet.action === 'Update') {
                              alert(`Updating timesheet for week ${timesheet.week}`);
                            } else {
                              alert(`Creating new timesheet for week ${timesheet.week}`);
                            }
                          }}
                        >
                          {timesheet.action}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-controls">
          {/* Rows per page dropdown */}
          <div className="page-size-group">
            <label className="page-size-label">Rows per page:</label>
            <select
              className="select-button page-size-button"
              value={rowsPerPage}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setRowsPerPage(value);
                setCurrentPage(1); // Reset to first page when page size changes
              }}
            >
              {pageOptions.map(option => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>

          {/* Pagination controls */}
          <nav className="pagination" aria-label="Pagination">
            <button
              className={`page-link ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Show page numbers (max 5 visible at once) */}
            {(() => {
              const pagesToShow = [];
              const maxVisible = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);

              // Adjust start page if we're near the end
              if (endPage - startPage + 1 < maxVisible) {
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pagesToShow.push(i);
              }

              return pagesToShow.map((page) => (
                <button
                  key={page}
                  className={`page-link ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              className={`page-link ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages}
            >
              Next
            </button>

            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Body;