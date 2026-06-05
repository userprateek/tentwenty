import Link from "next/link";

const timesheets = [
  {
    week: 1,
    date: "1 - 5 January, 2024",
    status: "completed",
    action: "View",
  },
  {
    week: 2,
    date: "8 - 12 January, 2024",
    status: "completed",
    action: "View",
  },
  {
    week: 3,
    date: "15 - 19 January, 2024",
    status: "incomplete",
    action: "Update",
  },
  {
    week: 4,
    date: "22 - 26 January, 2024",
    status: "completed",
    action: "View",
  },
  {
    week: 5,
    date: "28 January - 1 February, 2024",
    status: "missing",
    action: "Create",
  },
];

const pages = ["Previous", "1", "2", "3", "4", "5", "6", "7", "8", "...", "99", "Next"];

export default function TimesheetsPage() {
  return (
    <main className="app-page">
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

      <div className="app-content">
        <section className="content-card timesheets-card">
          <h1>Your Timesheets</h1>

          <div className="filter-row" aria-label="Timesheet filters">
            <button className="select-button" type="button">
              <span>Date Range</span>
              <span className="chevron" aria-hidden="true" />
            </button>
            <button className="select-button" type="button">
              <span>Status</span>
              <span className="chevron" aria-hidden="true" />
            </button>
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
                {timesheets.map((timesheet) => (
                  <tr key={timesheet.week}>
                    <td>{timesheet.week}</td>
                    <td>{timesheet.date}</td>
                    <td>
                      <span className={`status-pill ${timesheet.status}`}>
                        {timesheet.status}
                      </span>
                    </td>
                    <td>
                      <Link href={`/timesheets/${timesheet.week}`} className="action-link">
                        {timesheet.action}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-controls">
            <button className="select-button page-size-button" type="button">
              <span>5 per page</span>
              <span className="chevron" aria-hidden="true" />
            </button>

            <nav className="pagination" aria-label="Pagination">
              {pages.map((page, index) => (
                <Link
                  href="/timesheets"
                  key={`${page}-${index}`}
                  className={page === "3" ? "page-link active" : "page-link"}
                >
                  {page}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <footer className="app-footer">&copy; 2024 tentwenty. All rights reserved.</footer>
      </div>
    </main>
  );
}
