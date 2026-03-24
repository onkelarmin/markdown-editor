import data from "@data/testData.json";

export function initTempSetMarkdown() {
  const markdownBody =
    document.querySelector<HTMLTextAreaElement>("#markdown-body");

  if (!markdownBody) return;

  markdownBody.value = data[1].content;
}
