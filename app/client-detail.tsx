import ClientDetailView from "@/components/ClientDetailView";
import { useLocalSearchParams } from "expo-router";

export default function ClientDetailScreen() {
  const {
    businessName,
    ruc,
    contactName,
    contactPhone,
    contactEmail,
    address,
    advisorName,
    isActive,
  } = useLocalSearchParams();

  return (
    <ClientDetailView
      businessName={businessName?.toString()}
      ruc={ruc?.toString()}
      contactName={contactName?.toString()}
      contactPhone={contactPhone?.toString()}
      contactEmail={contactEmail?.toString()}
      address={address?.toString()}
      advisorName={advisorName?.toString()}
      isActive={isActive?.toString()}
    />
  );
}
