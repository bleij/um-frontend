/**
 * DevSettingsContext — lightweight context for dev-only UI toggles.
 *
 * Consumed by MentorHome and OrgHome to simulate approved/unapproved
 * states without touching real DB data. In production __DEV__ is false
 * so DevRoleSwitcher never renders and these values are always the
 * "approved" defaults.
 */
import React, { createContext, useContext, useState } from "react";

interface DevSettings {
  mentorApproved: boolean;
  setMentorApproved: (v: boolean) => void;
  orgVerified: boolean;
  setOrgVerified: (v: boolean) => void;
}

const DevSettingsContext = createContext<DevSettings>({
  mentorApproved: true,
  setMentorApproved: () => {},
  orgVerified: true,
  setOrgVerified: () => {},
});

export function DevSettingsProvider({ children }: { children: React.ReactNode }) {
  // Default false so you see the pending view first when switching into the role,
  // which mirrors the real onboarding flow.
  const [mentorApproved, setMentorApproved] = useState(false);
  const [orgVerified, setOrgVerified] = useState(false);

  return (
    <DevSettingsContext.Provider value={{ mentorApproved, setMentorApproved, orgVerified, setOrgVerified }}>
      {children}
    </DevSettingsContext.Provider>
  );
}

export function useDevSettings(): DevSettings {
  return useContext(DevSettingsContext);
}
