// services/ClientServices.ts

export interface Negotiation {
  id: string;
  clientName: string;
  planName: string;
  amount: string;
  status: "Borrador" | "Enviado" | "Aprobado" | "Rechazado";
  date: string;
}


const API_URL = "http://192.168.100.128:3000/api/v1/clients"; 
export const getClients = async (): Promise<Negotiation[]> => {

  const URL = "http://192.168.100.128:3000";

  try {

    const response = await fetch(`${URL}/api/v1/clients`);


    if (!response.ok) {
      console.warn(
        "La ruta no existe o el servidor respondió:",
        response.status,
      );
      return [];
    }

    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.log("No pudimos conectar, usando datos locales...");
    return []; 
  }
};
