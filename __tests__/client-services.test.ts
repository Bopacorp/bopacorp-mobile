import { apiClient } from "../services/api";
import {
  createBusinessClient,
  createNegotiation,
  createNegotiationDocument,
  createVisit,
  deleteNegotiationDocument,
  getAdvisorMetrics,
  getBusinessClient,
  getBusinessClients,
  getDocumentTypes,
  getNegotiation,
  getNegotiationDocuments,
  getNegotiationStates,
  getNegotiations,
  getNegotiationVisits,
  getVisitTypes,
  servicesCache,
  updateBusinessClient,
  updateNegotiation,
} from "../services/ClientServices";
import {
  advisorUser,
  businessClient,
  documentItem,
  documentUploadResponse,
  negotiation,
  negotiationState,
  rawBusinessClient,
  rawDocument,
  rawNegotiation,
  rawVisit,
  visitType,
} from "./fixtures/critical-fixtures";

jest.mock("react-native", () => ({
  Platform: { OS: "ios" },
}));

jest.mock("../services/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("ClientServices reads, mappings and cache", () => {
  const apiGet = apiClient.get as jest.MockedFunction<typeof apiClient.get>;
  const apiPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
  const apiPatch = apiClient.patch as jest.MockedFunction<typeof apiClient.patch>;
  const apiDelete = apiClient.delete as jest.MockedFunction<typeof apiClient.delete>;

  beforeEach(() => {
    servicesCache.clear();
    jest.clearAllMocks();
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  it("maps negotiations, dates, relations and fallback values", async () => {
    apiGet.mockResolvedValueOnce([
      rawNegotiation,
      {
        id: "negotiation-2",
        createdAt: "invalid-date",
        amount: undefined,
        state: undefined,
        client: undefined,
        advisor: { username: "advisor.two" },
      },
      {
        id: "negotiation-3",
        createdAt: "invalid-date",
        amount: undefined,
        state: undefined,
        client: undefined,
        advisor: undefined,
      },
    ] as any);

    await expect(getNegotiations(20, 3)).resolves.toEqual([
      {
        id: "negotiation-1",
        clientId: "client-1",
        clientName: "Empresa Demo S.A.",
        planName: "Negociacion",
        amount: "$1,000.00",
        status: "Negociacion",
        date: "01/08/2026",
        advisorName: "Ana Asesora",
        estimatedCloseDate: "31/08/2026",
      },
      {
        id: "negotiation-2",
        clientId: "",
        clientName: "Cliente Sin Nombre",
        planName: "Sin Estado",
        amount: "$0.00",
        status: "Prospeccion",
        date: "N/A",
        advisorName: "advisor.two",
        estimatedCloseDate: "N/A",
      },
      {
        id: "negotiation-3",
        clientId: "",
        clientName: "Cliente Sin Nombre",
        planName: "Sin Estado",
        amount: "$0.00",
        status: "Prospeccion",
        date: "N/A",
        advisorName: "Sin Asignar",
        estimatedCloseDate: "N/A",
      },
    ]);
    expect(apiGet).toHaveBeenCalledWith("/api/v1/crm/negotiations?limit=20&page=3");
  });

  it("caches negotiations by pagination and expires them after the TTL", async () => {
    apiGet.mockResolvedValue([rawNegotiation] as any);

    await getNegotiations(10, 2);
    await getNegotiations(10, 2);
    expect(apiGet).toHaveBeenCalledTimes(1);

    jest.useFakeTimers();
    jest.advanceTimersByTime(120001);
    apiGet.mockResolvedValueOnce([rawNegotiation] as any);
    await getNegotiations(10, 2);

    expect(apiGet).toHaveBeenCalledTimes(2);
  });

  it("returns an empty negotiation list when the API fails", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    apiGet.mockRejectedValue(new Error("negotiations unavailable"));

    await expect(getNegotiations()).resolves.toEqual([]);
    expect(warning).toHaveBeenCalledWith(
      "Could not load negotiations from backend:",
      expect.any(Error),
    );
  });

  it("maps business clients and normalizes missing contact data", async () => {
    apiGet.mockResolvedValueOnce([
      rawBusinessClient,
      {
        ...rawBusinessClient,
        id: "client-2",
        contactPhone: null,
        contactEmail: null,
        address: null,
        advisor: { username: "advisor.two", profile: null },
      },
    ] as any);

    await expect(getBusinessClients(50, 4)).resolves.toEqual([
      businessClient,
      {
        id: "client-2",
        ruc: rawBusinessClient.ruc,
        businessName: rawBusinessClient.businessName,
        contactName: rawBusinessClient.contactName,
        contactPhone: "N/A",
        contactEmail: "N/A",
        address: "Sin dirección",
        isActive: true,
        advisorName: "advisor.two",
        createdAt: rawBusinessClient.createdAt,
      },
    ]);
    expect(apiGet).toHaveBeenCalledWith("/api/v1/crm/business-clients?limit=50&page=4");

    await getBusinessClients(50, 4);
    expect(apiGet).toHaveBeenCalledTimes(1);
  });

  it("returns an empty client list when the API fails", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    apiGet.mockRejectedValue(new Error("clients unavailable"));

    await expect(getBusinessClients()).resolves.toEqual([]);
    expect(warning).toHaveBeenCalledWith(
      "Could not load business clients from backend:",
      expect.any(Error),
    );
  });

  it("maps documents with and without a negotiation filter", async () => {
    apiGet.mockResolvedValueOnce([
      rawDocument,
      {
        id: "document-2",
        filename: "otro.pdf",
        state: "APPROVED",
        createdAt: "invalid-date",
        negotiation: undefined,
      },
    ] as any);

    await expect(getNegotiationDocuments("negotiation-1")).resolves.toEqual([
      { ...documentItem, status: "PENDING" },
      {
        id: "document-2",
        company: "Cliente Sin Nombre",
        fileName: "otro.pdf",
        status: "APPROVED",
        date: "N/A",
      },
    ]);
    expect(apiGet).toHaveBeenCalledWith("/api/v1/documents?negotiationId=negotiation-1");

    await getNegotiationDocuments("negotiation-1");
    expect(apiGet).toHaveBeenCalledTimes(1);

    apiGet.mockResolvedValueOnce([]);
    await expect(getNegotiationDocuments()).resolves.toEqual([]);
    expect(apiGet).toHaveBeenLastCalledWith("/api/v1/documents");
  });

  it("returns an empty document list when the API fails", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    apiGet.mockRejectedValue(new Error("documents unavailable"));

    await expect(getNegotiationDocuments()).resolves.toEqual([]);
    expect(warning).toHaveBeenCalledWith(
      "Could not load negotiation documents:",
      expect.any(Error),
    );
  });

  it("loads negotiation details, billing and caches the result", async () => {
    apiGet.mockResolvedValueOnce(rawNegotiation as any).mockResolvedValueOnce({
      currentMonthlyBilling: 1234.5,
    } as any);

    const result = await getNegotiation("negotiation-1");

    expect(result).toEqual({
      id: "negotiation-1",
      clientId: "client-1",
      clientName: "Empresa Demo S.A.",
      planName: "Negociacion",
      amount: "$1,234.50",
      status: "Negociacion",
      date: "01/08/2026",
      advisorName: "Ana Asesora",
      estimatedCloseDate: "31/08/2026",
      observations: "",
      isActive: true,
      stateId: "state-1",
    });
    expect(apiGet).toHaveBeenNthCalledWith(1, "/api/v1/crm/negotiations/negotiation-1");
    expect(apiGet).toHaveBeenNthCalledWith(2, "/api/v1/crm/business-clients/client-1");

    await getNegotiation("negotiation-1");
    expect(apiGet).toHaveBeenCalledTimes(2);
  });

  it("uses a safe amount when the billing lookup fails", async () => {
    apiGet
      .mockResolvedValueOnce(rawNegotiation as any)
      .mockRejectedValueOnce(new Error("billing unavailable"));

    await expect(getNegotiation("negotiation-2")).resolves.toMatchObject({
      id: "negotiation-1",
      amount: "—",
    });
  });

  it("uses detail fallbacks for missing relations and invalid billing", async () => {
    apiGet.mockResolvedValueOnce({
      id: "negotiation-fallback",
      createdAt: "2026-08-02T10:00:00.000Z",
      estimatedCloseDate: "invalid-date",
      isActive: false,
      state: undefined,
      client: undefined,
      advisor: undefined,
    } as any);
    apiGet.mockResolvedValueOnce({ currentMonthlyBilling: "not-a-number" } as any);

    await expect(getNegotiation("negotiation-fallback")).resolves.toMatchObject({
      id: "negotiation-fallback",
      clientId: "",
      clientName: "Cliente Sin Nombre",
      planName: "Sin Estado",
      amount: "—",
      status: "Prospeccion",
      date: "02/08/2026",
      advisorName: "Sin Asignar",
      estimatedCloseDate: "N/A",
      isActive: false,
      stateId: "",
    });
  });

  it("propagates a negotiation detail request error", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    const requestError = new Error("detail unavailable");
    apiGet.mockRejectedValue(requestError);

    await expect(getNegotiation("negotiation-1")).rejects.toBe(requestError);
    expect(warning).toHaveBeenCalledWith("Could not load negotiation negotiation-1:", requestError);
  });

  it("loads and caches lookup and report collections", async () => {
    const metrics = [{ advisor: advisorUser, clientsContacted: 3 }];
    const documentTypes = [{ id: "type-1", name: "RUC", code: "RUC" }];
    apiGet
      .mockResolvedValueOnce([negotiationState] as any)
      .mockResolvedValueOnce(metrics as any)
      .mockResolvedValueOnce(documentTypes as any)
      .mockResolvedValueOnce([visitType] as any);

    await expect(getNegotiationStates()).resolves.toEqual([negotiationState]);
    await expect(getNegotiationStates()).resolves.toEqual([negotiationState]);
    await expect(getAdvisorMetrics()).resolves.toEqual(metrics);
    await expect(getDocumentTypes()).resolves.toEqual(documentTypes);
    await expect(getVisitTypes()).resolves.toEqual([visitType]);
    await expect(getVisitTypes()).resolves.toEqual([visitType]);

    expect(apiGet).toHaveBeenNthCalledWith(1, "/api/v1/crm/negotiation-states");
    expect(apiGet).toHaveBeenNthCalledWith(2, "/api/v1/reports/advisor-metrics");
    expect(apiGet).toHaveBeenNthCalledWith(3, "/api/v1/documents/types");
    expect(apiGet).toHaveBeenNthCalledWith(4, "/api/v1/crm/visit-types?limit=100");
  });

  it("returns empty collections when lookup and report requests fail", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    apiGet.mockRejectedValue(new Error("lookup unavailable"));

    await expect(getNegotiationStates()).resolves.toEqual([]);
    await expect(getAdvisorMetrics()).resolves.toEqual([]);
    await expect(getDocumentTypes()).resolves.toEqual([]);
    await expect(getVisitTypes()).resolves.toEqual([]);
    expect(warning).toHaveBeenCalled();
  });

  it("maps visits, preserves relations and caches by client", async () => {
    apiGet.mockResolvedValueOnce([
      rawVisit,
      { ...rawVisit, id: "visit-2", visitDate: "already-formatted" },
      { ...rawVisit, id: "visit-3", visitDate: undefined },
    ] as any);

    await expect(getNegotiationVisits("client-1")).resolves.toEqual([
      { ...rawVisit, visitDate: "15/08/2026" },
      { ...rawVisit, id: "visit-2", visitDate: "already-formatted" },
      { ...rawVisit, id: "visit-3", visitDate: "N/A" },
    ]);
    expect(apiGet).toHaveBeenCalledWith("/api/v1/crm/visits?clientId=client-1&limit=100");

    await getNegotiationVisits("client-1");
    expect(apiGet).toHaveBeenCalledTimes(1);
  });

  it("returns an empty visit list when the API fails", async () => {
    const warning = jest.spyOn(console, "warn").mockImplementation(() => {});
    apiGet.mockRejectedValue(new Error("visits unavailable"));

    await expect(getNegotiationVisits("client-1")).resolves.toEqual([]);
    expect(warning).toHaveBeenCalledWith("Could not load negotiation visits:", expect.any(Error));
  });

  it("caches a business client and propagates detail errors", async () => {
    apiGet.mockResolvedValueOnce(businessClient as any);
    await expect(getBusinessClient("client-1")).resolves.toEqual(businessClient);
    await getBusinessClient("client-1");
    expect(apiGet).toHaveBeenCalledTimes(1);

    servicesCache.clear();
    const requestError = new Error("client detail unavailable");
    apiGet.mockRejectedValue(requestError);
    await expect(getBusinessClient("client-1")).rejects.toBe(requestError);
  });

  it("sends document mutations and invalidates document cache", async () => {
    const payload = {
      negotiationId: "negotiation-1",
      documentTypeId: "type-1",
      filename: documentUploadResponse.filename,
      fileExtension: documentUploadResponse.fileExtension,
      fileSizeMb: documentUploadResponse.fileSizeMb,
      storagePath: documentUploadResponse.storagePath,
      mimeType: documentUploadResponse.mimeType,
      encryptionMetadata: documentUploadResponse.encryptionMetadata,
    };
    servicesCache.set("documents?negotiationId=negotiation-1", [documentItem]);
    apiPost.mockResolvedValueOnce({ id: "document-1" } as any);

    await createNegotiationDocument(payload);

    expect(apiPost).toHaveBeenCalledWith("/api/v1/documents", payload);
    expect(servicesCache.get("documents?negotiationId=negotiation-1")).toBeNull();

    servicesCache.set("documents?negotiationId=negotiation-1", [documentItem]);
    apiDelete.mockResolvedValueOnce({ success: true } as any);
    await deleteNegotiationDocument("document-1");

    expect(apiDelete).toHaveBeenCalledWith("/api/v1/documents/document-1");
    expect(servicesCache.get("documents?negotiationId=negotiation-1")).toBeNull();
  });

  it("sends negotiation mutations and invalidates list and detail cache", async () => {
    const createPayload = {
      clientId: "client-1",
      advisorId: "user-advisor-1",
      stateId: "state-1",
      startDate: "2026-08-15",
      estimatedCloseDate: "2026-09-15",
      observations: "Seguimiento",
      isActive: true,
    };
    const updatePayload = {
      stateId: "state-2",
      estimatedCloseDate: "2026-09-20",
      observations: "Actualizado",
      isActive: true,
    };
    servicesCache.set("negotiations?limit=100&page=1", [negotiation]);
    apiPost.mockResolvedValueOnce({ id: "negotiation-2" } as any);
    await createNegotiation(createPayload);
    expect(apiPost).toHaveBeenCalledWith("/api/v1/crm/negotiations", createPayload);
    expect(servicesCache.get("negotiations?limit=100&page=1")).toBeNull();

    servicesCache.set("negotiations?limit=100&page=1", [negotiation]);
    servicesCache.set("negotiation-detail-negotiation-1", negotiation);
    apiPatch.mockResolvedValueOnce({ id: "negotiation-1" } as any);
    await updateNegotiation("negotiation-1", updatePayload);

    expect(apiPatch).toHaveBeenCalledWith("/api/v1/crm/negotiations/negotiation-1", updatePayload);
    expect(servicesCache.get("negotiations?limit=100&page=1")).toBeNull();
    expect(servicesCache.get("negotiation-detail-negotiation-1")).toBeNull();
  });

  it("sends client mutations and invalidates client cache", async () => {
    const createPayload = {
      ruc: "0999999999001",
      businessName: "Empresa Demo S.A.",
      contactName: "Persona Demo",
      activeServicesCount: 0,
      currentMonthlyBilling: 0,
      isActive: true,
    };
    const updatePayload = {
      contactName: "Persona Actualizada",
      contactEmail: "actualizado@demo.test",
      isActive: false,
    };
    servicesCache.set("business-clients?limit=100&page=1", [businessClient]);
    apiPost.mockResolvedValueOnce({ id: "client-2" } as any);
    await createBusinessClient(createPayload);
    expect(apiPost).toHaveBeenCalledWith("/api/v1/crm/business-clients", createPayload);
    expect(servicesCache.get("business-clients?limit=100&page=1")).toBeNull();

    servicesCache.set("business-clients?limit=100&page=1", [businessClient]);
    servicesCache.set("business-client-client-1", businessClient);
    apiPatch.mockResolvedValueOnce({ id: "client-1" } as any);
    await updateBusinessClient("client-1", updatePayload);

    expect(apiPatch).toHaveBeenCalledWith("/api/v1/crm/business-clients/client-1", updatePayload);
    expect(servicesCache.get("business-clients?limit=100&page=1")).toBeNull();
    expect(servicesCache.get("business-client-client-1")).toBeNull();
  });

  it("sends visits with GPS fields and invalidates the client visit cache", async () => {
    const payload = {
      negotiationId: "negotiation-1",
      clientId: "client-1",
      advisorId: "user-advisor-1",
      visitTypeId: "visit-type-1",
      visitDate: "2026-08-15T12:00:00.000Z",
      observations: "Reunión de seguimiento",
      gpsLatitude: -2.17,
      gpsLongitude: -79.92,
      gpsAccuracy: 5,
      gpsTimestamp: "2026-08-15T12:00:01.000Z",
    };
    servicesCache.set("visits?clientId=client-1", [rawVisit]);
    apiPost.mockResolvedValueOnce({ id: "visit-2" } as any);

    await createVisit(payload);

    expect(apiPost).toHaveBeenCalledWith("/api/v1/crm/visits", payload);
    expect(servicesCache.get("visits?clientId=client-1")).toBeNull();
  });
});
