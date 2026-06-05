'use client';

import { useEffect, useState } from 'react';

type TimesheetEntry = {
  id?: number;
  projectName: string;
  taskName: string;
  description: string;
  hours: number;
};

interface EntryModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  entry?: TimesheetEntry | null;
  onClose: () => void;
  onSave: (entry: TimesheetEntry) => void;
}

export default function EntryModal({
  isOpen,
  mode,
  entry,
  onClose,
  onSave,
}: EntryModalProps) {
  const [projectName, setProjectName] =
    useState('');

  const [taskName, setTaskName] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [hours, setHours] =
    useState<number>(0);

  useEffect(() => {
    if (entry) {
      setProjectName(entry.projectName);
      setTaskName(entry.taskName);
      setDescription(entry.description);
      setHours(entry.hours);
    } else {
      setProjectName('');
      setTaskName('');
      setDescription('');
      setHours(0);
    }
  }, [entry, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSave({
      id: entry?.id,
      projectName,
      taskName,
      description,
      hours,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="timesheet-modal">
        <div className="modal-header">
          <h2>
            {mode === 'create'
              ? 'Add New Entry'
              : 'Edit Entry'}
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Project Name
            </label>

            <input
              type="text"
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Task Name
            </label>

            <input
              type="text"
              value={taskName}
              onChange={(e) =>
                setTaskName(
                  e.target.value
                )
              }
              required
            />
          </div>

          <div className="form-group">
            <label>
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              Hours
            </label>

            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) =>
                setHours(
                  Number(
                    e.target.value
                  )
                )
              }
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              {mode === 'create'
                ? 'Save'
                : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}