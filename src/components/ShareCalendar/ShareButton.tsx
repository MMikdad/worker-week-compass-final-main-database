
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ShareButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const generateShareUrl = () => {
    // Generate a simple share ID (in a real app you'd want to use a more secure method)
    const shareId = Math.random().toString(36).substring(2, 10);
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/shared/${shareId}`;
    setShareUrl(url);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      generateShareUrl();
    }
  };

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          toast.success("Share link copied to clipboard");
        })
        .catch(() => {
          toast.error("Failed to copy link");
        });
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => handleOpenChange(true)} className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Share Calendar
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Calendar</DialogTitle>
            <DialogDescription>
              Anyone with this link can view your team's calendar but cannot make changes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <Input value={shareUrl} readOnly onClick={() => copyToClipboard()} />
            <p className="text-sm text-gray-500">Click the link to copy it to your clipboard</p>
          </div>
          
          <DialogFooter>
            <Button onClick={() => copyToClipboard()}>
              Copy Link
            </Button>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
