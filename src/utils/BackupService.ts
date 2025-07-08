
import { toast } from "sonner";

// Backup type definition
export type BackupType = 'weekly' | 'monthly';

// Backup data structure
export interface Backup {
  id: string;
  data: string; // Stringified data
  timestamp: number;
  type: BackupType;
}

class BackupService {
  private static readonly WEEKLY_BACKUP_KEY = 'team-calendar-weekly-backup';
  private static readonly MONTHLY_BACKUP_KEY = 'team-calendar-monthly-backup';

  // Save a weekly backup
  public static saveWeeklyBackup(): boolean {
    try {
      // Get all data from localStorage
      const allData = this.getAllLocalStorageData();
      
      // Create a backup object
      const backup: Backup = {
        id: `weekly-${Date.now()}`,
        data: JSON.stringify(allData),
        timestamp: Date.now(),
        type: 'weekly'
      };
      
      // Store the backup
      localStorage.setItem(this.WEEKLY_BACKUP_KEY, JSON.stringify(backup));
      
      toast.success('Weekly backup created successfully');
      return true;
    } catch (error) {
      console.error('Weekly backup failed:', error);
      toast.error('Weekly backup failed');
      return false;
    }
  }
  
  // Save a monthly backup
  public static saveMonthlyBackup(): boolean {
    try {
      // Get all data from localStorage
      const allData = this.getAllLocalStorageData();
      
      // Create a backup object
      const backup: Backup = {
        id: `monthly-${Date.now()}`,
        data: JSON.stringify(allData),
        timestamp: Date.now(),
        type: 'monthly'
      };
      
      // Store the backup
      localStorage.setItem(this.MONTHLY_BACKUP_KEY, JSON.stringify(backup));
      
      toast.success('Monthly backup created successfully');
      return true;
    } catch (error) {
      console.error('Monthly backup failed:', error);
      toast.error('Monthly backup failed');
      return false;
    }
  }
  
  // Initialize automated backup system
  public static initializeAutomatedBackups(): void {
    // Check if we need to create a new weekly backup
    const lastWeeklyBackup = this.getWeeklyBackup();
    const weeklyBackupNeeded = !lastWeeklyBackup || 
      (Date.now() - lastWeeklyBackup.timestamp > 7 * 24 * 60 * 60 * 1000); // 7 days
    
    // Check if we need to create a new monthly backup
    const lastMonthlyBackup = this.getMonthlyBackup();
    const monthlyBackupNeeded = !lastMonthlyBackup || 
      (Date.now() - lastMonthlyBackup.timestamp > 30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Create backups if needed
    if (weeklyBackupNeeded) {
      console.log('Creating weekly backup...');
      this.saveWeeklyBackup();
    }
    
    if (monthlyBackupNeeded) {
      console.log('Creating monthly backup...');
      this.saveMonthlyBackup();
    }
    
    // Set up interval for future checks
    // We'll check daily if we need to create a new backup
    setInterval(() => {
      const now = new Date();
      
      // Check for weekly backup on Sundays at 1 AM
      if (now.getDay() === 0 && now.getHours() === 1 && now.getMinutes() < 5) {
        this.saveWeeklyBackup();
      }
      
      // Check for monthly backup on the 1st of the month at 2 AM
      if (now.getDate() === 1 && now.getHours() === 2 && now.getMinutes() < 5) {
        this.saveMonthlyBackup();
      }
      
    }, 5 * 60 * 1000); // Check every 5 minutes
  }
  
  // Get the weekly backup
  public static getWeeklyBackup(): Backup | null {
    const backupData = localStorage.getItem(this.WEEKLY_BACKUP_KEY);
    return backupData ? JSON.parse(backupData) : null;
  }
  
  // Get the monthly backup
  public static getMonthlyBackup(): Backup | null {
    const backupData = localStorage.getItem(this.MONTHLY_BACKUP_KEY);
    return backupData ? JSON.parse(backupData) : null;
  }
  
  // Get all data from localStorage
  private static getAllLocalStorageData(): Record<string, string> {
    const data: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          data[key] = value;
        }
      }
    }
    return data;
  }
}

export default BackupService;
