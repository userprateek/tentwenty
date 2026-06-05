import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-page">
      <Header />
      {children}
      <Footer />
    </div>
  );
}