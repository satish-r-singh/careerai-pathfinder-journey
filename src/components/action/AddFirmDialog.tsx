
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { NewFirmData } from '@/types/targetFirms';

interface AddFirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newFirm: NewFirmData;
  onNewFirmChange: (firm: NewFirmData) => void;
  onAddFirm: () => void;
}

const AddFirmDialog = ({ 
  isOpen, 
  onOpenChange, 
  newFirm, 
  onNewFirmChange, 
  onAddFirm 
}: AddFirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Target Company</DialogTitle>
          <DialogDescription>Add a company to monitor for job opportunities and updates</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={newFirm.name}
              onChange={(e) => onNewFirmChange({...newFirm, name: e.target.value})}
              placeholder="Enter company name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={newFirm.industry}
                onChange={(e) => onNewFirmChange({...newFirm, industry: e.target.value})}
                placeholder="e.g., Technology"
              />
            </div>
            <div>
              <Label htmlFor="size">Company Size</Label>
              <Select value={newFirm.size} onValueChange={(value) => onNewFirmChange({...newFirm, size: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50 employees</SelectItem>
                  <SelectItem value="50-200">50-200 employees</SelectItem>
                  <SelectItem value="200-1000">200-1,000 employees</SelectItem>
                  <SelectItem value="1000-5000">1,000-5,000 employees</SelectItem>
                  <SelectItem value="5000+">5,000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={newFirm.location}
                onChange={(e) => onNewFirmChange({...newFirm, location: e.target.value})}
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={newFirm.priority} onValueChange={(value: any) => onNewFirmChange({...newFirm, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              value={newFirm.website}
              onChange={(e) => onNewFirmChange({...newFirm, website: e.target.value})}
              placeholder="https://company.com"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onAddFirm}>
              Add Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFirmDialog;
