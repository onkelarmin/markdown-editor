export type Document = {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  modifiedAt: number;
};

export type View = "markdown" | "preview";

export type State = {
  documents: Document[];
  activeDocumentId: string | null;
  view: View;
  isDeleteModalOpen: boolean;
};

export type Action =
  | {
      type: "document/create";
    }
  | { type: "document/select"; payload: { id: string } }
  | { type: "document/delete"; payload: { id: string } }
  | { type: "document/updateName"; payload: { id: string; name: string } }
  | {
      type: "document/updateContent";
      payload: { id: string; content: string };
    }
  | { type: "view/set"; payload: { view: View } }
  | { type: "modal/openDelete" }
  | { type: "modal/closeDelete" };

export type subscribeOptions = {
  fireImmediately?: boolean;
};
