
import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddEventForm: React.FC = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [color, setColor] = useState("#F59E0B"); // Default to amber
  const [isHoliday, setIsHoliday] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("all-teams");
  const { addEvent, teams } = useTeam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && date) {
      const dateString = format(date, "yyyy-MM-dd");
      // If isHoliday is checked, override the name and color and make it for all teams
      const eventName = isHoliday ? "Feiertag" : name;
      const eventColor = isHoliday ? "#EF4444" : color;
      const teamId = isHoliday ? undefined : (selectedTeam === "all-teams" ? undefined : selectedTeam);
      
      addEvent(eventName, dateString, eventColor, teamId);
      setName("");
      setDate(undefined);
      setColor("#F59E0B");
      setIsHoliday(false);
      setSelectedTeam("all-teams");
      
      const successMsg = isHoliday ? 
        "Public holiday added" : 
        `Event "${eventName}" has been added${teamId ? ` to ${teams.find(t => t.id === teamId)?.name}` : " for all teams"}`;
      
      toast.success(successMsg);
    } else {
      toast.error("Please enter a name and select a date");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Add Office Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <Input
            id="eventName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter event name"
            className="w-full"
            disabled={isHoliday}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isHoliday" 
            checked={isHoliday} 
            onCheckedChange={(checked) => {
              setIsHoliday(checked === true);
              if (checked) {
                setName("Feiertag");
                setColor("#EF4444");
                setSelectedTeam("all-teams"); // Public holidays affect all teams
              }
            }}
          />
          <label
            htmlFor="isHoliday"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Mark as public holiday (Feiertag)
          </label>
        </div>
        
        {!isHoliday && (
          <div>
            <label htmlFor="eventTeam" className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <Select
              value={selectedTeam}
              onValueChange={setSelectedTeam}
            >
              <SelectTrigger id="eventTeam" className="w-full">
                <SelectValue placeholder="Select team (none = teamübergreifend)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-teams">All Teams (teamübergreifend)</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="eventDate"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label htmlFor="eventColor" className="block text-sm font-medium text-gray-700 mb-1">
            Event Color
          </label>
          <div className="flex gap-2 items-center">
            <Input
              id="eventColor"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
              disabled={isHoliday}
            />
            <span className="text-sm text-gray-500">{color}</span>
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          Add Event
        </Button>
      </form>
    </div>
  );
};

export default AddEventForm;
