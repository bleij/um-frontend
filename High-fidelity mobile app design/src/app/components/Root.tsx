import { Outlet } from "react-router";
import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";

export function Root() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-[428px] mx-auto min-h-screen bg-background relative shadow-2xl">
        <main className="pb-24">
          <Outlet context={{ theme, toggleTheme }} />
        </main>
        
        <Navigation />
      </div>
    </div>
  );
}
