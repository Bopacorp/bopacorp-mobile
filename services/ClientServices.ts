import { apiClient } from "./api";

export interface Negotiation {
  id: string;
  clientName: string;
  planName: string;
  amount: string;
  status: "Borrador" | "Enviado" | "Aprobado" | "Rechazado";
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
      // Map backend negotiation states to UI statuses: "Borrador" | "Enviado" | "Aprobado" | "Rechazado"
      let status: "Borrador" | "Enviado" | "Aprobado" | "Rechazado" = "Borrador";
      const code = item.state?.code || "";
      
      if (code === "prospecting") {
        status = "Borrador";
      } else if (code === "initial_contact" || code === "negotiation") {
        status = "Enviado";
      } else if (code === "closing") {
        status = "Aprobado";
      } else if (code === "post_sale") {
        status = "Aprobado";
      }

      // Format date from backend
      let date = "N/A";
      const dateSource = item.startDate || item.createdAt;
      if (dateSource) {
        const d = new Date(dateSource);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        date = `${day}/${month}/${year}`;
      }

      let estimatedCloseDate = "N/A";
      if (item.estimatedCloseDate) {
        const d = new Date(item.estimatedCloseDate);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        estimatedCloseDate = `${day}/${month}/${year}`;
      }

      // Format Advisor Name
      const advProfile = item.advisor?.profile;
      const advisorName = advProfile
        ? `${advProfile.firstName} ${advProfile.lastName}`
        : item.advisor?.username || "Sin Asignar";

      return {
        id: item.id,
        clientName: item.client?.businessName || "Cliente Sin Nombre",
        planName: item.state?.name || "Sin Estado",
        amount: "$350.00", // Default placeholder for display
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
      };
    });
  } catch (error) {
    console.warn("Could not load business clients from backend:", error);
    return [];
  }
};
