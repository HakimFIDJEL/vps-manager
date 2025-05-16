export function formatServiceImage(image: string) {
  const [name, tag] = image.split(":");
  return (
    <div className="text-xs text-muted-foreground">
      {name}{tag ? `:${tag}` : ""}
    </div>
  );
}

export function formatDockerDriver(driver: string) {
  return (
    <span className="text-xs text-muted-foreground">
      {driver} driver
    </span>
  );
}
