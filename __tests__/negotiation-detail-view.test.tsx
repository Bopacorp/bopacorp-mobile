import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import NegotiationDetailView from "../components/NegotiationDetailView";
import * as api from "../services/api";
import * as ClientServices from "../services/ClientServices";
import {
  businessClient,
  documentItem,
  negotiation,
  rawVisit,
  visitType,
} from "./fixtures/critical-fixtures";

jest.mock("expo-router", () => {
  const React = require("react");

  return {
    router: {
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },
    useFocusEffect: (callback: () => void) => React.useEffect(callback, [callback]),
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

jest.mock("@/components/useColorScheme", () => ({
  useColorScheme: () => "light",
}));

jest.mock("@expo/vector-icons/FontAwesome", () => {
  const React = require("react");

  return function FontAwesome() {
    return React.createElement(React.Fragment);
  };
});

jest.mock("react-native-calendars", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");

  return {
    Calendar: ({ onDayPress }: { onDayPress: (day: object) => void }) =>
      React.createElement(
        Pressable,
        {
          testID: "mock-calendar",
          onPress: () => onDayPress({ year: 2026, month: 8, day: 20 }),
        },
        React.createElement(Text, null, "Seleccionar fecha"),
      ),
  };
});

jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user-advisor-1" } }),
}));

jest.mock("@/services/api", () => ({
  API_URL: "http://localhost:3000",
  getAccessToken: jest.fn(),
}));

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

jest.mock("@/services/ClientServices", () => ({
  createVisit: jest.fn(),
  getNegotiation: jest.fn(),
  getNegotiationDocuments: jest.fn(),
  getNegotiationVisits: jest.fn(),
  getVisitTypes: jest.fn(),
}));

const mockCreateVisit = ClientServices.createVisit as jest.Mock;
const mockGetNegotiation = ClientServices.getNegotiation as jest.Mock;
const mockGetNegotiationDocuments = ClientServices.getNegotiationDocuments as jest.Mock;
const mockGetNegotiationVisits = ClientServices.getNegotiationVisits as jest.Mock;
const mockGetVisitTypes = ClientServices.getVisitTypes as jest.Mock;
const mockGetAccessToken = api.getAccessToken as jest.Mock;

describe("NegotiationDetailView", () => {
  const freshNegotiation = {
    ...negotiation,
    clientId: businessClient.id,
    observations: "Comentario de negociación",
    isActive: true,
    stateId: "state-1",
  };
  let alertMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertMock = jest.spyOn(Alert, "alert").mockImplementation(() => {});
    mockGetAccessToken.mockReturnValue("access-token-test");
    mockGetNegotiation.mockResolvedValue(freshNegotiation);
    mockGetNegotiationDocuments.mockResolvedValue([documentItem]);
    mockGetNegotiationVisits.mockResolvedValue([rawVisit]);
    mockGetVisitTypes.mockResolvedValue([{ ...visitType, description: "Contacto telefónico" }]);
    mockCreateVisit.mockResolvedValue({ id: "visit-2" });
  });

  async function renderDetail() {
    const screen = await render(
      <NegotiationDetailView
        id="negotiation-1"
        clientName={negotiation.clientName}
        planName={negotiation.planName}
        amount={negotiation.amount}
        status={negotiation.status}
        date={negotiation.date}
        advisorName={negotiation.advisorName}
        estimatedCloseDate={negotiation.estimatedCloseDate}
      />,
    );

    await waitFor(() => expect(screen.getByText("Agregar Visita")).toBeTruthy());
    return screen;
  }

  it("loads detail, visits, documents and comments", async () => {
    const screen = await renderDetail();

    expect(mockGetNegotiation).toHaveBeenCalledWith("negotiation-1");
    expect(mockGetNegotiationDocuments).toHaveBeenCalledWith("negotiation-1");
    expect(mockGetNegotiationVisits).toHaveBeenCalledWith(businessClient.id);
    expect(mockGetVisitTypes).toHaveBeenCalled();
    expect(screen.getByText(/Reunión de seguimiento/)).toBeTruthy();

    await fireEvent.press(screen.getByText("Documentos"));
    expect(screen.getByText(documentItem.fileName)).toBeTruthy();

    await fireEvent.press(screen.getByText("Comentarios"));
    expect(screen.getByText("Comentario de negociación")).toBeTruthy();
  });

  it("creates a visit with GPS data when permission is granted", async () => {
    const Location = require("expo-location");
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "granted" });
    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: { latitude: -2.17, longitude: -79.92, accuracy: 8 },
      timestamp: Date.parse("2026-08-20T15:30:00.000Z"),
    });
    const screen = await renderDetail();

    await fireEvent.press(screen.getByText("Agregar Visita"));
    await fireEvent.press(screen.getByText("Seleccionar tipo..."));
    await fireEvent.press(screen.getAllByText("Llamada").at(-1)!);
    await fireEvent.changeText(
      screen.getByPlaceholderText("Detalles sobre lo conversado..."),
      "Visita con cliente",
    );
    await fireEvent.press(screen.getByText("Guardar Visita"));

    await waitFor(() => {
      expect(mockCreateVisit).toHaveBeenCalledWith(
        expect.objectContaining({
          negotiationId: "negotiation-1",
          clientId: businessClient.id,
          advisorId: "user-advisor-1",
          visitTypeId: visitType.id,
          observations: "Visita con cliente",
          gpsLatitude: -2.17,
          gpsLongitude: -79.92,
          gpsAccuracy: 8,
          gpsTimestamp: "2026-08-20T15:30:00.000Z",
        }),
      );
    });
    expect(alertMock).toHaveBeenCalledWith("Éxito", "Visita guardada correctamente.");
    expect(mockGetNegotiationVisits).toHaveBeenCalledTimes(2);
  });

  it("creates a visit without GPS data when permission is denied", async () => {
    const Location = require("expo-location");
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });
    const screen = await renderDetail();

    await fireEvent.press(screen.getByText("Agregar Visita"));
    await fireEvent.press(screen.getByText("Seleccionar tipo..."));
    await fireEvent.press(screen.getAllByText("Llamada").at(-1)!);
    await fireEvent.changeText(
      screen.getByPlaceholderText("Detalles sobre lo conversado..."),
      "Visita sin GPS",
    );
    await fireEvent.press(screen.getByText("Guardar Visita"));

    await waitFor(() => expect(mockCreateVisit).toHaveBeenCalled());
    expect(mockCreateVisit.mock.calls[0][0]).not.toHaveProperty("gpsLatitude");
    expect(mockCreateVisit.mock.calls[0][0]).not.toHaveProperty("gpsLongitude");
  });

  it("shows the visit error and keeps the modal open", async () => {
    mockCreateVisit.mockRejectedValueOnce(new Error("visit failed"));
    const Location = require("expo-location");
    Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: "denied" });
    const screen = await renderDetail();

    await fireEvent.press(screen.getByText("Agregar Visita"));
    await fireEvent.press(screen.getByText("Seleccionar tipo..."));
    await fireEvent.press(screen.getAllByText("Llamada").at(-1)!);
    await fireEvent.changeText(
      screen.getByPlaceholderText("Detalles sobre lo conversado..."),
      "Visita con error",
    );
    await fireEvent.press(screen.getByText("Guardar Visita"));

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith("Error", "visit failed"));
    expect(screen.getAllByText("Agregar Visita").length).toBeGreaterThan(1);
  });
});
