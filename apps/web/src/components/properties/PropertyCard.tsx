import { Badge, Button, Card } from "@/ui";


export function PropertyCard({ property }: any) {
  return (
    <Card>
      <img
        src={property.coverImage}
        className="h-60 w-full rounded-lg object-cover"/>

      <div className="mt-4 space-y-2">
        <Badge>{property.status}</Badge>

        <h3 className="text-lg font-semibold">
          {property.title}
        </h3>

        <p>{property.location}</p>

        <p className="text-xl font-bold">
          ₦{property.price?.toLocaleString()}
        </p>

        <div className="flex gap-2">
          <Button>View</Button>

          <Button variant="secondary">Compare</Button>
        </div>
      </div>
    </Card>
  );
}
