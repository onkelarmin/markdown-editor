export type DOM = {
  appLayout: HTMLElement;
  signInModal: HTMLDialogElement;
  closeSignInModalButton: HTMLButtonElement;
  emailForm: HTMLFormElement;
  emailInput: HTMLInputElement;
  emailSubmitButton: HTMLButtonElement;
  emailSubmitButtonText: HTMLSpanElement;
  emailInputError: HTMLParagraphElement;
  emailProcessError: HTMLParagraphElement;
  otpForm: HTMLFormElement;
  otpInput: HTMLInputElement;
  otpSubmitButton: HTMLButtonElement;
  otpSubmitButtonText: HTMLSpanElement;
  otpInputError: HTMLParagraphElement;
  otpProcessError: HTMLParagraphElement;
  signInEmailSpan: HTMLSpanElement;
  resendCodeButton: HTMLButtonElement;
  resendCodeButtonText: HTMLSpanElement;
  changeEmailButton: HTMLButtonElement;
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
  const signInModal =
    document.querySelector<HTMLDialogElement>("#sign-in-modal");
  const closeSignInModalButton = document.querySelector<HTMLButtonElement>(
    "#close-sign-in-button",
  );
  const emailForm = document.querySelector<HTMLFormElement>("#send-otp-form");
  const emailInput = document.querySelector<HTMLInputElement>("#email-input");
  const emailSubmitButton = document.querySelector<HTMLButtonElement>(
    "#email-submit-button",
  );
  const emailSubmitButtonText = document.querySelector<HTMLSpanElement>(
    "#email-submit-button .text",
  );
  const emailInputError = document.querySelector<HTMLParagraphElement>(
    "#send-otp-input-error",
  );
  const emailProcessError = document.querySelector<HTMLParagraphElement>(
    "#send-otp-process-error",
  );
  const otpForm = document.querySelector<HTMLFormElement>("#verify-otp-form");
  const otpInput = document.querySelector<HTMLInputElement>("#otp-input");
  const otpSubmitButton =
    document.querySelector<HTMLButtonElement>("#otp-submit-button");
  const otpSubmitButtonText = document.querySelector<HTMLSpanElement>(
    "#otp-submit-button .text",
  );
  const otpInputError = document.querySelector<HTMLParagraphElement>(
    "#verify-otp-input-error",
  );
  const otpProcessError = document.querySelector<HTMLParagraphElement>(
    "#verify-otp-process-error",
  );
  const signInEmailSpan = document.querySelector<HTMLSpanElement>("#otp-email");
  const resendCodeButton = document.querySelector<HTMLButtonElement>(
    "#resend-code-button",
  );
  const resendCodeButtonText = document.querySelector<HTMLSpanElement>(
    "#resend-code-button .text",
  );
  const changeEmailButton = document.querySelector<HTMLButtonElement>(
    "#change-email-button",
  );
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
    !signInModal ||
    !closeSignInModalButton ||
    !emailForm ||
    !emailInput ||
    !emailSubmitButton ||
    !emailSubmitButtonText ||
    !emailInputError ||
    !emailProcessError ||
    !otpForm ||
    !otpInput ||
    !otpSubmitButton ||
    !otpSubmitButtonText ||
    !otpInputError ||
    !otpProcessError ||
    !signInEmailSpan ||
    !resendCodeButton ||
    !resendCodeButtonText ||
    !changeEmailButton ||
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
    signInModal,
    closeSignInModalButton,
    emailForm,
    emailInput,
    emailSubmitButton,
    emailSubmitButtonText,
    emailInputError,
    emailProcessError,
    otpForm,
    otpInput,
    otpSubmitButton,
    otpSubmitButtonText,
    otpInputError,
    otpProcessError,
    signInEmailSpan,
    resendCodeButton,
    resendCodeButtonText,
    changeEmailButton,
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
