import { apiClient } from "./api";

export interface Negotiation {
  id: string;
  clientName: string;
  planName: string;
  amount: string;
  status: string;
  date: string;
  advisorName?: string;
  estimatedCloseDate?: string;
}

export interface BusinessClient {
  id: string;
  ruc: string;
  businessName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  isActive: boolean;
  advisorName: string;
  createdAt: string;
}

export const getNegotiations = async (limit: number = 100, page: number = 1): Promise<Negotiation[]> => {
  try {
    const data: any = await apiClient.get(`/api/v1/crm/negotiations?limit=${limit}&page=${page}`);

    return data.map((item: any) => {
      const status = item.state?.name || "Prospeccion";

      let date = "N/A";
      const dateSource = item.startDate || item.createdAt;
      if (dateSource) {
        const datePart = dateSource.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts;
          date = `${day}/${month}/${year}`;
        }
      }

      let estimatedCloseDate = "N/A";
      if (item.estimatedCloseDate) {
        const datePart = item.estimatedCloseDate.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts;
          estimatedCloseDate = `${day}/${month}/${year}`;
        }
      }

      const advProfile = item.advisor?.profile;
      const advisorName = advProfile
        ? `${advProfile.firstName} ${advProfile.lastName}`
        : item.advisor?.username || "Sin Asignar";

      return {
        id: item.id,
        clientId: item.client?.id || "",
        clientName: item.client?.businessName || "Cliente Sin Nombre",
        planName: item.state?.name || "Sin Estado",
        amount: item.amount || "$0.00",
        status,
        date,
        advisorName,
        estimatedCloseDate,
      };
    });
  } catch (error) {
    console.warn("Could not load negotiations from backend:", error);
    return [];
  }
};

export const getBusinessClients = async (limit: number = 100, page: number = 1): Promise<BusinessClient[]> => {
  try {
    const data: any = await apiClient.get(
      `/api/v1/crm/business-clients?limit=${limit}&page=${page}`,
    );

    return data.map((item: any) => {
      const advProfile = item.advisor?.profile;
      const advisorName = advProfile
        ? `${advProfile.firstName} ${advProfile.lastName}`
        : item.advisor?.username || "Sin Asignar";
      return {
        id: item.id,
        ruc: item.ruc,
        businessName: item.businessName,
        contactName: item.contactName,
        contactPhone: item.contactPhone || "N/A",
        contactEmail: item.contactEmail || "N/A",
        address: item.address || "Sin dirección",
        isActive: item.isActive,
        advisorName,
        createdAt: item.createdAt,
      };
    });
  } catch (error) {
    console.warn("Could not load business clients from backend:", error);
    return [];
  }
};

export interface DocumentItem {
  id: string;
  company: string;
  fileName: string;
  status: string;
  date: string;
}

export const getNegotiationDocuments = async (
  negotiationId?: string,
): Promise<DocumentItem[]> => {
  try {
    const url = negotiationId
      ? `/api/v1/documents?negotiationId=${negotiationId}`
      : "/api/v1/documents";
    const data: any = await apiClient.get(url);
    return data.map((doc: any) => {
      let date = "N/A";
      const dateSource = doc.uploadedAt || doc.createdAt;
      if (dateSource) {
        const datePart = dateSource.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts;
          date = `${day}/${month}/${year}`;
        }
      }
      return {
        id: doc.id,
        company: doc.negotiation?.client?.businessName || "Cliente Sin Nombre",
        fileName: doc.filename,
        status: doc.state,
        date,
      };
    });
  } catch (error) {
    console.warn("Could not load negotiation documents:", error);
    return [];
  }
};

export interface AdvisorMetrics {
  advisor: {
    id: string;
    username: string;
    profile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  clientsContacted: number;
  clientsInNegotiation: number;
  clientsClosed: number;
  clientsPostSale: number;
  clientsVisited: number;
  totalBilledAmount: number;
  averageBillingPerService: number;
}

export const getAdvisorMetrics = async (): Promise<AdvisorMetrics[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/reports/advisor-metrics");
    return data;
  } catch (error) {
    console.warn("Could not load advisor metrics:", error);
    return [];
  }
};

export interface DocumentTypeItem {
  id: string;
  name: string;
  code: string;
}

export const getDocumentTypes = async (): Promise<DocumentTypeItem[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/documents/types");
    return data;
  } catch (error) {
    console.warn("Could not load document types:", error);
    return [];
  }
};

export const uploadDocumentFile = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  return apiClient.post("/api/v1/document-uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createNegotiationDocument = async (data: {
  negotiationId: string;
  documentTypeId: string;
  filename: string;
  fileExtension: string;
  fileSizeMb: number;
  storagePath: string;
  mimeType: string;
  encryptionMetadata: any;
}): Promise<any> => {
  return apiClient.post("/api/v1/documents", data);
};

export const deleteNegotiationDocument = async (id: string): Promise<any> => {
  return apiClient.delete(`/api/v1/documents/${id}`);
};

export const updateNegotiation = async (
  id: string,
  data: {
    stateId?: string;
    startDate?: string;
    estimatedCloseDate?: string;
    observations?: string;
    isActive?: boolean;
  },
): Promise<any> => {
  return apiClient.patch(`/api/v1/crm/negotiations/${id}`, data);
};

export interface NegotiationState {
  id: string;
  name: string;
  code: string;
}

export const getNegotiationStates = async (): Promise<NegotiationState[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/crm/negotiation-states");

    return data;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

export const createNegotiation = async (data: {
  clientId: string;
  advisorId: string;
  stateId: string;
  startDate?: string;
  estimatedCloseDate?: string;
  observations?: string;
  isActive?: boolean;
}): Promise<any> => {
  return apiClient.post("/api/v1/crm/negotiations", data);
};

export const getBusinessClient = async (id: string): Promise<any> => {
  const data = await apiClient.get(`/api/v1/crm/business-clients/${id}`);
  return data;
};

export const createBusinessClient = async (data: any): Promise<any> => {
  return apiClient.post("/api/v1/crm/business-clients", data);
};

export const updateBusinessClient = async (
  id: string,
  data: any,
): Promise<any> => {
  return apiClient.patch(`/api/v1/crm/business-clients/${id}`, data);
};

export const getNegotiation = async (id: string): Promise<any> => {
  try {
    const item: any = await apiClient.get(`/api/v1/crm/negotiations/${id}`);

    const status = item.state?.name || "Prospeccion";

    let date = "N/A";
    const dateSource = item.startDate || item.createdAt;
    if (dateSource) {
      const datePart = dateSource.split("T")[0];
      const parts = datePart.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        date = `${day}/${month}/${year}`;
      }
    }

    let estimatedCloseDate = "N/A";
    if (item.estimatedCloseDate) {
      const datePart = item.estimatedCloseDate.split("T")[0];
      const parts = datePart.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts;
        estimatedCloseDate = `${day}/${month}/${year}`;
      }
    }

    const advProfile = item.advisor?.profile;
    const advisorName = advProfile
      ? `${advProfile.firstName} ${advProfile.lastName}`
      : item.advisor?.username || "Sin Asignar";

    let amount = "—";
    try {
      const clientData: any = await apiClient.get(`/api/v1/crm/business-clients/${item.client?.id}`);
      const billing = clientData?.currentMonthlyBilling;
      if (billing !== undefined && billing !== null) {
        const num = Number(billing);
        amount = isNaN(num) ? "—" : `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } catch {
      // If client fetch fails, leave amount as "—"
    }

    return {
      id: item.id,
      clientId: item.client?.id || "",
      clientName: item.client?.businessName || "Cliente Sin Nombre",
      planName: item.state?.name || "Sin Estado",
      amount,
      status,
      date,
      advisorName,
      estimatedCloseDate,
      observations: item.observations || "",
      isActive: item.isActive ?? true,
      stateId: item.state?.id || "",
    };
  } catch (error) {
    console.warn(`Could not load negotiation ${id}:`, error);
    throw error;
  }
};

export interface VisitItem {
  id: string;
  visitDate: string;
  isVerified: boolean;
  observations?: string;
  negotiationId?: string;
  client: { id: string; businessName: string };
  advisor: { id: string; username: string; profile: { firstName: string; lastName: string } | null };
  visitType: { id: string; code: string; name: string };
}

export const getNegotiationVisits = async (clientId: string): Promise<VisitItem[]> => {
  try {
    console.log("[DEBUG] getNegotiationVisits calling API for clientId:", clientId);
    const data: any = await apiClient.get(`/api/v1/crm/visits?clientId=${clientId}&limit=100`);
    console.log("[DEBUG] getNegotiationVisits raw data length:", data?.length);
    const formatted = data.map((visit: any) => {
      let visitDate = "N/A";
      if (visit.visitDate) {
        const datePart = visit.visitDate.split("T")[0];
        const parts = datePart.split("-");
        if (parts.length === 3) {
          const [year, month, day] = parts;
          visitDate = `${day}/${month}/${year}`;
        } else {
          visitDate = visit.visitDate;
        }
      }
      return {
        ...visit,
        visitDate,
      };
    });
    console.log("[DEBUG] getNegotiationVisits formatted data:", JSON.stringify(formatted));
    return formatted;
  } catch (error) {
    console.warn("Could not load negotiation visits:", error);
    return [];
  }
};

export const getVisitTypes = async (): Promise<any[]> => {
  try {
    console.log("[DEBUG] getVisitTypes calling apiClient...");
    const data: any = await apiClient.get("/api/v1/crm/visit-types?limit=100");
    console.log("[DEBUG] getVisitTypes apiClient response data:", JSON.stringify(data));
    return data;
  } catch (error: any) {
    console.warn("Could not load visit types:", error);
    console.warn("Could not load visit types (message):", error?.message);
    console.warn("Could not load visit types (response):", JSON.stringify(error?.response?.data));
    return [];
  }
};

export const createVisit = async (data: {
  negotiationId?: string;
  clientId: string;
  advisorId: string;
  visitTypeId: string;
  visitDate: string;
  observations?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAccuracy?: number;
  gpsTimestamp?: string;
}): Promise<any> => {
  return apiClient.post("/api/v1/crm/visits", data);
};


