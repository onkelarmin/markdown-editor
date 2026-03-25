export function normalizeDocumentName(input: string): string {
  let normalized = input;
  normalized = normalized.trim();
  normalized = normalized.replace(/\s+/g, " "); // remove multiple whitespaces
  normalized = normalized.replace(/\.$/, ""); // remove trailing .
  normalized = normalized.replace(/(\.md)+$/i, ".md"); // remove multiple '.md'
  if (!normalized.endsWith(".md")) normalized = normalized + ".md"; // add '.md' if not present
  return normalized;
}
