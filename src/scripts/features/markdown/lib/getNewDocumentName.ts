export function getNewDocumentName(names: string[]): string {
  if (!names.includes("untitled.md")) return "untitled.md";

  const regex = /^untitled-[1-9]\d*\.md$/;

  const nums = names
    .filter((name) => regex.test(name))
    .map((name) => Number(name.slice(9, -3)))
    .sort((a, b) => a - b);

  let index = 1;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === index) {
      index++;
      continue;
    }
    break;
  }

  return `untitled-${index}.md`;
}
