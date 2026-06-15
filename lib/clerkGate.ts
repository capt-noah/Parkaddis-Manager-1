import { apiFetch, ApiResponse } from "./api";

export interface ClerkUserSearchResult {
  user: {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    role?: string;
  };
  activeReservation: {
    id: string;
    status: string;
    qrToken?: string;
    plateNumber?: string;
    carModel?: string;
    carColor?: string;
    locationName?: string;
    startTime?: string;
    endTime?: string;
  } | null;
  locationMismatch?: boolean;
}

export interface PaymentVerificationResult {
  reservationId: string;
  status: string;
  paymentStatus: "SUCCESS" | "PENDING" | "FAILED" | string;
  amount: string;
}

export function isPaymentCleared(
  _paymentStatus?: string,
  reservationStatus?: string,
) {
  return reservationStatus === "PAID";
}

export async function searchClerkUser(params: {
  phoneNumber?: string;
  email?: string;
}): Promise<ApiResponse<ClerkUserSearchResult>> {
  const query = new URLSearchParams();
  if (params.phoneNumber?.trim()) {
    query.set("phoneNumber", params.phoneNumber.trim());
  }
  if (params.email?.trim()) {
    query.set("email", params.email.trim());
  }

  return apiFetch<ClerkUserSearchResult>(`/clerk/search-user?${query.toString()}`);
}

export async function verifyClerkPayment(params: {
  qrToken?: string;
  reservationId?: string;
}): Promise<ApiResponse<PaymentVerificationResult>> {
  return apiFetch<PaymentVerificationResult>("/clerk/verify-payment", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export function getSearchErrorMessage(
  result: ApiResponse<unknown>,
  fallback = "Search failed. Please try again.",
) {
  if (result.status === 0) {
    return "Network error. Check your connection and try again.";
  }
  if (result.status === 404) {
    return result.error || "No user found for that phone number or email.";
  }
  if (result.status === 403) {
    return result.error || "Access denied. You may be outside your shift hours.";
  }
  if (result.status === 400) {
    return result.error || "Enter a valid phone number or email.";
  }
  return result.error || fallback;
}
