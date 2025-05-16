export function formatVariable(string: string) {
  return string.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase().replace(/__+/g, "_");
}
