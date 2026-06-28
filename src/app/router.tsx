import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { ROUTES } from '@/constants';

// Lazy-loaded page components for code-splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Employees = lazy(() => import('../pages/Employees'));
const Attendance = lazy(() => import('../pages/Attendance'));
const LiveMonitor = lazy(() => import('../pages/LiveMonitor'));
const Reports = lazy(() => import('../pages/Reports'));
const Devices = lazy(() => import('../pages/Devices'));
const Payroll = lazy(() => import('../pages/Payroll'));
const Settings = lazy(() => import('../pages/Settings'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px] w-full">
          <div className="flex flex-col items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span>
            <p className="font-body-sm text-body-sm">Loading module...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: ROUTES.DASHBOARD,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <SuspenseWrapper><Dashboard /></SuspenseWrapper>,
      },
      {
        path: ROUTES.EMPLOYEES,
        element: <SuspenseWrapper><Employees /></SuspenseWrapper>,
      },
      {
        path: ROUTES.ATTENDANCE_RECORDS,
        element: <SuspenseWrapper><Attendance /></SuspenseWrapper>,
      },
      {
        path: ROUTES.LIVE_ATTENDANCE,
        element: <SuspenseWrapper><LiveMonitor /></SuspenseWrapper>,
      },
      {
        path: ROUTES.REPORTS,
        element: <SuspenseWrapper><Reports /></SuspenseWrapper>,
      },
      {
        path: ROUTES.DEVICES,
        element: <SuspenseWrapper><Devices /></SuspenseWrapper>,
      },
      {
        path: ROUTES.PAYROLL,
        element: <SuspenseWrapper><Payroll /></SuspenseWrapper>,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>,
      },
    ],
  },
]);
