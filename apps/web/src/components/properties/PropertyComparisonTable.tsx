
export function PropertyComparisonTable({ properties }: any) {
  return (
    <table>
      <thead>
        <tr>
          <th>Feature</th>

          {properties.map((p: any) => (
            <th>{p.title}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Price</td>

          {properties.map((p: any) => (
            <td>₦{p.price}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
