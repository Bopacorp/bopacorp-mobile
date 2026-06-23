import ClientDetailView from "@/components/ClientDetailView";
import { getBusinessClient } from "@/services/ClientServices";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

export default function ClientDetailScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  console.log("ID en client-detail:", id);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    loadClient();
  }, []);

  async function loadClient() {
    try {
      const data = await getBusinessClient(id as string);
      console.log("ID cargado:", id); // 👈 temporal
      setClient(data);
    } catch (error) {
      console.log(error);
    }
  }
  if (!client) {
    return null;
  }

  return (
    <ClientDetailView
      id={id as string}
      businessName={client.businessName}
      ruc={client.ruc}
      contactName={client.contactName}
      contactPhone={client.contactPhone}
      contactEmail={client.contactEmail}
      address={client.address}
      advisorName={
        client.advisor?.profile
          ? `${client.advisor.profile.firstName} ${client.advisor.profile.lastName}`
          : client.advisor?.username
      }
      isActive={String(client.isActive)}
    />
  );
}
