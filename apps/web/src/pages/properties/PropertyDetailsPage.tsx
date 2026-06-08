import { InspectionBookingModal } from "@/components/properties/InspectionBookingModel";
import { PropertyRecommendations } from "@/components/properties/PropertyRecommendations";
import { useProperty } from "@/hooks/useProperty";
import { Skeleton } from "@/ui";
import Container from "@/ui/components/Container";
import { useParams } from "react-router-dom";

export default function PropertyDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useProperty(id);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <Container>
    <div
      className="
     space-y-8
    "
    >
      {/* <PropertyGallery images={data.images} /> */}

      {/* <PropertyStats property={data} /> */}

      <InspectionBookingModal propertyId={id ?? ""} />

      <PropertyRecommendations />
    </div>
    </Container>
  );
}
