import { Card } from "@/ui";

interface Props {
  views: number;

  favorites: number;

  shares: number;

  bookings: number;
}

export function PropertyAnalyticsCard({
  views,

  favorites,

  shares,

  bookings,
}: Props) {
  return (
    <Card>
      <div
        className="
      grid
      gap-4
      md:grid-cols-4
     "
      >
        <div>
          <p>Views</p>

          <h3>{views}</h3>
        </div>

        <div>
          <p>Favorites</p>

          <h3>{favorites}</h3>
        </div>

        <div>
          <p>Shares</p>

          <h3>{shares}</h3>
        </div>

        <div>
          <p>Bookings</p>

          <h3>{bookings}</h3>
        </div>
      </div>
    </Card>
  );
}
