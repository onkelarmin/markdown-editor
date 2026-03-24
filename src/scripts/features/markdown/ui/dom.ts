export type DOM = {
  newDocumentButton: HTMLButtonElement;
  documentList: HTMLUListElement;
  documentListItemTemplate: HTMLTemplateElement;
  documentNameInput: HTMLInputElement;
  deleteButton: HTMLButtonElement;
  editor: HTMLElement;
  markdownContent: HTMLTextAreaElement;
  previewContent: HTMLElement;
  viewToggle: HTMLButtonElement;
};

export function getDOM() {
  const newDocumentButton = document.querySelector<HTMLButtonElement>(
    "#new-document-button",
  );
  const documentList = document.querySelector<HTMLUListElement>(
    "#sidebar .document-list",
  );
  const documentListItemTemplate = document.querySelector<HTMLTemplateElement>(
    "#document-list-item-template",
  );
  const documentNameInput = document.querySelector<HTMLInputElement>(
    "#document-name-input",
  );
  const deleteButton =
    document.querySelector<HTMLButtonElement>("#delete-button");
  const editor = document.querySelector<HTMLElement>(".editor");
  const markdownContent =
    document.querySelector<HTMLTextAreaElement>("#markdown-content");
  const previewContent =
    document.querySelector<HTMLElement>("#preview-content");
  const viewToggle = document.querySelector<HTMLButtonElement>("#view-toggle");

  if (
    !newDocumentButton ||
    !documentList ||
    !documentListItemTemplate ||
    !documentNameInput ||
    !deleteButton ||
    !editor ||
    !markdownContent ||
    !previewContent ||
    !viewToggle
  ) {
    throw new Error("Required DOM element missing");
  }

  return {
    newDocumentButton,
    documentList,
    documentListItemTemplate,
    documentNameInput,
    deleteButton,
    editor,
    markdownContent,
    previewContent,
    viewToggle,
  };
}
