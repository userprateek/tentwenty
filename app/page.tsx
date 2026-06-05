import { redirect } from 'next/navigation';

export default function HomePage() {
  const isLoggedIn = true; // replace with actual check

  redirect(isLoggedIn ? '/timesheets' : '/login');
}