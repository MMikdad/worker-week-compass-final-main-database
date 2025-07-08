import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const WORK_LOCATIONS = [
  { value: "office", label: "Office" },
  { value: "home", label: "Home Office" },
  { value: "urlaub", label: "Urlaub" },
  { value: "other", label: "Other" },
  { value: "", label: "-- None --" },
];

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

const WorkLocationManager: React.FC = () => {
  const { user } = useAuth();
  const { updateWorkLocation, getWorkLocationByUserAndDate } = useTeam();
  const today = getToday();
  const [location, setLocation] = useState<string>(
    user ? getWorkLocationByUserAndDate(user.memberId || user.username, today) : ""
  );
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    setSaving(true);
    updateWorkLocation(user.memberId || user.username, today, location);
    setTimeout(() => setSaving(false), 500); // Simulate save
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Today's Work Location</h2>
      <div className="flex items-center gap-4">
        <select
          className="border rounded px-2 py-1"
          value={location}
          onChange={e => setLocation(e.target.value)}
        >
          {WORK_LOCATIONS.map(loc => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default WorkLocationManager; 