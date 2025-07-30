/**
 * Validates that a value is safe for use in Radix UI Select components
 * Radix UI Select doesn't allow empty string values
 */
export function isValidSelectValue(value: string): boolean {
  return value !== undefined && value !== null && value.trim() !== "";
}

/**
 * Filters an array of options to only include valid Select values
 */
export function filterValidSelectOptions<
  T extends { value: string; label: string }
>(options: T[]): T[] {
  return options.filter((option) => isValidSelectValue(option.value));
}

/**
 * Safely converts a value for use in Select components
 * Returns "all" for null/undefined/empty values
 */
export function safeSelectValue(value: string | null | undefined): string {
  if (!value || value.trim() === "") {
    return "all";
  }
  return value;
}
