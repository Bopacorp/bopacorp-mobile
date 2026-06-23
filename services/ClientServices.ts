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
}

export const getNegotiations = async (): Promise<Negotiation[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/crm/negotiations");

    return data.map((item: any) => {
      const status = item.state?.name || "Prospeccion";

      let date = "N/A";
      const dateSource = item.startDate || item.createdAt;
      if (dateSource) {
        const d = new Date(dateSource);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        date = `${day}/${month}/${year}`;
      }

      let estimatedCloseDate = "N/A";
      if (item.estimatedCloseDate) {
        const d = new Date(item.estimatedCloseDate);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        estimatedCloseDate = `${day}/${month}/${year}`;
      }

      const advProfile = item.advisor?.profile;
      const advisorName = advProfile
        ? `${advProfile.firstName} ${advProfile.lastName}`
        : item.advisor?.username || "Sin Asignar";

      return {
        id: item.id,
        clientName: item.client?.businessName || "Cliente Sin Nombre",
        planName: item.state?.name || "Sin Estado",
        amount: "$350.00",
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

export const getBusinessClients = async (): Promise<BusinessClient[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/crm/business-clients");

    return data.map((item: any) => {
      const advProfile = item.advisor?.profile;
      const advisorName = advProfile
        ? `${advProfile.firstName} ${advProfile.lastName}`
        : item.advisor?.username || "Sin Asignar";
      console.log("CLIENTE COMPLETO");
      console.log(JSON.stringify(item, null, 2));
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

export const getNegotiationDocuments = async (): Promise<DocumentItem[]> => {
  try {
    const data: any = await apiClient.get("/api/v1/documents");
    return data.map((doc: any) => ({
      id: doc.id,
      company: doc.negotiation?.client?.businessName || "Cliente Sin Nombre",
      fileName: doc.filename,
      status: doc.state,
      date: doc.uploadedAt || doc.createdAt || "N/A",
    }));
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
