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

  const [selectedDateRange, setSelectedDateRange] =
    useState('all-time');

  const [selectedStatus, setSelectedStatus] =
    useState('all');

  const [rowsPerPage, setRowsPerPage] =
    useState(5);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(true);
  const [showModal, setShowModal] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<'create' | 'edit'>('create');

  const [selectedEntry, setSelectedEntry] =
    useState<any>(null);

  const [selectedWeek, setSelectedWeek] =
    useState<number | null>(null);

  const pageOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [
          timesheetsResponse,
          dateRangesResponse,
          statusesResponse,
        ] = await Promise.all([
          fetch('/api/timesheets'),
          fetch('/api/filters/date-ranges'),
          fetch('/api/filters/statuses'),
        ]);

        const timesheetsData =
          await timesheetsResponse.json();

        const dateRangesData =
          await dateRangesResponse.json();

        const statusesData =
          await statusesResponse.json();

        setTimesheets(
          timesheetsData.timesheets || []
        );

        setDateRanges(
          dateRangesData.dateRanges || []
        );

        setStatuses(
          statusesData.statuses || []
        );
      } catch (error) {
        console.error(error);

        setDateRanges([
          {
            value: 'all-time',
            label: 'All Time',
          },
        ]);

        setStatuses([
          {
            value: 'all',
            label: 'All Statuses',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredTimesheets =
    timesheets.filter((timesheet) => {
      const dateMatch =
        selectedDateRange === 'all-time' ||
        timesheet.dateRange
          .toLowerCase()
          .includes(
            selectedDateRange.toLowerCase()
          );

      const statusMatch =
        selectedStatus === 'all' ||
        timesheet.status.toLowerCase() ===
        selectedStatus.toLowerCase();

      return dateMatch && statusMatch;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTimesheets.length / rowsPerPage
    )
  );

  const paginatedTimesheets =
    filteredTimesheets.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );

  return (
    <section className="content-card timesheets-card">
      <h1>Your Timesheets</h1>

      <div
        className="filter-row"
        aria-label="Timesheet filters"
      >
        <select
          className="select-button"
          value={selectedDateRange}
          onChange={(e) => {
            setSelectedDateRange(
              e.target.value
            );
            setCurrentPage(1);
          }}
          disabled={loading}
        >
          <option value="all-time">
            All Time
          </option>

          {dateRanges.map((range) => (
            <option
              key={range.value}
              value={range.value}
            >
              {range.label}
            </option>
          ))}
        </select>

        <select
          className="select-button"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(
              e.target.value
            );
            setCurrentPage(1);
          }}
          disabled={loading}
        >
          <option value="all">
            All Statuses
          </option>

          {statuses.map((status) => (
            <option
              key={status.value}
              value={status.value}
            >
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table className="timesheet-table">
          <thead>
            <tr>
              <th>Week #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTimesheets.length ===
              0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="empty-state"
                >
                  No timesheets found
                </td>
              </tr>
            ) : (
              paginatedTimesheets.map(
                (timesheet) => (
                  <tr key={timesheet.id}>
                    <td>
                      {timesheet.week}
                    </td>

                    <td>
                      {
                        timesheet.dateRange
                      }
                    </td>

                    <td>
                      <span
                        className={`status-pill ${timesheet.status.toLowerCase()}`}
                      >
                        {
                          timesheet.status
                        }
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
                            setSelectedWeek(timesheet.week);
                            setSelectedEntry(timesheet);
                            setModalMode('edit');
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                      )}

                      {timesheet.status === 'missing' && (
                        <button
                          className="action-link"
                          onClick={() => {
                            setSelectedWeek(timesheet.week);
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
                )
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="table-controls">
        <div className="page-size-group">
          <select
            className="select-button"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(
                Number(
                  e.target.value
                )
              );
              setCurrentPage(1);
            }}
          >
            {pageOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option} per page
                </option>
              )
            )}
          </select>
        </div>

        <nav className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{' '}
            {totalPages}
          </span>

          <button
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>
        </nav>
      </div>
      <EntryModal
        isOpen={showModal}
        mode={modalMode}
        entry={selectedEntry}
        onClose={() => setShowModal(false)}
        onSave={() => {
          // TODO: Implement save logic
          console.log('Save timesheet entry');
        }}
      />
    </section>
  );
}