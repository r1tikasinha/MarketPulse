import { NavLink } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  LayoutDashboard,
  Settings,
  Star,
  TrendingUp,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "My Watchlist",
      path: "/watchlist",
      icon: Star,
    },
    {
      name: "Markets",
      path: "/markets",
      icon: BarChart3,
    },
    {
      name: "What Changed",
      path: "/changes",
      icon: Activity,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: Bell,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-icon">
          <TrendingUp size={21} />
        </div>

        <div>
          <h2>MarketPulse</h2>
          <span>Market Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <div className="user-card">
          <div className="user-avatar">R</div>

          <div>
            <strong>Ritika</strong>
            <span>Investor</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;