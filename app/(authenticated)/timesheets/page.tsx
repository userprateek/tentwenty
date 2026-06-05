'use client';

import EntryModal from '@/components/timesheets/EntryModal';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Timesheet = {
  id: number;
  week: number;
  dateRange: string;
  status: string;
  hours: number;
  userId: number;
};

type FilterOption = {
  value: string;
  label: string;
};

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [dateRanges, setDateRanges] = useState<FilterOption[]>([]);
  const [statuses, setStatuses] = useState<FilterOption[]>([]);

  const [selectedDateRange, setSelectedDateRange] = useState('all-time');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEntry, setSelectedEntry] = useState<Timesheet | null>(null);

  const pageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [timesheetsResponse, dateRangesResponse, statusesResponse] =
          await Promise.all([
            fetch('/api/timesheets'),
            fetch('/api/filters/date-ranges'),
            fetch('/api/filters/statuses'),
          ]);

        const timesheetsData = await timesheetsResponse.json();
        const dateRangesData = await dateRangesResponse.json();
        const statusesData = await statusesResponse.json();

        setTimesheets(timesheetsData.timesheets || []);
        setDateRanges(dateRangesData.dateRanges || []);
        setStatuses(statusesData.statuses || []);
      } catch (error) {
        console.error(error);
        setDateRanges([{ value: 'all-time', label: 'All Time' }]);
        setStatuses([{ value: 'all', label: 'All Statuses' }]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredTimesheets = timesheets.filter((timesheet) => {
    const dateMatch =
      selectedDateRange === 'all-time' ||
      timesheet.dateRange.toLowerCase().includes(selectedDateRange.toLowerCase());
    const statusMatch =
      selectedStatus === 'all' ||
      timesheet.status.toLowerCase() === selectedStatus.toLowerCase();
    return dateMatch && statusMatch;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTimesheets.length / rowsPerPage)
  );

  const paginatedTimesheets = filteredTimesheets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 8;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const startPages = [1, 2, 3];
      const endPages = [totalPages - 2, totalPages - 1, totalPages];
      const aroundCurrent = [currentPage - 1, currentPage, currentPage + 1].filter(
        (p) => p > 3 && p < totalPages - 2
      );

      const allPages = [...new Set([...startPages, ...aroundCurrent, ...endPages])].sort(
        (a, b) => a - b
      );

      for (let i = 0; i < allPages.length; i++) {
        if (i > 0 && allPages[i] - allPages[i - 1] > 1) {
          pages.push('...');
        }
        pages.push(allPages[i]);
      }
    }

    return pages;
  };

  return (
    <div className="app-content">
      <section className="content-card timesheets-card">
        <h1>Your Timesheets</h1>

        <div className="filter-row" aria-label="Timesheet filters">
          <select
            className="select-button"
            value={selectedDateRange}
            onChange={(e) => {
              setSelectedDateRange(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            <option value="all-time">Date Range</option>
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          <select
            className="select-button"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          >
            <option value="all">Status</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
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
                    No timesheets found
                  </td>
                </tr>
              ) : (
                paginatedTimesheets.map((timesheet) => (
                  <tr key={timesheet.id}>
                    <td>{timesheet.week}</td>
                    <td>{timesheet.dateRange}</td>
                    <td>
                      <span
                        className={`status-pill ${timesheet.status.toLowerCase()}`}
                      >
                        {timesheet.status}
                      </span>
                    </td>
                    <td>
                      {timesheet.status === 'completed' && (
                        <Link
                          href={`/timesheets/${timesheet.week}`}
                          className="action-link"
                        >
                          View
                        </Link>
                      )}
                      {timesheet.status === 'incomplete' && (
                        <button
                          className="action-link"
                          onClick={() => {
                            setSelectedEntry(timesheet);
                            setModalMode('edit');
                            setShowModal(true);
                          }}
                        >
                          Update
                        </button>
                      )}
                      {timesheet.status === 'missing' && (
                        <button
                          className="action-link"
                          onClick={() => {
                            setSelectedEntry(null);
                            setModalMode('create');
                            setShowModal(true);
                          }}
                        >
                          Create
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
          <div className="page-size-group">
            <select
              className="select-button page-size-button"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {pageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} per page
                </option>
              ))}
            </select>
          </div>

          <nav className="pagination" aria-label="Pagination">
            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {getPageNumbers().map((page, i) =>
              page === '...' ? (
                <span key={`ellipsis-${i}`} className="page-link">
                  …
                </span>
              ) : (
                <button
                  key={page}
                  className={`page-link ${page === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </button>
              )
            )}

            <button
              className="page-link"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </nav>
        </div>

        <EntryModal
          isOpen={showModal}
          mode={modalMode}
          entry={
            selectedEntry
              ? {
                  projectName: '',
                  taskName: '',
                  description: '',
                  hours: selectedEntry.hours,
                }
              : null
          }
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
          }}
        />
      </section>
    </div>
  );
}
