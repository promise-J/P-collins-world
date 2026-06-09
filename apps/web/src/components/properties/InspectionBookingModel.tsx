import { Button } from "@/ui";

interface InspectionBookingModalProps {
  propertyId: string;
}


export function InspectionBookingModal({propertyId}: InspectionBookingModalProps) {
  console.log(propertyId)

    return(
     <Button>
       Book Inspection
     </Button>
    );
   }