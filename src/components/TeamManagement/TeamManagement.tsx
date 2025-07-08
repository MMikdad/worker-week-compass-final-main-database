
import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TeamManagement: React.FC = () => {
  const { teams, removeTeam, members, updateTeamName } = useTeam();
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState("");

  const handleRemoveTeam = (teamId: string) => {
    removeTeam(teamId);
  };

  const startEditing = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId);
    setNewTeamName(currentName);
  };

  const cancelEditing = () => {
    setEditingTeamId(null);
    setNewTeamName("");
  };

  const saveTeamName = (teamId: string) => {
    if (newTeamName.trim()) {
      updateTeamName(teamId, newTeamName.trim());
      cancelEditing();
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Manage Teams</h3>
      <div className="space-y-2">
        {teams.map((team) => {
          const teamMembers = members.filter(m => m.teamId === team.id);
          return (
            <div 
              key={team.id} 
              className="p-3 bg-white border border-gray-200 rounded-md shadow-sm flex justify-between items-center"
            >
              <div className="flex-1">
                {editingTeamId === team.id ? (
                  <div className="flex gap-2 items-center">
                    <Input 
                      value={newTeamName} 
                      onChange={(e) => setNewTeamName(e.target.value)} 
                      className="text-sm" 
                    />
                    <Button variant="ghost" size="icon" onClick={() => saveTeamName(team.id)}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-medium">{team.name}</span>
                    <span className="text-xs text-gray-500">
                      {teamMembers.length} {teamMembers.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                )}
              </div>
              
              {editingTeamId !== team.id && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditing(team.id, team.name)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500" 
                    onClick={() => handleRemoveTeam(team.id)}
                    disabled={teamMembers.length > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamManagement;
