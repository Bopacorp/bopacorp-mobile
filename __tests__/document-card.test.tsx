import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import DocumentCard from "../components/DocumentCard";
import * as api from "../services/api";
import * as ClientServices from "../services/ClientServices";
import { documentItem } from "./fixtures/critical-fixtures";

jest.mock("@expo/vector-icons/FontAwesome", () => {
  const React = require("react");

  return function FontAwesome() {
    return React.createElement(React.Fragment);
  };
});

jest.mock("@/services/api", () => ({
  API_URL: "http://localhost:3000",
  getAccessToken: jest.fn(),
}));

jest.mock("@/services/ClientServices", () => ({
  deleteNegotiationDocument: jest.fn(),
}));

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

const mockDeleteNegotiationDocument = ClientServices.deleteNegotiationDocument as jest.Mock;
const mockGetAccessToken = api.getAccessToken as jest.Mock;

describe("DocumentCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAccessToken.mockReturnValue("access-token-test");
    mockDeleteNegotiationDocument.mockResolvedValue({ success: true });
  });

  it("confirms deletion, deletes the document and refreshes the parent list", async () => {
    const alertMock = jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons) => {
      const deleteButton = buttons?.find((button) => button.text === "Eliminar");
      deleteButton?.onPress?.();
    });
    const onRefresh = jest.fn();
    const screen = await render(
      <DocumentCard document={documentItem} colorScheme="light" onRefresh={onRefresh} />,
    );

    await fireEvent.press(screen.getByText("Eliminar"));

    await waitFor(() =>
      expect(mockDeleteNegotiationDocument).toHaveBeenCalledWith(documentItem.id),
    );
    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    expect(alertMock).toHaveBeenCalledWith(
      "Eliminar Documento",
      "¿Está seguro de que desea eliminar este documento?",
      expect.any(Array),
    );
  });

  it("shows the delete error without refreshing", async () => {
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockDeleteNegotiationDocument.mockRejectedValueOnce(new Error("delete failed"));
    const onRefresh = jest.fn();
    const screen = await render(
      <DocumentCard document={documentItem} colorScheme="light" onRefresh={onRefresh} />,
    );

    await fireEvent.press(screen.getByText("Eliminar"));
    const confirmation = (Alert.alert as jest.Mock).mock.calls[0][2];
    confirmation.find((button: { text?: string }) => button.text === "Eliminar").onPress();

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "delete failed");
    });
    expect(onRefresh).not.toHaveBeenCalled();
  });
});
