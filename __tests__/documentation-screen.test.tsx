import { fireEvent, render, waitFor } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

import DocumentationScreen from "../app/(tabs)/documentation";
import * as ClientServices from "../services/ClientServices";
import { documentItem, documentUploadResponse, negotiation } from "./fixtures/critical-fixtures";

jest.mock("@expo/vector-icons/FontAwesome", () => {
  const React = require("react");

  return function FontAwesome() {
    return React.createElement(React.Fragment);
  };
});

jest.mock("@/components/useColorScheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@/services/api", () => ({
  API_URL: "http://localhost:3000",
  getAccessToken: jest.fn(),
}));

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock("@/services/ClientServices", () => ({
  createNegotiationDocument: jest.fn(),
  deleteNegotiationDocument: jest.fn(),
  getDocumentTypes: jest.fn(),
  getNegotiationDocuments: jest.fn(),
  getNegotiations: jest.fn(),
  uploadDocumentFile: jest.fn(),
}));

const mockCreateNegotiationDocument = ClientServices.createNegotiationDocument as jest.Mock;
const mockGetDocumentTypes = ClientServices.getDocumentTypes as jest.Mock;
const mockGetNegotiationDocuments = ClientServices.getNegotiationDocuments as jest.Mock;
const mockGetNegotiations = ClientServices.getNegotiations as jest.Mock;
const mockUploadDocumentFile = ClientServices.uploadDocumentFile as jest.Mock;

describe("DocumentationScreen", () => {
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockGetNegotiationDocuments.mockResolvedValue([documentItem]);
    mockGetNegotiations.mockResolvedValue([negotiation]);
    mockGetDocumentTypes.mockResolvedValue([{ id: "type-1", name: "Contrato" }]);
    mockUploadDocumentFile.mockResolvedValue(documentUploadResponse);
    mockCreateNegotiationDocument.mockResolvedValue({ id: "document-2" });
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file:///contrato-demo.pdf",
          name: "contrato-demo.pdf",
          mimeType: "application/pdf",
        },
      ],
    });
  });

  async function renderDocumentation() {
    const screen = await render(<DocumentationScreen />);
    await waitFor(() => expect(screen.getByText("Documentación")).toBeTruthy());
    return screen;
  }

  it("loads documents and filters them by search text", async () => {
    const secondDocument = { ...documentItem, id: "document-2", fileName: "factura-demo.pdf" };
    mockGetNegotiationDocuments.mockResolvedValueOnce([documentItem, secondDocument]);
    const screen = await renderDocumentation();

    expect(screen.getByText("contrato-demo.pdf")).toBeTruthy();
    expect(screen.getByText("factura-demo.pdf")).toBeTruthy();
    await fireEvent.changeText(screen.getByPlaceholderText("Buscar documentos..."), "factura");

    expect(screen.queryByText("contrato-demo.pdf")).toBeNull();
    expect(screen.getByText("factura-demo.pdf")).toBeTruthy();
    expect(screen.getByText("Total documentos: 1")).toBeTruthy();
  });

  it("handles a canceled file picker without selecting a file", async () => {
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({ canceled: true });
    const screen = await renderDocumentation();

    await fireEvent.press(screen.getByText("Subir Documento"));
    await waitFor(() => expect(screen.getByText("Seleccionar archivo")).toBeTruthy());
    await fireEvent.press(screen.getByText("Seleccionar archivo"));

    await waitFor(() =>
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      }),
    );
    expect(screen.getByText("Seleccionar archivo")).toBeTruthy();
  });

  it("selects metadata and uploads a document in the required order", async () => {
    mockGetNegotiationDocuments
      .mockResolvedValueOnce([documentItem])
      .mockResolvedValueOnce([{ ...documentItem, id: "document-2" }]);
    const screen = await renderDocumentation();

    await fireEvent.press(screen.getByText("Subir Documento"));
    await waitFor(() => expect(screen.getByText("Seleccionar negociación...")).toBeTruthy());

    await fireEvent.press(screen.getByText("Seleccionar archivo"));
    await waitFor(() => expect(screen.getAllByText("contrato-demo.pdf")[0]).toBeTruthy());

    await fireEvent.press(screen.getByText("Seleccionar negociación..."));
    await fireEvent.press(screen.getByText("Empresa Demo"));
    await fireEvent.press(screen.getByText("Seleccionar tipo..."));
    await fireEvent.press(screen.getByText("Contrato"));

    const uploadButtons = screen.getAllByText("Subir Documento");
    await fireEvent.press(uploadButtons[uploadButtons.length - 1]);

    await waitFor(() => {
      expect(mockUploadDocumentFile).toHaveBeenCalledWith(
        "file:///contrato-demo.pdf",
        "contrato-demo.pdf",
        "application/pdf",
      );
      expect(mockCreateNegotiationDocument).toHaveBeenCalledWith({
        negotiationId: negotiation.id,
        documentTypeId: "type-1",
        filename: documentUploadResponse.filename,
        fileExtension: documentUploadResponse.fileExtension,
        fileSizeMb: documentUploadResponse.fileSizeMb,
        storagePath: documentUploadResponse.storagePath,
        mimeType: documentUploadResponse.mimeType,
        encryptionMetadata: documentUploadResponse.encryptionMetadata,
      });
    });
    expect(mockUploadDocumentFile.mock.invocationCallOrder[0]).toBeLessThan(
      mockCreateNegotiationDocument.mock.invocationCallOrder[0],
    );
    expect(alertMock).toHaveBeenCalledWith("Éxito", "Documento subido correctamente.");
    expect(mockGetNegotiationDocuments).toHaveBeenCalledTimes(2);
  });

  it("shows the upload error and finishes the loading state", async () => {
    mockUploadDocumentFile.mockRejectedValueOnce(new Error("upload failed"));
    const screen = await renderDocumentation();

    await fireEvent.press(screen.getByText("Subir Documento"));
    await waitFor(() => expect(screen.getByText("Seleccionar archivo")).toBeTruthy());
    await fireEvent.press(screen.getByText("Seleccionar archivo"));
    await waitFor(() => expect(screen.getAllByText("contrato-demo.pdf")[0]).toBeTruthy());
    await fireEvent.press(screen.getByText("Seleccionar negociación..."));
    await fireEvent.press(screen.getByText("Empresa Demo"));
    await fireEvent.press(screen.getByText("Seleccionar tipo..."));
    await fireEvent.press(screen.getByText("Contrato"));
    const uploadButtons = screen.getAllByText("Subir Documento");
    await fireEvent.press(uploadButtons[uploadButtons.length - 1]);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("Error", "upload failed"));
    expect(mockCreateNegotiationDocument).not.toHaveBeenCalled();
  });

  it("opens the document filter modal and applies a status filter", async () => {
    const screen = await renderDocumentation();
    const filterButton = screen.root!.queryAll((instance) => instance.props.accessible === true)[0];
    await fireEvent.press(filterButton);
    await fireEvent.press(screen.getByText("Aceptados"));

    expect(screen.getByText('No se encontraron documentos para ""')).toBeTruthy();
  });
});
