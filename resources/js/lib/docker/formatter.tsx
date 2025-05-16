export function formatServiceImage(image: string) {
  const [name, tag] = image.split(":");
  return (
    <div className="text-xs text-muted-foreground">
      {name}{tag ? `:${tag}` : ""}
    </div>
  );
}

export function formatDockerDriver(driver: string, name?: string) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">
        {driver} driver
      </span>
      {(name && name !== driver) && (
        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
          {name}
        </span>
      )}
    </div>
  );
}
