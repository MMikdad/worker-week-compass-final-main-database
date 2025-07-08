
import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const AddUserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [teamId, setTeamId] = useState("");
  const { addMember, teams } = useTeam();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && teamId) {
      addMember(name, color, teamId);
      setName("");
      setColor("#3B82F6");
      // Don't reset teamId to allow adding multiple members to the same team
    } else {
      toast.error("Please enter a name and select a team for the member");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter team member name"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <Select 
            value={teamId} 
            onValueChange={setTeamId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="flex gap-2 items-center">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <span className="text-sm text-gray-500">{color}</span>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Add Team Member
        </Button>
      </form>
    </div>
  );
};

export default AddUserForm;
