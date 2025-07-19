import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Upload } from "lucide-react";

const eventFormSchema = insertEventSchema.extend({
  dateTime: z.string().min(1, "Date and time is required"),
  endDateTime: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EventUploadModal({ open, onOpenChange }: EventUploadModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      campusId: user?.campusId || 1,
      createdBy: user?.id || 1,
      rating: 5,
      participantCount: 0,
      expense: "0",
    }
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/events", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Event created successfully",
        description: "Your event has been added to the calendar.",
      });
      reset();
      setSelectedFiles([]);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create event",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 3) {
      toast({
        title: "Too many files",
        description: "You can upload up to 3 images only.",
        variant: "destructive",
      });
      return;
    }
    setSelectedFiles(files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="programType">Program Type *</Label>
              <Select onValueChange={(value) => setValue("programType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Talk">Talk</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Hackathon">Hackathon</SelectItem>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
              {errors.programType && (
                <p className="text-sm text-red-600 mt-1">{errors.programType.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={3}
              placeholder="Describe your event..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="mode">Mode *</Label>
              <Select onValueChange={(value) => setValue("mode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              {errors.mode && (
                <p className="text-sm text-red-600 mt-1">{errors.mode.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="participantCount">Participant Count</Label>
              <Input
                id="participantCount"
                type="number"
                {...register("participantCount", { valueAsNumber: true })}
                placeholder="Expected participants"
              />
            </div>
            
            <div>
              <Label htmlFor="expense">Expense (INR)</Label>
              <Input
                id="expense"
                {...register("expense")}
                placeholder="Event cost"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="dateTime">Date & Time *</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                {...register("dateTime")}
              />
              {errors.dateTime && (
                <p className="text-sm text-red-600 mt-1">{errors.dateTime.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="endDateTime">End Date & Time</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                {...register("endDateTime")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rating">Rating (1-5 stars) *</Label>
            <Select onValueChange={(value) => setValue("rating", parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
              </SelectContent>
            </Select>
            {errors.rating && (
              <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="images">Upload Images (up to 3)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" className="mt-2">
                  Choose Files
                </Button>
              </label>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="text-xs text-gray-500">
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
