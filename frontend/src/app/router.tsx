import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import ErrorPage from '../pages/ErrorPage';
import { ROUTES } from '@/constants';
import AuthGuard from '@/components/AuthGuard';
import { SuspenseWrapper } from '@/components/shared/SuspenseWrapper';

// Lazy-loaded page components for code-splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Employees = lazy(() => import('../pages/Employees'));
const Attendance = lazy(() => import('../pages/Attendance'));
const LiveMonitor = lazy(() => import('../pages/LiveMonitor'));
const Reports = lazy(() => import('../pages/Reports'));
const Devices = lazy(() => import('../pages/Devices'));
const Payroll = lazy(() => import('../pages/Payroll'));
const Settings = lazy(() => import('../pages/Settings'));
const Departments = lazy(() => import('../pages/Departments'));
const Login = lazy(() => import('../pages/Login'));

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <SuspenseWrapper><Login /></SuspenseWrapper>,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <AuthGuard><AdminLayout /></AuthGuard>,
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
        path: ROUTES.DEPARTMENTS,
        element: <SuspenseWrapper><Departments /></SuspenseWrapper>,
      },
      {
        path: ROUTES.SETTINGS,
        element: <SuspenseWrapper><Settings /></SuspenseWrapper>,
      },
    ],
  },
]);
