export type DOM = {
  appLayout: HTMLElement;
  sidebar: HTMLElement;
  newDocumentButton: HTMLButtonElement;
  documentList: HTMLUListElement;
  documentListItemTemplate: HTMLTemplateElement;
  documentNameForm: HTMLFormElement;
  documentNameInput: HTMLInputElement;
  documentNameError: HTMLParagraphElement;
  openDeleteModalButton: HTMLButtonElement;
  deleteModal: HTMLDialogElement;
  deleteModalDocumentName: HTMLSpanElement;
  deleteModalConfirmationButton: HTMLButtonElement;
  editor: HTMLElement;
  markdownContent: HTMLTextAreaElement;
  previewContent: HTMLElement;
  saveChangesButton: HTMLButtonElement;
  sidebarToggle: HTMLButtonElement;
  viewToggle: HTMLButtonElement;
};

export function getDOM() {
  const appLayout = document.querySelector<HTMLElement>("#app-layout");
  const sidebar = document.querySelector<HTMLElement>("#sidebar");
  const newDocumentButton = document.querySelector<HTMLButtonElement>(
    "#new-document-button",
  );
  const documentList = document.querySelector<HTMLUListElement>(
    "#sidebar .document-list",
  );
  const documentListItemTemplate = document.querySelector<HTMLTemplateElement>(
    "#document-list-item-template",
  );
  const documentNameForm = document.querySelector<HTMLFormElement>(
    "#document-name-form",
  );
  const documentNameInput = document.querySelector<HTMLInputElement>(
    "#document-name-input",
  );
  const documentNameError = document.querySelector<HTMLParagraphElement>(
    "#document-name-error",
  );
  const openDeleteModalButton =
    document.querySelector<HTMLButtonElement>("#open-delete-modal");
  const deleteModal =
    document.querySelector<HTMLDialogElement>("#delete-modal");
  const deleteModalDocumentName = document.querySelector<HTMLSpanElement>(
    "#delete-modal-document-name",
  );
  const deleteModalConfirmationButton =
    document.querySelector<HTMLButtonElement>(
      "#delete-modal-confirmation-button",
    );
  const editor = document.querySelector<HTMLElement>(".editor");
  const markdownContent =
    document.querySelector<HTMLTextAreaElement>("#markdown-content");
  const previewContent =
    document.querySelector<HTMLElement>("#preview-content");
  const saveChangesButton = document.querySelector<HTMLButtonElement>(
    "#save-changes-button",
  );
  const sidebarToggle =
    document.querySelector<HTMLButtonElement>("#sidebar-toggle");
  const viewToggle = document.querySelector<HTMLButtonElement>("#view-toggle");

  if (
    !appLayout ||
    !sidebar ||
    !newDocumentButton ||
    !documentList ||
    !documentListItemTemplate ||
    !documentNameForm ||
    !documentNameInput ||
    !documentNameError ||
    !openDeleteModalButton ||
    !deleteModal ||
    !deleteModalDocumentName ||
    !deleteModalConfirmationButton ||
    !editor ||
    !markdownContent ||
    !previewContent ||
    !saveChangesButton ||
    !sidebarToggle ||
    !viewToggle
  ) {
    throw new Error("Required DOM element missing");
  }

  return {
    appLayout,
    sidebar,
    newDocumentButton,
    documentList,
    documentListItemTemplate,
    documentNameForm,
    documentNameInput,
    documentNameError,
    openDeleteModalButton,
    deleteModal,
    deleteModalDocumentName,
    deleteModalConfirmationButton,
    editor,
    markdownContent,
    previewContent,
    saveChangesButton,
    sidebarToggle,
    viewToggle,
  };
}
