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

export const rawNegotiation = {
  id: "negotiation-1",
  startDate: "2026-08-01T10:00:00.000Z",
  estimatedCloseDate: "2026-08-31T10:00:00.000Z",
  createdAt: "2026-08-01T09:00:00.000Z",
  amount: "$1,000.00",
  state: { id: "state-1", name: "Negociacion" },
  client: { id: "client-1", businessName: "Empresa Demo S.A." },
  advisor: {
    username: "advisor.test",
    profile: { firstName: "Ana", lastName: "Asesora" },
  },
};

export const rawBusinessClient = {
  id: "client-1",
  ruc: "0999999999001",
  businessName: "Empresa Demo S.A.",
  contactName: "Persona Demo",
  contactPhone: "0999999999",
  contactEmail: "contacto@demo.test",
  address: "Guayaquil",
  isActive: true,
  createdAt: "2026-08-15T00:00:00.000Z",
  advisor: {
    username: "advisor.test",
    profile: { firstName: "Ana", lastName: "Asesora" },
  },
};

export const rawDocument = {
  id: "document-1",
  filename: "contrato-demo.pdf",
  state: "PENDING",
  uploadedAt: "2026-08-15T00:00:00.000Z",
  negotiation: { client: { businessName: "Empresa Demo S.A." } },
};

export const rawVisit = {
  id: "visit-1",
  visitDate: "2026-08-15T12:00:00.000Z",
  isVerified: false,
  observations: "Reunión de seguimiento",
  client: { id: "client-1", businessName: "Empresa Demo S.A." },
  advisor: {
    id: "user-advisor-1",
    username: "advisor.test",
    profile: { firstName: "Ana", lastName: "Asesora" },
  },
  visitType: { id: "visit-type-1", code: "CALL", name: "Llamada" },
};

export const negotiationState = {
  id: "state-1",
  name: "Negociacion",
  code: "NEGOTIATION",
};

export const visitType = {
  id: "visit-type-1",
  code: "CALL",
  name: "Llamada",
};

export const documentUploadResponse = {
  storagePath: "uploads/document-1.pdf",
  filename: "contrato-demo.pdf",
  fileExtension: "pdf",
  fileSizeMb: 1.25,
  mimeType: "application/pdf",
  encryptionMetadata: { iv: "iv-test", authTag: "auth-tag-test" },
};
