export type DOM = {
  appLayout: HTMLElement;
  sidebar: HTMLElement;
  newDocumentButton: HTMLButtonElement;
  documentList: HTMLUListElement;
  documentListItemTemplate: HTMLTemplateElement;
  authContainer: HTMLElement;
  authEmailSpan: HTMLSpanElement;
  authButton: HTMLButtonElement;
  authButtonText: HTMLSpanElement;
  documentNameForm: HTMLFormElement;
  documentNameInput: HTMLInputElement;
  documentNameError: HTMLParagraphElement;
  openDeleteModalButton: HTMLButtonElement;
  deleteModal: HTMLDialogElement;
  deleteModalDocumentName: HTMLSpanElement;
  deleteModalConfirmationButton: HTMLButtonElement;
  editor: HTMLElement;
  draftSavedInfo: HTMLParagraphElement;
  markdownContent: HTMLTextAreaElement;
  previewContent: HTMLElement;
  saveChangesButton: HTMLButtonElement;
  saveChangesText: HTMLSpanElement;
  sidebarToggle: HTMLButtonElement;
  viewToggle: HTMLButtonElement;
  themeToggle: HTMLInputElement;
  toastContainer: HTMLElement;
  toastMessage: HTMLParagraphElement;
  closeToastButton: HTMLButtonElement;
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
  const authContainer = document.querySelector<HTMLElement>("#auth-container");
  const authEmailSpan =
    document.querySelector<HTMLSpanElement>("#auth-email-span");
  const authButton = document.querySelector<HTMLButtonElement>("#auth-button");
  const authButtonText =
    document.querySelector<HTMLSpanElement>("#auth-button .text");
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
  const draftSavedInfo =
    document.querySelector<HTMLParagraphElement>("#draft-saved-info");
  const markdownContent =
    document.querySelector<HTMLTextAreaElement>("#markdown-content");
  const previewContent =
    document.querySelector<HTMLElement>("#preview-content");
  const saveChangesButton = document.querySelector<HTMLButtonElement>(
    "#save-changes-button",
  );
  const saveChangesText = document.querySelector<HTMLButtonElement>(
    "#save-changes-button > .text",
  );
  const sidebarToggle =
    document.querySelector<HTMLButtonElement>("#sidebar-toggle");
  const viewToggle = document.querySelector<HTMLButtonElement>("#view-toggle");
  const themeToggle = document.querySelector<HTMLInputElement>(
    ".theme-switch > input",
  );
  const toastContainer = document.querySelector<HTMLElement>("#toast");
  const toastMessage =
    document.querySelector<HTMLParagraphElement>("#toast  .message");
  const closeToastButton = document.querySelector<HTMLButtonElement>(
    "#close-toast-button",
  );

  if (
    !appLayout ||
    !sidebar ||
    !newDocumentButton ||
    !documentList ||
    !documentListItemTemplate ||
    !authContainer ||
    !authEmailSpan ||
    !authButton ||
    !authButtonText ||
    !documentNameForm ||
    !documentNameInput ||
    !documentNameError ||
    !openDeleteModalButton ||
    !deleteModal ||
    !deleteModalDocumentName ||
    !deleteModalConfirmationButton ||
    !editor ||
    !draftSavedInfo ||
    !markdownContent ||
    !previewContent ||
    !saveChangesButton ||
    !saveChangesText ||
    !sidebarToggle ||
    !viewToggle ||
    !themeToggle ||
    !toastContainer ||
    !toastMessage ||
    !closeToastButton
  ) {
    throw new Error("Required DOM element missing");
  }

  return {
    appLayout,
    sidebar,
    newDocumentButton,
    documentList,
    documentListItemTemplate,
    authContainer,
    authEmailSpan,
    authButton,
    authButtonText,
    documentNameForm,
    documentNameInput,
    documentNameError,
    openDeleteModalButton,
    deleteModal,
    deleteModalDocumentName,
    deleteModalConfirmationButton,
    editor,
    draftSavedInfo,
    markdownContent,
    previewContent,
    saveChangesButton,
    saveChangesText,
    sidebarToggle,
    viewToggle,
    themeToggle,
    toastContainer,
    toastMessage,
    closeToastButton,
  };
}
