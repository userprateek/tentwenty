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
  const [projectName, setProjectName] = useState('');
  const [taskName, setTaskName] = useState('Bug fixes');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState<number>(12);

  useEffect(() => {
    if (entry) {
      setProjectName(entry.projectName);
      setTaskName(entry.taskName || 'Bug fixes');
      setDescription(entry.description);
      setHours(entry.hours);
    } else {
      setProjectName('');
      setTaskName('Bug fixes');
      setDescription('');
      setHours(12);
    }
  }, [entry, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
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

  const incrementHours = () => setHours((h) => Math.min(h + 1, 24));
  const decrementHours = () => setHours((h) => Math.max(h - 1, 0));

  return (
    <div className="modal-backdrop">
      <div className="entry-modal">
        <div className="entry-modal-header">
          <h2>{mode === 'create' ? 'Add New Entry' : 'Edit Entry'}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>
              Select Project <span>*</span> <b>i</b>
            </label>
            <select
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            >
              <option value="">Project Name</option>
              <option value="Homepage Development">Homepage Development</option>
              <option value="Backend API">Backend API</option>
              <option value="Mobile App">Mobile App</option>
            </select>
          </div>

          <div className="modal-field narrow">
            <label>
              Type of Work <span>*</span> <b>i</b>
            </label>
            <select
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            >
              <option value="Bug fixes">Bug fixes</option>
              <option value="Feature development">Feature development</option>
              <option value="Design">Design</option>
              <option value="Code review">Code review</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          <div className="modal-field description">
            <label>
              Task description <span>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write text here ..."
            />
          </div>

          <p className="modal-help">A note for extra info</p>

          <div className="hours-field">
            <label>
              Hours <span>*</span>
            </label>
            <div className="hours-stepper">
              <button type="button" onClick={decrementHours}>
                −
              </button>
              <output>{hours}</output>
              <button type="button" onClick={incrementHours}>
                +
              </button>
            </div>
          </div>

          <div className="entry-modal-actions">
            <button type="submit" className="entry-submit">
              {mode === 'create' ? 'Add entry' : 'Update'}
            </button>
            <button
              type="button"
              className="entry-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
