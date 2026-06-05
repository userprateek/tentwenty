'use client';

import EntryModal from '@/components/timesheets/EntryModal';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type TimesheetEntry = {
  id: number;
  date: string;
  projectName: string;
  description: string;
  hours: number;
};

type DayGroup = {
  date: string;
  entries: TimesheetEntry[];
};

export default function WeekTimesheetPage() {
  const params = useParams();
  const weekId = params.weekId as string;

  const [days, setDays] = useState<DayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(20);
  const [targetHours] = useState(40);
  const [dateRange, setDateRange] = useState('21 - 26 January, 2024');
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchWeekData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/timesheets/${weekId}`);
        const data = await response.json();
        setDays(data.days || []);
        setTotalHours(data.totalHours || 0);
        if (data.dateRange) setDateRange(data.dateRange);
      } catch {
        setDays([
          {
            date: 'Jan 21',
            entries: [
              { id: 1, projectName: 'Homepage Development', description: 'Homepage work', hours: 4, date: 'Jan 21' },
              { id: 2, projectName: 'Homepage Development', description: 'Bug fixes', hours: 4, date: 'Jan 21' },
            ],
          },
          {
            date: 'Jan 22',
            entries: [
              { id: 3, projectName: 'Homepage Development', description: 'Feature work', hours: 4, date: 'Jan 22' },
              { id: 4, projectName: 'Homepage Development', description: 'Testing', hours: 4, date: 'Jan 22' },
              { id: 5, projectName: 'Homepage Development', description: 'Review', hours: 4, date: 'Jan 22' },
              { id: 6, projectName: 'Homepage Development', description: 'Deployment', hours: 4, date: 'Jan 22' },
            ],
          },
          {
            date: 'Jan 23',
            entries: [
              { id: 7, projectName: 'Homepage Development', description: 'Design review', hours: 4, date: 'Jan 23' },
              { id: 8, projectName: 'Homepage Development', description: 'Code review', hours: 4, date: 'Jan 23' },
              { id: 9, projectName: 'Homepage Development', description: 'Bug fixes', hours: 4, date: 'Jan 23' },
            ],
          },
          {
            date: 'Jan 24',
            entries: [
              { id: 10, projectName: 'Homepage Development', description: 'Feature dev', hours: 4, date: 'Jan 24' },
              { id: 11, projectName: 'Homepage Development', description: 'Testing', hours: 4, date: 'Jan 24' },
              { id: 12, projectName: 'Homepage Development', description: 'Documentation', hours: 4, date: 'Jan 24' },
            ],
          },
          {
            date: 'Jan 25',
            entries: [],
          },
        ]);
        setTotalHours(20);
      } finally {
        setLoading(false);
      }
    }

    fetchWeekData();
  }, [weekId]);

  const percentage = Math.min((totalHours / targetHours) * 100, 100);

  const handleAddEntry = () => {
    setSelectedEntry(null);
    setShowModal(true);
  };

  const handleEditEntry = (entry: TimesheetEntry) => {
    setSelectedEntry(entry);
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleDeleteEntry = (entryId: number) => {
    setOpenMenuId(null);
    console.log('Delete entry', entryId);
  };

  const toggleMenu = (entryId: number) => {
    setOpenMenuId(openMenuId === entryId ? null : entryId);
  };

  if (loading) {
    return (
      <div className="detail-content">
        <section className="content-card week-card">Loading...</section>
      </div>
    );
  }

  return (
    <div className="detail-content">
      <section className="content-card week-card">
        <div className="week-card-header">
          <div>
            <h1>This week&apos;s timesheet</h1>
            <p>{dateRange}</p>
          </div>

          <div className="progress-block">
            <div className="progress-label">
              {totalHours}/{targetHours} hrs
            </div>

            <div className="progress-row">
              <div className="progress-track">
                <span style={{ width: `${percentage}%` }} />
              </div>
              <span className="progress-percent">
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>

        <div className="week-list">
          {days.map((day) => (
            <div key={day.date} className="day-section">
              <h2>{day.date}</h2>

              <div className="day-entries">
                {day.entries.map((entry) => (
                  <div key={entry.id} className="task-row">
                    <span className="task-title">{entry.projectName}</span>

                    <div className="task-meta">
                      <span className="task-hours">{entry.hours} hrs</span>
                      <span className="project-chip">Project Name</span>

                      <button
                        className="task-menu-button"
                        onClick={() => toggleMenu(entry.id)}
                        type="button"
                      >
                        <span />
                        <span />
                        <span />
                      </button>

                      {openMenuId === entry.id && (
                        <div className="task-dropdown">
                          <button
                            type="button"
                            onClick={() => handleEditEntry(entry)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  className="add-task-row"
                  onClick={handleAddEntry}
                  type="button"
                >
                  <span>+</span> Add new task
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <EntryModal
          isOpen={showModal}
          mode={selectedEntry ? 'edit' : 'create'}
          entry={
            selectedEntry
              ? {
                  id: selectedEntry.id,
                  projectName: selectedEntry.projectName,
                  taskName: '',
                  description: selectedEntry.description,
                  hours: selectedEntry.hours,
                }
              : null
          }
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
