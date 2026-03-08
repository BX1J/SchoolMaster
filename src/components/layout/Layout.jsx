import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, Sun, Moon, GraduationCap, LayoutDashboard, Users, UserCog } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
];

const adminLinks = [
  { to: '/staff', label: 'Staff', icon: UserCog },
];

const SideLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Student SMS</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((l) => (
            <SideLink key={l.to} {...l} />
          ))}
          {user?.role === 'admin' && adminLinks.map((l) => (
            <SideLink key={l.to} {...l} />
          ))}
        </nav>
        <div className="border-t border-border px-3 py-4 space-y-1">
          <button
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap size={20} className="text-primary" />
            <span className="text-sm font-bold text-foreground">Student SMS</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg p-2 text-muted-foreground hover:bg-accent">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={logout} className="rounded-lg p-2 text-muted-foreground hover:bg-accent">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="flex items-center gap-1 border-b border-border bg-card px-2 py-1 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <l.icon size={14} />
              {l.label}
            </NavLink>
          ))}
          {user?.role === 'admin' && adminLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <l.icon size={14} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
