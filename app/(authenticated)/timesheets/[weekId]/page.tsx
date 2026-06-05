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

  const [showModal, setShowModal] =
    useState(false);

  const [selectedEntry, setSelectedEntry] =
    useState(null);



  useEffect(() => {
    async function fetchWeekData() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/timesheets/${weekId}`
        );

        const data = await response.json();

        setDays(data.days || []);
        setTotalHours(data.totalHours || 0);
      } catch (error) {
        console.error(error);

        // fallback demo data
        setDays([
          {
            date: 'Jan 21',
            entries: [
              {
                id: 1,
                projectName: 'Homepage Development',
                description: 'Homepage work',
                hours: 4,
                date: 'Jan 21',
              },
              {
                id: 2,
                projectName: 'Homepage Development',
                description: 'Bug fixes',
                hours: 4,
                date: 'Jan 21',
              },
            ],
          },
          {
            date: 'Jan 22',
            entries: [
              {
                id: 3,
                projectName: 'Homepage Development',
                description: 'Feature work',
                hours: 4,
                date: 'Jan 22',
              },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchWeekData();
  }, [weekId]);

  const percentage = Math.min(
    (totalHours / targetHours) * 100,
    100
  );

  const handleAddEntry = (date: string) => {
    console.log('Add entry for', date);
    setShowModal(true);
  };

  const handleEditEntry = (entryId: number) => {
    console.log('Edit entry', entryId);
    setShowModal(true);
  };

  const handleDeleteEntry = (entryId: number) => {
    console.log('Delete entry', entryId);
  };

  if (loading) {
    return (
      <section className="content-card">
        Loading...
      </section>
    );
  }

  return (
    <>
      <section className="content-card week-timesheet-card">
        <div className="week-header">
          <div>
            <h1>This week's timesheet</h1>

            <p>
              Week #{weekId}
            </p>
          </div>

          <div className="hours-summary">
            <div>
              {totalHours}/{targetHours} hrs
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {days.map((day) => (
          <div
            key={day.date}
            className="day-group"
          >
            <div className="day-label">
              {day.date}
            </div>

            <div className="day-content">
              {day.entries.map((entry) => (
                <div
                  key={entry.id}
                  className="timesheet-entry"
                >
                  <div className="entry-name">
                    {entry.projectName}
                  </div>

                  <div className="entry-hours">
                    {entry.hours} hrs
                  </div>

                  <div className="entry-actions">
                    <button
                      onClick={() =>
                        handleEditEntry(
                          entry.id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteEntry(
                          entry.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="add-task-button"
                onClick={() =>
                  handleAddEntry(day.date)
                }
              >
                + Add new task
              </button>
            </div>
          </div>
        ))}
      </section>

      {showModal && (
        <EntryModal
          isOpen={showModal}
          mode={
            selectedEntry
              ? 'edit'
              : 'create'
          }
          entry={selectedEntry}
          onClose={() =>
            setShowModal(false)
          }
          onSave={(entry) => {
            console.log(entry);

            // API call here
          }}
        />)}
    </>
  );
}