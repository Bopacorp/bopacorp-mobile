// services/ClientServices.ts

export interface Negotiation {
  id: string;
  clientName: string;
  planName: string;
  amount: string;
  status: "Borrador" | "Enviado" | "Aprobado" | "Rechazado";
  date: string;
}

// ⚠️ IMPORTANTE: Aquí pondremos la URL de tu backend
const API_URL = "http://192.168.100.128:3000/api/v1/clients"; // Ejemplo, cambiaremos esto luego
export const getClients = async (): Promise<Negotiation[]> => {
  // Vamos a usar una URL más genérica por ahora para ver si responde algo
  const URL = "http://192.168.100.128:3000";

  try {
    // Intentaremos buscar en la raíz o en una ruta común
    const response = await fetch(`${URL}/api/v1/clients`);

    // Si la respuesta no es 200 (OK), no explotes, solo regresa vacío
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
    return []; // Esto hará que tu app muestre los datos de prueba de Anthony en lugar de la pantalla roja
  }
};
