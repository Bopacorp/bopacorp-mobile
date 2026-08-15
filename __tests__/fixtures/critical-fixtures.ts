import type { UserProfile } from "../../context/AuthContext";
import type { BusinessClient, DocumentItem, Negotiation } from "../../services/ClientServices";

export const accessToken = "access-token-test";
export const refreshToken = "refresh-token-test";

export const advisorUser: UserProfile = {
  id: "user-advisor-1",
  username: "advisor.test",
  email: "advisor.test@bopacorp.test",
  roles: ["advisor"],
  permissions: ["crm:read"],
  profile: {
    id: "profile-advisor-1",
    firstName: "Ana",
    lastName: "Asesora",
    nationalId: "0000000000",
  },
};

export const nonAdvisorUser: UserProfile = {
  ...advisorUser,
  id: "user-manager-1",
  username: "manager.test",
  email: "manager.test@bopacorp.test",
  roles: ["manager"],
};

export const negotiation: Negotiation = {
  id: "negotiation-1",
  clientName: "Empresa Demo",
  planName: "Plan Corporativo",
  amount: "$1,000.00",
  status: "Prospeccion",
  date: "15/08/2026",
  advisorName: "Ana Asesora",
  estimatedCloseDate: "30/08/2026",
};

export const businessClient: BusinessClient = {
  id: "client-1",
  ruc: "0999999999001",
  businessName: "Empresa Demo S.A.",
  contactName: "Persona Demo",
  contactPhone: "0999999999",
  contactEmail: "contacto@demo.test",
  address: "Guayaquil",
  isActive: true,
  advisorName: "Ana Asesora",
  createdAt: "2026-08-15T00:00:00.000Z",
};

export const documentItem: DocumentItem = {
  id: "document-1",
  company: "Empresa Demo S.A.",
  fileName: "contrato-demo.pdf",
  status: "Pendiente",
  date: "15/08/2026",
};
