
import React, { useEffect } from "react";
import { TeamProvider } from "@/context/TeamContext";
import AppLayout from "@/components/Layout/AppLayout";
import ThemeSwitcher from "@/components/ThemeSwitcher/ThemeSwitcher";
import BackupService from "@/utils/BackupService";

const Index = () => {
  // Initialize automated backup system
  useEffect(() => {
    BackupService.initializeAutomatedBackups();
    
    // Also check on login if we need to create backups
    const checkBackups = () => {
      const lastWeeklyBackup = BackupService.getWeeklyBackup();
      if (!lastWeeklyBackup || Date.now() - lastWeeklyBackup.timestamp > 7 * 24 * 60 * 60 * 1000) {
        BackupService.saveWeeklyBackup();
      }
      
      const lastMonthlyBackup = BackupService.getMonthlyBackup();
      if (!lastMonthlyBackup || Date.now() - lastMonthlyBackup.timestamp > 30 * 24 * 60 * 60 * 1000) {
        BackupService.saveMonthlyBackup();
      }
    };
    
    checkBackups();
  }, []);
  
  return (
    <TeamProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        <div className="absolute top-4 left-40 z-20">
          <ThemeSwitcher />
        </div>
        <AppLayout />
      </div>
    </TeamProvider>
  );
};

export default Index;
