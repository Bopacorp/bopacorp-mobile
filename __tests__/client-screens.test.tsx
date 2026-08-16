import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";

import ClientsScreen from "../app/(tabs)/clients";
import CreateClientScreen from "../app/create-client";
import EditClientScreen from "../app/edit-client";
import * as ClientServices from "../services/ClientServices";
import { businessClient } from "./fixtures/critical-fixtures";

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

jest.mock("@expo/vector-icons/Ionicons", () => {
  const React = require("react");

  return function Ionicons() {
    return React.createElement(React.Fragment);
  };
});

jest.mock("@/services/ClientServices", () => ({
  createBusinessClient: jest.fn(),
  getBusinessClients: jest.fn(),
  updateBusinessClient: jest.fn(),
}));

const mockRouter = router as unknown as {
  back: jest.Mock;
  push: jest.Mock;
  replace: jest.Mock;
};
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;
const mockCreateBusinessClient = ClientServices.createBusinessClient as jest.Mock;
const mockGetBusinessClients = ClientServices.getBusinessClients as jest.Mock;
const mockUpdateBusinessClient = ClientServices.updateBusinessClient as jest.Mock;

describe("client screens", () => {
  const globalAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).alert = globalAlert;
    mockUseLocalSearchParams.mockReturnValue({});
    mockCreateBusinessClient.mockResolvedValue({ id: "client-2" });
    mockGetBusinessClients.mockResolvedValue([businessClient]);
    mockUpdateBusinessClient.mockResolvedValue({ id: businessClient.id });
  });

  it("creates a client with trimmed values and optional fields", async () => {
    const screen = await render(<CreateClientScreen />);

    await fireEvent.changeText(screen.getByPlaceholderText("0991234567001"), " 0999999999001 ");
    await fireEvent.changeText(screen.getByPlaceholderText("Empresa S.A."), " Empresa Nueva S.A. ");
    await fireEvent.changeText(
      screen.getByPlaceholderText("Nombre del contacto"),
      " Persona Nueva ",
    );
    await fireEvent.changeText(screen.getByPlaceholderText("0999999999"), " 0987654321 ");
    await fireEvent.changeText(
      screen.getByPlaceholderText("correo@empresa.com"),
      " nueva@demo.test ",
    );
    await fireEvent.changeText(screen.getByPlaceholderText("Dirección"), " Guayaquil ");
    await fireEvent.press(screen.getByText("Guardar cliente"));

    await waitFor(() => {
      expect(mockCreateBusinessClient).toHaveBeenCalledWith({
        ruc: "0999999999001",
        businessName: "Empresa Nueva S.A.",
        contactName: "Persona Nueva",
        contactPhone: "0987654321",
        contactEmail: "nueva@demo.test",
        address: "Guayaquil",
        activeServicesCount: 0,
        currentMonthlyBilling: 0,
        isActive: true,
      });
    });
    expect(globalAlert).toHaveBeenCalledWith("Cliente creado");
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("shows validation details and keeps the entered client data after an API error", async () => {
    mockCreateBusinessClient.mockRejectedValueOnce({
      details: [
        { field: "ruc", message: "RUC inválido" },
        { field: "contactEmail", message: "Email inválido" },
      ],
    });
    const screen = await render(<CreateClientScreen />);
    const email = screen.getByPlaceholderText("correo@empresa.com");

    await fireEvent.changeText(email, "incorrecto");
    await fireEvent.press(screen.getByText("Guardar cliente"));

    await waitFor(() => {
      expect(globalAlert).toHaveBeenCalledWith(
        "Error de Validación:\nruc: RUC inválido\ncontactEmail: Email inválido",
      );
    });
    expect(screen.getByDisplayValue("incorrecto")).toBeTruthy();
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it("updates only editable client fields and preserves the selected client id", async () => {
    mockUseLocalSearchParams.mockReturnValue({
      id: "client-1",
      ruc: businessClient.ruc,
      businessName: businessClient.businessName,
      contactName: businessClient.contactName,
      contactPhone: businessClient.contactPhone,
      contactEmail: businessClient.contactEmail,
      address: businessClient.address,
      isActive: "false",
    });
    const screen = await render(<EditClientScreen />);

    await fireEvent.changeText(screen.getByDisplayValue("Persona Demo"), " Contacto Actualizado ");
    await fireEvent.changeText(screen.getByDisplayValue("0999999999"), " 0911111111 ");
    await fireEvent.changeText(
      screen.getByDisplayValue("contacto@demo.test"),
      " actualizado@demo.test ",
    );
    await fireEvent.changeText(screen.getByDisplayValue("Guayaquil"), " Quito ");
    await fireEvent.press(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(mockUpdateBusinessClient).toHaveBeenCalledWith("client-1", {
        ruc: businessClient.ruc,
        businessName: businessClient.businessName,
        contactName: "Contacto Actualizado",
        contactPhone: "0911111111",
        contactEmail: "actualizado@demo.test",
        address: "Quito",
        isActive: false,
      });
    });
    expect(globalAlert).toHaveBeenCalledWith("Cliente actualizado");
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("shows the update error without navigating away", async () => {
    mockUseLocalSearchParams.mockReturnValue({ id: "client-1" });
    mockUpdateBusinessClient.mockRejectedValueOnce(new Error("update failed"));
    const screen = await render(<EditClientScreen />);

    await fireEvent.press(screen.getByText("Guardar cambios"));

    await waitFor(() => {
      expect(globalAlert).toHaveBeenCalledWith("Error al actualizar cliente");
    });
    expect(mockRouter.back).not.toHaveBeenCalled();
  });

  it("filters clients and navigates to the selected client detail", async () => {
    const secondClient = {
      ...businessClient,
      id: "client-2",
      businessName: "Otra Empresa S.A.",
      isActive: false,
    };
    mockGetBusinessClients.mockResolvedValueOnce([businessClient, secondClient]);
    const screen = await render(<ClientsScreen />);

    await waitFor(() => expect(screen.getByText("Empresa Demo S.A.")).toBeTruthy());
    await fireEvent.changeText(screen.getByPlaceholderText("Buscar clientes..."), "Otra");

    expect(screen.queryByText("Empresa Demo S.A.")).toBeNull();
    expect(screen.getByText("Otra Empresa S.A.")).toBeTruthy();

    await fireEvent.press(screen.getByText("Otra Empresa S.A."));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/client-detail",
      params: { id: "client-2" },
    });
  });

  it("applies the inactive filter and supports the next page", async () => {
    const firstPage = Array.from({ length: 50 }, (_, index) => ({
      ...businessClient,
      id: `client-${index + 1}`,
      businessName: `Empresa ${String(index + 1).padStart(2, "0")}`,
      isActive: index % 2 === 0,
    }));
    const secondPage = [{ ...businessClient, id: "client-51", businessName: "Empresa Página 2" }];
    mockGetBusinessClients.mockResolvedValueOnce(firstPage).mockResolvedValueOnce(secondPage);
    const screen = await render(<ClientsScreen />);

    await waitFor(() => expect(screen.getByText("Empresa 01")).toBeTruthy());
    await fireEvent.press(
      screen.root!.queryAll((instance) => instance.props.accessible === true)[0],
    );
    await fireEvent.press(screen.getByText("Inactivos"));

    expect(screen.queryByText("Empresa 01")).toBeNull();
    expect(screen.getByText("Empresa 02")).toBeTruthy();

    await fireEvent.press(screen.getByText("Cargar más"));
    await waitFor(() => expect(mockGetBusinessClients).toHaveBeenLastCalledWith(50, 2));
  });
});
