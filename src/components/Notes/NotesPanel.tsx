
import React, { useState } from "react";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Pencil } from "lucide-react";
import { toast } from "sonner";

const NotesPanel: React.FC = () => {
  const { notes, setNotes } = useTeam();
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(notes);

  const handleSaveNotes = () => {
    setNotes(editValue);
    setIsEditing(false);
    toast.success("Notes updated successfully");
  };

  const handleEditClick = () => {
    setEditValue(notes);
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Notizen</h2>
        {isAdmin() && !isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEditClick} className="text-gray-500">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
        {isAdmin() && isEditing && (
          <Button variant="ghost" size="sm" onClick={handleSaveNotes} className="text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full min-h-[120px]"
          placeholder="Add general notes for all users..."
        />
      ) : (
        <div className="p-3 bg-gray-50 rounded border border-gray-200 min-h-[120px] whitespace-pre-wrap text-sm">
          {notes ? notes : <span className="text-gray-400 italic">No notes have been added yet</span>}
        </div>
      )}
    </div>
  );
};

export default NotesPanel;
