import { apiFetch, ApiResponse } from "./api";

export interface ClerkSession {
  id: string;
  plateNumber: string;
  carModel?: string;
  carColor?: string;
  duration?: string;
  accrued?: string;
  status: "RESERVED" | "ACTIVE" | "COMPLETED" | "CANCELLED" | "PAID" | string;
  paymentStatus: "PENDING" | "PAID" | string;
  startTime?: string;
  endTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  qrToken?: string;
  locationName?: string;
  pricePerHour?: string;
}

export interface ClerkSessionsPayload {
  reservations: ClerkSession[];
  locationId?: string;
  locationName?: string | null;
  locationStats?: {
    totalSlots: number;
    availableSlots: number;
    activeSessions: number;
  };
}

export function parseClerkSessionsResponse(data: unknown): ClerkSessionsPayload {
  if (!data || typeof data !== "object") {
    return { reservations: [] };
  }

  const payload = data as Record<string, unknown>;
  const reservations = Array.isArray(payload.reservations)
    ? payload.reservations
    : Array.isArray(payload)
      ? payload
      : Array.isArray(payload.data)
        ? payload.data
        : [];

  return {
    reservations: reservations as ClerkSession[],
    locationId: payload.locationId as string | undefined,
    locationName: payload.locationName as string | null | undefined,
    locationStats: payload.locationStats as ClerkSessionsPayload["locationStats"],
  };
}

export function isPaidSession(session: Pick<ClerkSession, "status">) {
  return session.status === "PAID";
}

export function getSessionTotal(session: ClerkSession) {
  return session.accrued || "0";
}

export async function fetchClerkSessions(
  status?: string,
): Promise<ApiResponse<ClerkSessionsPayload>> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const result = await apiFetch<ClerkSessionsPayload>(`/clerk/sessions${query}`);

  if (result.ok && result.data) {
    return {
      ...result,
      data: parseClerkSessionsResponse(result.data),
    };
  }

  return result;
}
