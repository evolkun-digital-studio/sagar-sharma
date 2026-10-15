/** Two stacked copies of a label; hovering the nearest .roll-host rolls one into the other. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}
