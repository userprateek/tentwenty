"use client";

import Link from "next/link";
import { useState } from "react";

const weekDays = [
  {
    date: "Jan 21",
    entries: 2,
    activeAdd: true,
  },
  {
    date: "Jan 22",
    entries: 3,
    menuEntry: 2,
  },
  {
    date: "Jan 23",
    entries: 3,
  },
  {
    date: "Jan 24",
    entries: 3,
  },
  {
    date: "Jan 25",
    entries: 0,
  },
];

function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <Link href="/timesheets" className="brand-link">
          ticktock
        </Link>
        <Link href="/timesheets" className="nav-link">
          Timesheets
        </Link>
      </div>

      <button className="user-menu" type="button">
        <span>John Doe</span>
        <span className="chevron" aria-hidden="true" />
      </button>
    </header>
  );
}

function TaskRow({
  showMenu = false,
}: Readonly<{
  showMenu?: boolean;
}>) {
  return (
    <div className="task-row">
      <span className="task-title">Homepage Development</span>
      <div className="task-meta">
        <span className="task-hours">4 hrs</span>
        <span className="project-chip">Project Name</span>
        <button className="task-menu-button" type="button" aria-label="Task actions">
          <span />
          <span />
          <span />
        </button>
        {showMenu ? (
          <div className="task-dropdown">
            <button type="button">Edit</button>
            <button type="button" className="danger">
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AddTaskRow({
  active = false,
  onOpen,
}: Readonly<{
  active?: boolean;
  onOpen: () => void;
}>) {
  return (
    <button
      className={active ? "add-task-row active" : "add-task-row"}
      type="button"
      onClick={onOpen}
    >
      <span aria-hidden="true">+</span>
      Add new task
    </button>
  );
}

function EntryModal({
  onClose,
}: Readonly<{
  onClose: () => void;
}>) {
  const [hours, setHours] = useState(12);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="entry-modal" role="dialog" aria-modal="true" aria-labelledby="entry-title">
        <header className="entry-modal-header">
          <h2 id="entry-title">Add New Entry</h2>
          <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="entry-form">
          <label className="modal-field">
            <span>
              Select Project * <b aria-hidden="true">i</b>
            </span>
            <select defaultValue="">
              <option value="" disabled>
                Project Name
              </option>
              <option>Project Name</option>
            </select>
          </label>

          <label className="modal-field narrow">
            <span>
              Type of Work * <b aria-hidden="true">i</b>
            </span>
            <select defaultValue="bug-fixes">
              <option value="bug-fixes">Bug fixes</option>
              <option>Feature work</option>
              <option>Testing</option>
            </select>
          </label>

          <label className="modal-field description">
            <span>Task description *</span>
            <textarea placeholder="Write text here ..." />
          </label>

          <p className="modal-help">A note for extra info</p>

          <div className="hours-field">
            <span>Hours *</span>
            <div className="hours-stepper" aria-label="Hours">
              <button type="button" onClick={() => setHours((value) => Math.max(0, value - 1))}>
                −
              </button>
              <output>{hours}</output>
              <button type="button" onClick={() => setHours((value) => value + 1)}>
                +
              </button>
            </div>
          </div>
        </form>

        <footer className="entry-modal-actions">
          <button className="entry-submit" type="button">
            Add entry
          </button>
          <button className="entry-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function TimesheetDetailClient({
  initialModalOpen = false,
}: Readonly<{
  initialModalOpen?: boolean;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(initialModalOpen);

  return (
    <main className="app-page">
      <AppHeader />

      <div className="detail-content">
        <section className="content-card week-card">
          <div className="week-card-header">
            <div>
              <h1>This week's timesheet</h1>
              <p>21 - 26 January, 2024</p>
            </div>

            <div className="progress-block" aria-label="20 of 40 hours completed">
              <div className="progress-label">20/40 hrs</div>
              <div className="progress-row">
                <div className="progress-track">
                  <span />
                </div>
                <span className="progress-percent">100%</span>
              </div>
            </div>
          </div>

          <div className="week-list">
            {weekDays.map((day) => (
              <section className="day-section" key={day.date}>
                <h2>{day.date}</h2>
                <div className="day-entries">
                  {Array.from({ length: day.entries }).map((_, index) => (
                    <TaskRow key={`${day.date}-${index}`} showMenu={day.menuEntry === index + 1} />
                  ))}
                  <AddTaskRow active={day.activeAdd} onOpen={() => setIsModalOpen(true)} />
                </div>
              </section>
            ))}
          </div>
        </section>

        <footer className="app-footer">&copy; 2024 tentwenty. All rights reserved.</footer>
      </div>

      {isModalOpen ? <EntryModal onClose={() => setIsModalOpen(false)} /> : null}
    </main>
  );
}
