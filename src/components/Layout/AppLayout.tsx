
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import UserList from "@/components/UserManagement/UserList";
import AddUserForm from "@/components/UserManagement/AddUserForm";
import AddEventForm from "@/components/EventManagement/AddEventForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Home, Plus } from "lucide-react";
import ShareButton from "@/components/ShareCalendar/ShareButton";
import { useTeam } from "@/context/TeamContext";
import TeamManagement from "@/components/TeamManagement/TeamManagement";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import NotesPanel from "@/components/Notes/NotesPanel";

const AppLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { teams, activeTeamId, setActiveTeamId, addTeam } = useTeam();
  const [newTeamDialog, setNewTeamDialog] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName("");
      setNewTeamDialog(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="mb-8 flex justify-between items-center">
      <div className="text-center ml-40">
          <h1 className="text-3xl font-bold mb-2">Team Calendar</h1>
          <p className="mb-2">
            Manage your team's office and remote work schedule
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">Verantwortlich: Maher Mikdad</p>
        </div>
        
        <div className="flex items-center gap-4">
          <ShareButton />
          <span className="text-sm font-medium">
            Signed in as <span className="text-blue-600 dark:text-blue-400">{user?.username}</span> 
            {isAdmin() && <span className="ml-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-xs">Admin</span>}
          </span>
          <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Team Selection Tabs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Tabs 
            defaultValue="all" 
            value={activeTeamId} 
            onValueChange={setActiveTeamId}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-2">
              <TabsList className="flex-grow">
                <TabsTrigger value="all" className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  <span>All Teams</span>
                </TabsTrigger>
                {teams.map(team => (
                  <TabsTrigger key={team.id} value={team.id}>
                    {team.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {isAdmin() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setNewTeamDialog(true)}
                  className="ml-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team
                </Button>
              )}
            </div>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyCalendar />
          
          <div className="mt-6">
            <Tabs defaultValue="legend" className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <TabsList className="w-full">
                <TabsTrigger value="legend" className="flex-1">Legend</TabsTrigger>
                <TabsTrigger value="help" className="flex-1">Tips & Help</TabsTrigger>
              </TabsList>
              <TabsContent value="legend" className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span>In Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    <span>Home Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span>Urlaub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                    <span>Other</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span>Not Set</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                    <span>Holiday</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="help" className="p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Click on a team member's cell to cycle through work locations</li>
                  <li>Use the tabs above to switch between teams or view all teams</li>
                  <li>Days highlighted in red have no one in the office</li>
                  <li>Drag and drop events to change dates (admin only)</li>
                  <li>Holidays marked as "Feiertag" are shown in pink</li>
                  {isAdmin() && <li><strong>Admin:</strong> Only you can add/remove team members and events</li>}
                  {!isAdmin() && <li>Only admins can add/remove team members and events</li>}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="space-y-6">
          <NotesPanel />
          
          <Tabs defaultValue="users" className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <TabsList className="w-full">
              <TabsTrigger value="users" className="flex-1">Team</TabsTrigger>
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
              {isAdmin() && (
                <TabsTrigger value="manage" className="flex-1">Manage</TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="users" className="p-4 space-y-6">
              {isAdmin() ? (
                <>
                  <AddUserForm />
                  <UserList />
                </>
              ) : (
                <div>
                  <p className="text-amber-600 dark:text-amber-400 mb-4">Only admins can manage team members</p>
                  <UserList />
                </div>
              )}
            </TabsContent>
            <TabsContent value="events" className="p-4">
              {isAdmin() ? (
                <AddEventForm />
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-amber-600 dark:text-amber-400">Only admins can add team events</p>
                </div>
              )}
            </TabsContent>
            {isAdmin() && (
              <TabsContent value="manage" className="p-4">
                <TeamManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>

      {/* Add Team Dialog */}
      <Dialog open={newTeamDialog} onOpenChange={setNewTeamDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Team</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Team Name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTeamDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTeam}>Add Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppLayout;
