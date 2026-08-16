import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

import NegotiationsScreen from "../app/(tabs)/negotiations";
import CreateNegotiationScreen from "../app/create-negotiation";
import EditNegotiationScreen from "../app/edit-negotiation";
import * as ClientServices from "../services/ClientServices";
import { businessClient, negotiation, negotiationState } from "./fixtures/critical-fixtures";

jest.mock("expo-router", () => {
  const React = require("react");

  return {
    router: {
      back: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    },
    useLocalSearchParams: jest.fn(() => ({})),
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

jest.mock("@/services/ClientServices", () => ({
  createNegotiation: jest.fn(),
  getBusinessClients: jest.fn(),
  getNegotiationStates: jest.fn(),
  getNegotiations: jest.fn(),
  updateNegotiation: jest.fn(),
}));

const mockRouter = router as unknown as {
  back: jest.Mock;
  push: jest.Mock;
  replace: jest.Mock;
};
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockCreateNegotiation = ClientServices.createNegotiation as jest.Mock;
const mockGetBusinessClients = ClientServices.getBusinessClients as jest.Mock;
const mockGetNegotiationStates = ClientServices.getNegotiationStates as jest.Mock;
const mockGetNegotiations = ClientServices.getNegotiations as jest.Mock;
const mockUpdateNegotiation = ClientServices.updateNegotiation as jest.Mock;

describe("negotiation screens", () => {
  const globalAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).alert = globalAlert;
    mockUseLocalSearchParams.mockReturnValue({});
    mockCreateNegotiation.mockResolvedValue({ id: "negotiation-2" });
    mockGetBusinessClients.mockResolvedValue([businessClient]);
    mockGetNegotiationStates.mockResolvedValue([negotiationState]);
    mockGetNegotiations.mockResolvedValue([negotiation]);
    mockUpdateNegotiation.mockResolvedValue({ id: negotiation.id });
  });

  it("requires a client and state before creating a negotiation", async () => {
    const screen = await render(<CreateNegotiationScreen />);

    await waitFor(() => expect(screen.getByText("Nueva negociación")).toBeTruthy());
    await fireEvent.press(screen.getByText("Crear negociación"));

    expect(globalAlert).toHaveBeenCalledWith("Seleccione cliente y estado");
    expect(mockCreateNegotiation).not.toHaveBeenCalled();
  });

  it("selects client/state and creates a negotiation with the advisor and local dates", async () => {
    const screen = await render(<CreateNegotiationScreen />);

    await waitFor(() => expect(screen.getByText("Seleccionar cliente")).toBeTruthy());
    await fireEvent.press(screen.getByText("Seleccionar cliente"));
    await fireEvent.press(screen.getByText("Empresa Demo S.A."));
    await fireEvent.press(screen.getByText("Seleccionar estado"));
    await fireEvent.press(screen.getByText("Negociacion"));
    await fireEvent.changeText(
      screen.getByPlaceholderText("Notas adicionales..."),
      " Seguimiento semanal ",
    );
    await fireEvent.press(screen.getByText("Crear negociación"));

    await waitFor(() => {
      expect(mockCreateNegotiation).toHaveBeenCalledWith(
        expect.objectContaining({
          clientId: businessClient.id,
          advisorId: "user-advisor-1",
          stateId: negotiationState.id,
          observations: " Seguimiento semanal ",
          isActive: true,
        }),
      );
    });
    expect(mockCreateNegotiation.mock.calls[0][0].startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(mockCreateNegotiation.mock.calls[0][0].estimatedCloseDate).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(globalAlert).toHaveBeenCalledWith("Negociación creada");
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("shows the create error without navigating", async () => {
    mockCreateNegotiation.mockRejectedValueOnce(new Error("create failed"));
    const screen = await render(<CreateNegotiationScreen />);

    await waitFor(() => expect(screen.getByText("Seleccionar cliente")).toBeTruthy());
    await fireEvent.press(screen.getByText("Seleccionar cliente"));
    await fireEvent.press(screen.getByText("Empresa Demo S.A."));
    await fireEvent.press(screen.getByText("Seleccionar estado"));
    await fireEvent.press(screen.getByText("Negociacion"));
    await fireEvent.press(screen.getByText("Crear negociación"));

    await waitFor(() => expect(globalAlert).toHaveBeenCalledWith("Error al crear negociación"));
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it("loads an edit negotiation, changes its state and sends the selected id", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      id: "negotiation-1",
      clientName: "Empresa Demo S.A.",
      amount: "$1,000.00",
      status: "Negociacion",
      date: "15/08/2026",
      estimatedCloseDate: "30/08/2026",
      observations: "Observación inicial",
      isActive: "true",
    });
    const screen = await render(<EditNegotiationScreen />);

    await waitFor(() => expect(screen.getByText("Editar negociación")).toBeTruthy());
    await fireEvent.press(screen.getByText("Negociacion"));
    await fireEvent.press(screen.getAllByText("Negociacion")[1]);
    await fireEvent.changeText(
      screen.getByDisplayValue("Observación inicial"),
      " Cierre actualizado ",
    );
    await fireEvent.press(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(mockUpdateNegotiation).toHaveBeenCalledWith("negotiation-1", {
        stateId: negotiationState.id,
        startDate: "2026-08-15",
        estimatedCloseDate: "2026-08-30",
        observations: " Cierre actualizado ",
        isActive: true,
      });
    });
    expect(globalAlert).toHaveBeenCalledWith("Negociación actualizada");
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("shows the edit error without navigating", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "negotiation-1" });
    mockUpdateNegotiation.mockRejectedValueOnce(new Error("update failed"));
    const screen = await render(<EditNegotiationScreen />);

    await waitFor(() => expect(screen.getByText("Editar negociación")).toBeTruthy());
    await fireEvent.press(screen.getByText("Guardar cambios"));

    await waitFor(() =>
      expect(globalAlert).toHaveBeenCalledWith("Error al actualizar negociación"),
    );
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it("filters negotiations and navigates to the selected detail", async () => {
    const secondNegotiation = {
      ...negotiation,
      id: "negotiation-2",
      clientName: "Otra Empresa S.A.",
      status: "Cierre",
    };
    mockGetNegotiations.mockResolvedValueOnce([negotiation, secondNegotiation]);
    const screen = await render(<NegotiationsScreen />);

    await waitFor(() => expect(screen.getAllByText("Empresa Demo")[0]).toBeTruthy());
    await fireEvent.changeText(screen.getByPlaceholderText("Buscar por empresa..."), "Otra");

    expect(screen.queryByText("Empresa Demo")).toBeNull();
    expect(screen.getByText("Otra Empresa S.A.")).toBeTruthy();
    await fireEvent.press(screen.getByText("Otra Empresa S.A."));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/negotiation-detail",
      params: {
        id: "negotiation-2",
        clientName: "Otra Empresa S.A.",
        planName: negotiation.planName,
        amount: negotiation.amount,
        status: "Cierre",
        date: negotiation.date,
        advisorName: negotiation.advisorName,
        estimatedCloseDate: negotiation.estimatedCloseDate,
      },
    });
  });

  it("loads another negotiation page when more records are available", async () => {
    const firstPage = Array.from({ length: 50 }, (_, index) => ({
      ...negotiation,
      id: `negotiation-${index + 1}`,
      clientName: `Empresa ${String(index + 1).padStart(2, "0")}`,
    }));
    const secondPage = [{ ...negotiation, id: "negotiation-51", clientName: "Empresa Página 2" }];
    mockGetNegotiations.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage);
    const screen = await render(<NegotiationsScreen />);

    await waitFor(() => expect(screen.getByText("Empresa 01")).toBeTruthy());
    await fireEvent.press(screen.getByText("Cargar más"));

    await waitFor(() => expect(mockGetNegotiations).toHaveBeenLastCalledWith(50, 2));
    expect(screen.getByText("Empresa Página 2")).toBeTruthy();
  });

  it("renders the negotiation filter modal and applies a status", async () => {
    const secondNegotiation = {
      ...negotiation,
      id: "negotiation-2",
      clientName: "Otra Empresa S.A.",
      status: "Cierre",
    };
    mockGetNegotiations.mockResolvedValueOnce([negotiation, secondNegotiation]);
    const screen = await render(<NegotiationsScreen />);

    await waitFor(() => expect(screen.getAllByText("Empresa Demo")[0]).toBeTruthy());
    await fireEvent.press(
      screen.root!.queryAll((instance) => instance.props.accessible === true)[0],
    );
    await fireEvent.press(screen.getAllByText("Cierre")[0]);

    expect(screen.queryByText("Empresa Demo")).toBeNull();
    expect(screen.getByText("Total negociaciones: 1")).toBeTruthy();
  });
});
