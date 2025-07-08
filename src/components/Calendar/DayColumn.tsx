
import React from "react";
import { useTeam, WorkLocation } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DayColumnProps {
  date: Date;
  isMonthView?: boolean;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, isMonthView = false }) => {
  const { 
    members, 
    events, 
    getWorkLocationByUserAndDate, 
    updateWorkLocation, 
    getEventsByDate, 
    activeTeamId,
    getTeamMembers,
    removeEvent,
    updateEventDate,
    isHoliday,
    teams,
    isDayEmpty
  } = useTeam();
  
  const { isAdmin, isSelf } = useAuth();
  
  const dateString = format(date, "yyyy-MM-dd");
  let dayEvents = getEventsByDate(dateString);
  
  // Only show teamübergreifend (team-spanning) events in "all" view
  if (activeTeamId === "all") {
    dayEvents = dayEvents.filter(event => !event.teamId || event.name === "Feiertag");
  }
  
  const isWeekend = [0, 6].includes(date.getDay());
  const isToday = new Date().toDateString() === date.toDateString();
  const teamMembers = getTeamMembers(activeTeamId);
  const holiday = isHoliday(dateString);
  const isEmpty = isDayEmpty(dateString, activeTeamId);
  
  // Check if user can modify this specific day column
  const canModifyStatus = (userId: string) => {
    // Admin can modify anyone's status
    if (isAdmin()) return true;
    
    // Regular users can only modify their own status and only in their team view (not in All Teams view)
    return isSelf(userId) && activeTeamId !== "all";
  };
  
  const handleLocationToggle = (userId: string, currentLocation: WorkLocation) => {
    // Don't allow changes on holidays
    if (holiday) {
      return;
    }
    
    // Check permission
    if (!canModifyStatus(userId)) {
      if (isSelf(userId) && activeTeamId === "all") {
        toast.error("You cannot change availability from the All Teams view. Please switch to your team view.");
      } else if (!isSelf(userId)) {
        toast.error("You can only update your own availability");
      }
      return;
    }
    
    let newLocation: WorkLocation = "";
    
    // Cycle through options: empty -> office -> home -> urlaub -> other -> empty
    if (!currentLocation) newLocation = "office";
    else if (currentLocation === "office") newLocation = "home";
    else if (currentLocation === "home") newLocation = "urlaub";
    else if (currentLocation === "urlaub") newLocation = "other";
    
    updateWorkLocation(userId, dateString, newLocation);
  };

  const handleDeleteEvent = (eventId: string) => {
    removeEvent(eventId);
  };

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData("eventId", eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData("eventId");
    if (eventId) {
      updateEventDate(eventId, dateString);
    }
  };

  const getLocationText = (location: WorkLocation): string => {
    switch (location) {
      case "office": return "Office";
      case "home": return "Home Office";
      case "urlaub": return "Urlaub";
      case "other": return "Other";
      default: return "Not Set";
    }
  };

  const getLocationColor = (location: WorkLocation): string => {
    switch (location) {
      case "office": return "text-green-700 dark:text-green-400";
      case "home": return "text-purple-700 dark:text-purple-400";
      case "urlaub": return "text-blue-700 dark:text-blue-400";
      case "other": return "text-amber-700 dark:text-amber-400";
      default: return "text-gray-500 dark:text-gray-400";
    }
  };

  const getLocationBgColor = (location: WorkLocation): string => {
    switch (location) {
      case "office": return "bg-green-50 dark:bg-green-900/20";
      case "home": return "bg-purple-50 dark:bg-purple-900/20";
      case "urlaub": return "bg-blue-50 dark:bg-blue-900/20";
      case "other": return "bg-amber-50 dark:bg-amber-900/20";
      default: return "";
    }
  };

  // Get all team members with their locations for the popup
  const getMembersByTeam = () => {
    const teamData: Record<string, { name: string; members: { name: string; color: string; location: WorkLocation }[] }> = {};
    
    // Initialize teams
    teams.forEach(team => {
      teamData[team.id] = {
        name: team.name,
        members: []
      };
    });
    
    // Add members with their locations
    members.forEach(member => {
      if (!member.teamId) return;
      
      const location = getWorkLocationByUserAndDate(member.id, dateString);
      if (location) {  // Only add members with a location set
        if (teamData[member.teamId]) {
          teamData[member.teamId].members.push({
            name: member.name,
            color: member.color,
            location
          });
        }
      }
    });
    
    // Filter out teams with no members
    return Object.values(teamData).filter(team => team.members.length > 0);
  };

  // Highlight days with no office attendance
  const highlightNoPresence = isEmpty && !holiday;

  // Render different content based on view mode
  if (isMonthView) {
    // For month view, only show members who are in office
    const visibleMembers = 3; // Number of members to show before "+X more"
    const officeMembers = teamMembers.filter(member => 
      getWorkLocationByUserAndDate(member.id, dateString) === "office"
    );
    
    const hasMoreMembers = officeMembers.length > visibleMembers;
    const teamsData = getMembersByTeam();

    return (
      <div 
        className={cn(
          "flex flex-col h-full",
          highlightNoPresence && "bg-red-50 dark:bg-red-900/20"
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Team Events */}
        <div className="mb-1">
          {dayEvents.map((event) => (
            <div 
              key={event.id} 
              className={cn(
                "text-[10px] mb-1 p-0.5 rounded text-white dark:text-white truncate",
                event.name === "Feiertag" ? "bg-pink-500" : ""
              )}
              style={{ backgroundColor: event.name !== "Feiertag" ? event.color : "" }}
              title={event.name}
            >
              {event.name.substring(0, 15)}{event.name.length > 15 ? "..." : ""}
            </div>
          ))}
        </div>
        
        {/* Team Members - OFFICE ONLY */}
        <div className="flex flex-col space-y-0.5">
          {officeMembers.slice(0, visibleMembers).map((member) => (
            <div 
              key={member.id}
              className="flex items-center text-[10px] py-0.5 px-1 rounded bg-green-50 dark:bg-green-900/20 text-black dark:text-white"
            >
              <div 
                className="w-1 h-1 rounded-full mr-1" 
                style={{ backgroundColor: member.color }}
              />
              <span className="truncate">{member.name.split(' ')[0]}</span>
              <span className="ml-1 text-green-700 dark:text-green-400">(o)</span>
            </div>
          ))}
          {hasMoreMembers && (
            <Popover>
              <PopoverTrigger asChild>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded px-1 py-0.5 text-center cursor-pointer">
                  +{officeMembers.length - visibleMembers} more
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-2 bg-white dark:bg-gray-800 dark:text-white">
                <div className="space-y-3">
                  {teamsData.map((team) => {
                    // Filter for office members only in the popup
                    const officeOnly = team.members.filter(m => m.location === "office");
                    if (officeOnly.length === 0) return null;
                    
                    return (
                      <div key={team.name} className="space-y-1">
                        <h4 className="font-medium border-b border-gray-200 dark:border-gray-700 pb-1">{team.name}:</h4>
                        <div className="pl-2">
                          {officeOnly.map((member, i) => (
                            <div 
                              key={i} 
                              className="flex items-center gap-2 text-xs py-1"
                            >
                              <div 
                                className="w-1 h-3 rounded-sm" 
                                style={{ backgroundColor: member.color }}
                              />
                              <span>{member.name}</span>
                              <span className="text-green-700 dark:text-green-400">
                                (Office)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    );
  }

  // Week view - keep as is
  return (
    <div 
      className={cn(
        "flex flex-col border-r border-gray-800 min-w-[110px] lg:min-w-[140px] w-[20%]",
        highlightNoPresence && "bg-red-50 dark:bg-red-900/20"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={cn(
        "py-2 px-3 text-center border-b border-gray-600",
        isToday && "bg-blue-100 dark:bg-blue-900/30",
        holiday && "bg-pink-100 dark:bg-pink-900/30"
      )}>
        <div className="font-medium dark:text-white">{format(date, "EEE")}</div>
        <div className={cn(
          "text-lg dark:text-white",
          isToday && "font-bold text-blue-600 dark:text-blue-400"
        )}>
          {format(date, "d")}
        </div>
      </div>
      
      {/* Team Events - Fixed height */}
      <div className={cn(
        "px-1 py-2 border-b border-gray-600",
        "h-[80px] overflow-y-auto"
      )}>
        {dayEvents.map((event) => (
          <div 
            key={event.id} 
            className={cn(
              "text-xs mb-1 p-1 rounded text-white flex justify-between items-center",
              event.name === "Feiertag" ? "bg-pink-500" : ""
            )}
            style={{ backgroundColor: event.name !== "Feiertag" ? event.color : "" }}
            draggable={isAdmin()}
            onDragStart={(e) => handleDragStart(e, event.id)}
          >
            <div className="truncate flex-1">
              <span>{event.name}</span>
              {activeTeamId === "all" && event.teamId && (
                <span className="ml-1 text-[10px] opacity-80">
                  ({event.teamId === "team-1" ? "Team 1" : "Team 2"})
                </span>
              )}
              {!event.teamId && event.name !== "Feiertag" && (
                <span className="ml-1 text-[10px] opacity-80">(teamübergreifend)</span>
              )}
            </div>
            {isAdmin() && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 text-white hover:bg-transparent hover:text-red-200"
                onClick={() => handleDeleteEvent(event.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {/* Team Members - Fixed height for consistent layout */}
      <div className="overflow-y-auto" style={{ height: '400px' }}>
        {teamMembers.map((member) => {
          const location = getWorkLocationByUserAndDate(member.id, dateString);
          const canEdit = canModifyStatus(member.id);
          
          return (
            <div 
              key={member.id}
              onClick={() => canEdit && handleLocationToggle(member.id, location)}
              className={cn(
                "border-b border-gray-400 dark:border-gray-700 p-2 flex items-center gap-2",
                "hover:bg-gray-50 dark:hover:bg-gray-700",
                getLocationBgColor(location),
                holiday && "opacity-50",
                canEdit ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div 
                className="w-1 h-4 rounded-sm" 
                style={{ backgroundColor: member.color }}
              />
              
              <div className="flex-1 flex flex-col">
                <span className="text-xs font-medium truncate dark:text-white">{member.name}</span>
                <span className={cn(
                  "text-xs",
                  getLocationColor(location)
                )}>
                  {getLocationText(location)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayColumn;
