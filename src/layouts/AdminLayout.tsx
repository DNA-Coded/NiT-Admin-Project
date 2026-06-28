import { Outlet, NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '@/constants';

export function AdminLayout() {
  return (
    <div className="text-on-background font-body-md antialiased overflow-x-hidden min-h-screen bg-background">
      {/* SideNavBar */}
      <aside className="hidden md:flex bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container fixed h-full w-[280px] left-0 top-0 border-r border-outline-variant flex-col py-6 z-50">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-md p-1 flex items-center justify-center shrink-0 shadow-sm">
            <img src="/logo.png" alt="NiT Logo" className="object-contain w-full h-full" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-headline-lg font-headline-lg font-bold text-white leading-tight truncate">NiT Admin</h1>
            <p className="font-label-sm text-label-sm text-white/70 whitespace-nowrap truncate">Academic Administration</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-2 overflow-y-auto no-scrollbar">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded ${isActive ? 'bg-white/10 text-white border-l-4 border-white opacity-100 rounded-r' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 mt-auto pt-6">
          <button className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded hover:bg-surface-tint transition-colors">
            Quick Actions
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-[280px] min-h-screen flex flex-col">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest text-primary sticky top-0 w-full z-40 border-b border-outline-variant flex items-center justify-between px-4 md:px-10 py-4 h-[72px]">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-on-surface-variant">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="font-headline-md text-headline-md font-bold text-primary hidden md:block">
              NiT Admin Dashboard
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="pl-10 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-64 font-body-sm text-body-sm transition-all" 
                placeholder="Search employees, records..." 
                type="text" 
              />
            </div>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all">
              <span className="material-symbols-outlined">schedule</span>
            </button>
            <div className="w-10 h-10 rounded bg-primary-fixed-dim overflow-hidden border border-outline-variant ml-2 flex items-center justify-center bg-primary text-white">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-10 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
