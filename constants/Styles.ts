import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  searchContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  listContainer: {
    gap: 12,
    backgroundColor: "transparent",
  },
  noResultsText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  clientCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  clientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clientName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clientInfo: {
    fontSize: 14,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  actionIcon: {
    marginRight: 8,
  },
  // KPI Dashboard styles (from overview.tsx)
  kpiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "transparent",
    width: "100%",
  },
  kpiCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiTitle: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  kpiSubtitle: {
    fontSize: 10,
    textAlign: "center",
  },
});
