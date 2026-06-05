import TimesheetDetailClient from "./timesheet-detail-client";

type TimesheetDetailPageProps = {
  searchParams?: Promise<{
    entry?: string;
  }>;
};

export default async function TimesheetDetailPage({
  searchParams,
}: TimesheetDetailPageProps) {
  const query = await searchParams;

  return <TimesheetDetailClient initialModalOpen={query?.entry === "new"} />;
}
