import NegotiationDetailView from "@/components/NegotiationDetailView";
import { useLocalSearchParams } from "expo-router";

export default function NegotiationDetailScreen() {
  const {
    id,
    clientName,
    planName,
    amount,
    status,
    date,
    advisorName,
    estimatedCloseDate,
  } = useLocalSearchParams();

  return (
    <NegotiationDetailView
      id={id?.toString()}
      clientName={clientName?.toString()}
      planName={planName?.toString()}
      amount={amount?.toString()}
      status={status?.toString()}
      date={date?.toString()}
      advisorName={advisorName?.toString()}
      estimatedCloseDate={estimatedCloseDate?.toString()}
    />
  );
}
