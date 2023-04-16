export function timestampToYear(timestamp: number): number {
  const date = new Date(timestamp)
  return date.getFullYear()
}
