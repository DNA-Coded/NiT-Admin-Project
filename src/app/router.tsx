import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import ErrorPage from '../pages/ErrorPage';
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
        <div className="flex items-center justify-center min-h-[400px] w-full py-20">
          <div className="flex flex-col items-center gap-6">
            {/* Pulsing Logo Container */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse w-24 h-24"></div>
              <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg relative border border-outline-variant">
                <img src="/logo.png" alt="NiT Logo" className="object-contain w-full h-full" />
              </div>
            </div>
            {/* Spinner and Text */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="font-label-md text-label-md font-semibold text-primary">Loading NiT Admin</p>
                <p className="font-body-xs text-body-xs text-on-surface-variant/70 mt-0.5">Preparing dashboard module...</p>
              </div>
            </div>
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
    errorElement: <ErrorPage />,
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
