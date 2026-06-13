import { Button } from "@/ui";

// 1. Add 'open' and 'onClose' to the component interface structure
interface InspectionBookingModalProps {
  propertyId: string;
  open: boolean;
  onClose: () => void;
}

// 2. Destructure the new parameters into your functional component argument pool
export function InspectionBookingModal({ 
  propertyId, 
  open, 
  onClose 
}: InspectionBookingModalProps) {
  
  // 3. Simple guard clause: If open is false, don't render anything onto the layout screen
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4 space-y-4">
        <h3 className="text-xl font-bold">Book Property Inspection</h3>
        <p className="text-sm text-gray-500">Property ID: {propertyId}</p>
        
        {/* Your modal internal form fields can go right here */}
        
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => console.log("Booking submission initialized...")}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
