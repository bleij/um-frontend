import { NavLink } from "react-router";
import { Home, User, Award, TrendingUp } from "lucide-react";

export function Navigation() {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/progress", icon: TrendingUp, label: "Progress" },
    { to: "/achievements", icon: Award, label: "Rewards" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-3xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-6 h-6 transition-all ${
                    isActive ? "scale-110" : ""
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
