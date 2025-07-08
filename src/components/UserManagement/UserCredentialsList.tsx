
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const UserCredentialsList: React.FC = () => {
  const { getUserCredentials, resetUserPassword, isAdmin, updateUserRole, saveCredentials } = useAuth();
  
  if (!isAdmin()) {
    return null;
  }
  
  const credentials = getUserCredentials();

  const handleResetPassword = (username: string) => {
    resetUserPassword(username);
  };

  const handleRoleChange = (username: string, isAdmin: boolean) => {
    if (username === 'admin') {
      toast.error("Cannot change role for the main admin account");
      return;
    }
    
    const role = isAdmin ? 'admin' : 'user';
    updateUserRole(username, role);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">User Credentials Management</h2>
      <div className="space-y-2">
        {credentials.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Access</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {credentials.map((cred) => (
                  <tr key={cred.username}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{cred.username}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cred.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {cred.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={cred.role === 'admin'}
                          onCheckedChange={(checked) => handleRoleChange(cred.username, checked)}
                          disabled={cred.username === 'admin'}
                        />
                        <Label htmlFor={`role-${cred.username}`}>
                          {cred.role === 'admin' ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {cred.isDefaultPassword ? (
                        <span className="text-amber-500">Default Password</span>
                      ) : (
                        <span className="text-green-500">Custom Password</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleResetPassword(cred.username)}
                        disabled={cred.username === 'admin'}
                        className={cred.username === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}
                      >
                        Reset Password
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
          <p><strong>Note:</strong> Resetting a password will change it to the default password "Hallo123".</p>
          <p>Users will be prompted to change their password upon next login.</p>
          <p className="mt-2"><strong>Admin Access:</strong> Users with admin access can add/remove team members, manage teams, and add events.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="default"
            onClick={() => saveCredentials(credentials)}
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCredentialsList;
