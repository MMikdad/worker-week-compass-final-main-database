
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

export type WorkLocation = "office" | "home" | "" | "urlaub" | "other";

export interface WorkDay {
  userId: string;
  date: string; // YYYY-MM-DD
  location: WorkLocation;
}

export interface TeamEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  color: string;
  teamId?: string; // Which team this event is for, undefined means all teams
}

export interface TeamMember {
  id: string;
  name: string;
  color: string;
  teamId: string; // Added teamId field
}

export interface Team {
  id: string;
  name: string;
}

interface TeamContextType {
  members: TeamMember[];
  workdays: WorkDay[];
  events: TeamEvent[];
  teams: Team[];
  activeTeamId: string;
  setActiveTeamId: (id: string) => void;
  addMember: (name: string, color: string, teamId: string) => void;
  removeMember: (id: string) => void;
  updateWorkLocation: (userId: string, date: string, location: WorkLocation) => void;
  addEvent: (name: string, date: string, color: string, teamId?: string) => void;
  removeEvent: (id: string) => void;
  updateEventDate: (id: string, newDate: string) => void;
  getMemberById: (id: string) => TeamMember | undefined;
  getEventsByDate: (date: string) => TeamEvent[];
  getWorkLocationByUserAndDate: (userId: string, date: string) => WorkLocation;
  getTeamMembers: (teamId: string) => TeamMember[];
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  updateTeamName: (id: string, name: string) => void;
  isHoliday: (date: string) => boolean;
  isDayEmpty: (date: string, teamId: string) => boolean;
  notes: string;
  setNotes: (notes: string) => void;
}

export const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

// Local storage keys
const STORAGE_KEY_MEMBERS = "team-calendar-members";
const STORAGE_KEY_WORKDAYS = "team-calendar-workdays";
const STORAGE_KEY_EVENTS = "team-calendar-events";
const STORAGE_KEY_TEAMS = "team-calendar-teams";
const STORAGE_KEY_NOTES = "team-calendar-notes";

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const { isAdmin, user, addUserCredentials } = useAuth();
  
  // Initialize with sample data if localStorage is empty
  const initialMembers = () => {
    const saved = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "1", name: "John Doe", color: "#3B82F6", teamId: "team-1" },
      { id: "2", name: "Jane Smith", color: "#EC4899", teamId: "team-1" },
      { id: "3", name: "Bob Johnson", color: "#10B981", teamId: "team-1" },
      { id: "4", name: "Sarah Williams", color: "#F59E0B", teamId: "team-2" },
      { id: "5", name: "Mike Brown", color: "#6366F1", teamId: "team-2" },
    ];
  };

  const initialWorkdays = () => {
    const saved = localStorage.getItem(STORAGE_KEY_WORKDAYS);
    return saved ? JSON.parse(saved) : [];
  };

  const initialEvents = () => {
    const saved = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "event-1", name: "Team Meeting", date: "2025-05-20", color: "#F59E0B", teamId: "team-1" },
      { id: "event-2", name: "Feiertag", date: "2025-05-21", color: "#EF4444" },
    ];
  };
  
  const initialTeams = () => {
    const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: "team-1", name: "Team 1" },
      { id: "team-2", name: "Team 2" },
    ];
  };

  const initialNotes = () => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTES);
    return saved || "";
  };

  const [members, setMembers] = useState<TeamMember[]>(initialMembers());
  const [workdays, setWorkdays] = useState<WorkDay[]>(initialWorkdays());
  const [events, setEvents] = useState<TeamEvent[]>(initialEvents());
  const [teams, setTeams] = useState<Team[]>(initialTeams());
  const [activeTeamId, setActiveTeamId] = useState<string>("all");
  const [notes, setNotes] = useState<string>(initialNotes());

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WORKDAYS, JSON.stringify(workdays));
  }, [workdays]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTES, notes);
  }, [notes]);

  const addMember = (name: string, color: string, teamId: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can add team members");
      return;
    }
    
    const newMember = {
      id: Date.now().toString(),
      name,
      color,
      teamId,
    };
    setMembers([...members, newMember]);
    
    // Also create user credentials for this member
    addUserCredentials(name, "Hallo123", "user", newMember.id);
    
    toast.success(`${name} has been added to ${teams.find(t => t.id === teamId)?.name || teamId}`);
  };

  const removeMember = (id: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can remove team members");
      return;
    }
    
    setMembers(members.filter((member) => member.id !== id));
    setWorkdays(workdays.filter((workday) => workday.userId !== id));
  };

  const updateWorkLocation = (userId: string, date: string, location: WorkLocation) => {
    // Check if the day is a holiday (has "Feiertag" event)
    if (isHoliday(date) && location !== "") {
      toast.error("Cannot set work location on a holiday");
      return;
    }

    // Check if a workday entry exists for this user and date
    const existingIndex = workdays.findIndex(
      (workday) => workday.userId === userId && workday.date === date
    );

    if (existingIndex >= 0) {
      // Update existing entry
      const updatedWorkdays = [...workdays];
      updatedWorkdays[existingIndex] = { userId, date, location };
      setWorkdays(updatedWorkdays);
    } else {
      // Add new entry
      setWorkdays([...workdays, { userId, date, location }]);
    }
  };

  const addEvent = (name: string, date: string, color: string, teamId?: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can add team events");
      return;
    }
    
    const newEvent = {
      id: Date.now().toString(),
      name,
      date,
      color,
      teamId,
    };
    setEvents([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can remove team events");
      return;
    }
    
    setEvents(events.filter((event) => event.id !== id));
  };

  const updateEventDate = (id: string, newDate: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can modify team events");
      return;
    }
    
    const eventIndex = events.findIndex(event => event.id === id);
    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        date: newDate
      };
      setEvents(updatedEvents);
    }
  };

  const updateTeamName = (id: string, name: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can modify team names");
      return;
    }
    
    const teamIndex = teams.findIndex(team => team.id === id);
    if (teamIndex !== -1) {
      const updatedTeams = [...teams];
      updatedTeams[teamIndex] = {
        ...updatedTeams[teamIndex],
        name
      };
      setTeams(updatedTeams);
      toast.success(`Team name updated to "${name}"`);
    }
  };

  const getMemberById = (id: string): TeamMember | undefined => {
    return members.find((member) => member.id === id);
  };

  const getEventsByDate = (date: string): TeamEvent[] => {
    if (activeTeamId === "all") {
      // For "All Teams" view, show only global events and holidays
      return events.filter((event) => 
        event.date === date && 
        (!event.teamId || event.name === "Feiertag")
      );
    } else {
      // For specific team view, show only events for that team or global events
      return events.filter((event) => 
        event.date === date && 
        (!event.teamId || event.teamId === activeTeamId || event.name === "Feiertag")
      );
    }
  };

  const getWorkLocationByUserAndDate = (userId: string, date: string): WorkLocation => {
    const workday = workdays.find(
      (workday) => workday.userId === userId && workday.date === date
    );
    return workday ? workday.location : "";
  };

  const getTeamMembers = (teamId: string): TeamMember[] => {
    if (teamId === "all") {
      return members;
    }
    return members.filter((member) => member.teamId === teamId);
  };

  const addTeam = (name: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can add teams");
      return;
    }
    
    const newTeam = {
      id: `team-${Date.now()}`,
      name,
    };
    setTeams([...teams, newTeam]);
    toast.success(`Team "${name}" has been added`);
  };

  const removeTeam = (id: string) => {
    if (!isAdmin()) {
      toast.error("Only admin can remove teams");
      return;
    }
    
    // Don't allow removing if it has members
    const hasMembers = members.some(member => member.teamId === id);
    if (hasMembers) {
      toast.error("Cannot remove team with members. Please reassign or remove members first.");
      return;
    }
    
    setTeams(teams.filter((team) => team.id !== id));
    toast.success("Team has been removed");
  };

  const isHoliday = (date: string): boolean => {
    return events.some(event => 
      event.date === date && 
      event.name.toLowerCase() === "feiertag"
    );
  };

  const isDayEmpty = (date: string, teamId: string): boolean => {
    // If it's a holiday, don't highlight as empty
    if (isHoliday(date)) {
      return false;
    }

    if (teamId === "all") {
      // For "All Teams" view, check if there is at least one member from EACH team in the office
      // First, get all unique team IDs
      const uniqueTeamIds = [...new Set(members.map(member => member.teamId))];
      
      // Check each team to see if they have at least one member in the office
      for (const currentTeamId of uniqueTeamIds) {
        const teamMembers = getTeamMembers(currentTeamId);
        const hasOfficeMembers = teamMembers.some(member => 
          getWorkLocationByUserAndDate(member.id, date) === "office"
        );
        
        // If this team has no office members, the day is empty
        if (!hasOfficeMembers) {
          return true;
        }
      }
      
      // All teams have at least one member in the office
      return false;
    } else {
      // For specific team view, check if no one from that team is in the office
      const teamMembers = getTeamMembers(teamId);
      return !teamMembers.some(member => 
        getWorkLocationByUserAndDate(member.id, date) === "office"
      );
    }
  };

  return (
    <TeamContext.Provider
      value={{
        members,
        workdays,
        events,
        teams,
        activeTeamId,
        setActiveTeamId,
        addMember,
        removeMember,
        updateWorkLocation,
        addEvent,
        removeEvent,
        updateEventDate,
        getMemberById,
        getEventsByDate,
        getWorkLocationByUserAndDate,
        getTeamMembers,
        addTeam,
        removeTeam,
        updateTeamName,
        isHoliday,
        isDayEmpty,
        notes,
        setNotes,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
