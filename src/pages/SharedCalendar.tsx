
import React from "react";
import { TeamProvider, useTeam } from "@/context/TeamContext";
import WeeklyCalendar from "@/components/Calendar/WeeklyCalendar";
import { useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";

const SharedCalendarContent = () => {
  const { teams, activeTeamId, setActiveTeamId, notes } = useTeam();
  const { shareId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
            <ThemeSwitcher />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Team Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Shared View - Read Only
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-2">Verantwortlich: Maher Mikdad</p>
        </header>

        {/* Team Selection Tabs */}
        <div className="mb-6">
          <Tabs 
            defaultValue="all" 
            value={activeTeamId} 
            onValueChange={setActiveTeamId}
          >
            <TabsList className="w-full">
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
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <WeeklyCalendar />
          </div>
          
          <div className="space-y-6">
            {notes && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-xl font-bold mb-2 dark:text-white">Notizen</h2>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 whitespace-pre-wrap text-sm dark:text-gray-200">
                  {notes}
                </div>
              </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="mb-2">
                <h3 className="font-semibold dark:text-white">Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm dark:text-gray-300">In Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm dark:text-gray-300">Home Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm dark:text-gray-300">Urlaub</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm dark:text-gray-300">Other</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-sm dark:text-gray-300">Holiday</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-300 text-sm">
                  This is a shared view of the team calendar. You cannot make changes to the schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SharedCalendar = () => {
  return (
    <ThemeProvider>
      <TeamProvider>
        <SharedCalendarContent />
      </TeamProvider>
    </ThemeProvider>
  );
};

export default SharedCalendar;
