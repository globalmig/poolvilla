import AdminDashboard from './AdminDashboard';

export const metadata = {
  title: '관리자 | Pool Villa',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
