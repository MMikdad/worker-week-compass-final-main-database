
import React from "react";
import { useTeam } from "@/context/TeamContext";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import UserCredentialsList from "./UserCredentialsList";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
import WorkLocationManager from "./WorkLocationManager";

const UserList: React.FC = () => {
  const { members, removeMember, teams, activeTeamId } = useTeam();
  const { isAdmin } = useAuth();

  const handleRemoveUser = (id: string, name: string) => {
    removeMember(id);
    toast.success(`${name} has been removed from the team`);
  };

  // Filter members by activeTeamId if it's not "all"
  const filteredMembers = activeTeamId === "all" 
    ? members 
    : members.filter(member => member.teamId === activeTeamId);

  // Get team name from teamId
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Unknown Team";
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">
          {activeTeamId === "all" ? "All Team Members" : `${getTeamName(activeTeamId)} Members`}
        </h2>
        <div className="space-y-2">
          {filteredMembers.length === 0 ? (
            <p className="text-gray-500">No team members added yet.</p>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: member.color }}
                  />
                  <div>
                    <span className="block">{member.name}</span>
                    {activeTeamId === "all" && (
                      <span className="text-xs text-gray-500">{getTeamName(member.teamId)}</span>
                    )}
                  </div>
                </div>
                {isAdmin() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveUser(member.id, member.name)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
        
        {isAdmin() && <UserCredentialsList />}
        {!isAdmin() && <>
          <ChangePasswordForm />
          <WorkLocationManager />
        </>}
      </div>
    </>
  );
};

export default UserList;
