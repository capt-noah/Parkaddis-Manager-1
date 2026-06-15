import dayjs from "dayjs";
import { ClerkSession } from "./clerkSessions";

export const FALLBACK_ETB_PER_HOUR = 25;
export const RESERVATION_FEE_ET = 5;
export const SERVICE_FEE_ET = 2;
export const BOOKING_FEE_ET = RESERVATION_FEE_ET + SERVICE_FEE_ET;

const ACTUAL_START_KEYS = [
  "actualStartTime",
  "actual_start_time",
  "actualStart",
  "actual_start",
  "sessionStartTime",
  "session_started_at",
  "sessionStartedAt",
  "enteredAt",
  "checkedInAt",
  "startedAt",
  "realStartTime",
] as const;

const ACTUAL_END_KEYS = [
  "actualEndTime",
  "actual_end_time",
  "actualEnd",
  "actual_end",
  "sessionEndTime",
  "session_ended_at",
  "sessionEndedAt",
  "exitedAt",
  "checkedOutAt",
  "completedAt",
  "endedAt",
  "realEndTime",
] as const;

export interface Reservation {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  qrToken?: string;
  vehicle?: { plateNumber?: string; carModel?: string };
  spot?: { pricePerHour?: string | number };
  locationName?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  totalCost?: string | number;
  amount?: string | number;
  accrued?: string | number;
  pricePerHour?: string | number;
  plateNumber?: string;
  carModel?: string;
}

function parseMoney(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function coerceIsoInstant(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
}

function firstIsoField(
  o: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const k of keys) {
    const iso = coerceIsoInstant(o[k]);
    if (iso) return iso;
  }
  return undefined;
}

export function getReservationActualStartInstant(
  r: Reservation,
): dayjs.Dayjs | null {
  const o = r as unknown as Record<string, unknown>;
  const aStart = firstIsoField(o, ACTUAL_START_KEYS);
  if (!aStart) return null;
  const d = dayjs(aStart);
  return d.isValid() ? d : null;
}

export function getReservationActualEndInstant(
  r: Reservation,
): dayjs.Dayjs | null {
  const o = r as unknown as Record<string, unknown>;
  const aEnd = firstIsoField(o, ACTUAL_END_KEYS);
  if (!aEnd) return null;
  const d = dayjs(aEnd);
  return d.isValid() ? d : null;
}

export function getReservationEntryInstant(r: Reservation): dayjs.Dayjs | null {
  return getReservationActualStartInstant(r);
}

const hourlyRate = (r: Reservation) =>
  parseMoney(r.spot?.pricePerHour) ??
  parseMoney(r.pricePerHour) ??
  FALLBACK_ETB_PER_HOUR;

function parkingFeeFromWindow(
  start: dayjs.Dayjs,
  end: dayjs.Dayjs,
  rate: number,
): string {
  const hours = Math.max(0, end.diff(start, "hour", true));
  return (hours * rate).toFixed(2);
}

function isPreCheckInReservation(status: string, r: Reservation) {
  return (
    status === "RESERVED" ||
    (status === "PAID" && !getReservationActualStartInstant(r))
  );
}

function getPricingTimeWindow(
  r: Reservation,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } | null {
  const status = String(r.status ?? "").toUpperCase();
  const schedStart = dayjs(r.startTime);
  const schedEnd = dayjs(r.endTime);

  if (isPreCheckInReservation(status, r)) return null;

  if (status === "ACTIVE") {
    const start = getReservationActualStartInstant(r);
    if (!start) return null;
    return { start, end: dayjs() };
  }

  if (status === "CANCELLED" || status === "EXPIRED") {
    if (!schedStart.isValid() || !schedEnd.isValid()) return null;
    return { start: schedStart, end: schedEnd };
  }

  if (status === "COMPLETED" || status === "PAID" || status === "UNPAID") {
    const start = getReservationActualStartInstant(r) ?? schedStart;
    const end = getReservationActualEndInstant(r) ?? schedEnd;
    if (!start.isValid() || !end.isValid()) return null;
    return { start, end };
  }

  if (!schedStart.isValid() || !schedEnd.isValid()) return null;
  return { start: schedStart, end: schedEnd };
}

function getApiParkingTotal(r: Reservation): string | null {
  const direct =
    parseMoney(r.accrued) ??
    parseMoney(r.totalCost) ??
    parseMoney(r.amount) ??
    parseMoney((r as unknown as Record<string, unknown>).total_amount) ??
    parseMoney((r as unknown as Record<string, unknown>).total_price) ??
    parseMoney((r as unknown as Record<string, unknown>).cost) ??
    parseMoney((r as unknown as Record<string, unknown>).price);
  return direct != null ? direct.toFixed(2) : null;
}

export function mergeReservationRows(
  primary: Reservation | null,
  fallback: Reservation | null,
): Reservation | null {
  if (!primary && !fallback) return null;
  if (!primary) return fallback;
  if (!fallback) return primary;

  return normalizeReservation({
    ...fallback,
    ...primary,
    actualStartTime:
      primary.actualStartTime ??
      fallback.actualStartTime ??
      firstIsoField(primary as unknown as Record<string, unknown>, ACTUAL_START_KEYS),
    actualEndTime:
      primary.actualEndTime ??
      fallback.actualEndTime ??
      firstIsoField(primary as unknown as Record<string, unknown>, ACTUAL_END_KEYS),
    accrued: primary.accrued ?? fallback.accrued,
    pricePerHour: primary.pricePerHour ?? fallback.pricePerHour,
    spot: primary.spot ?? fallback.spot,
    vehicle: primary.vehicle ?? fallback.vehicle,
    locationName: primary.locationName ?? fallback.locationName,
  });
}

export function normalizeReservation(raw: unknown): Reservation | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return null;

  const vehicle = o.vehicle as Reservation["vehicle"] | undefined;
  const spot = o.spot as Reservation["spot"] | undefined;
  const pricePerHour =
    parseMoney(spot?.pricePerHour) ??
    parseMoney(o.pricePerHour) ??
    parseMoney(o.price_per_hour);

  const plateFromRow =
    (typeof o.plateNumber === "string" && o.plateNumber) ||
    (typeof o.plate_number === "string" && o.plate_number) ||
    vehicle?.plateNumber;
  const modelFromRow =
    (typeof o.carModel === "string" && o.carModel) ||
    (typeof o.car_model === "string" && o.car_model) ||
    vehicle?.carModel;

  return {
    ...(o as unknown as Reservation),
    id: o.id,
    startTime: String(o.startTime ?? o.start_time ?? new Date().toISOString()),
    endTime: String(o.endTime ?? o.end_time ?? new Date().toISOString()),
    status: String(o.status ?? "RESERVED"),
    qrToken:
      (typeof o.qrToken === "string" && o.qrToken) ||
      (typeof o.qr_token === "string" && o.qr_token) ||
      undefined,
    actualStartTime: firstIsoField(o, ACTUAL_START_KEYS),
    actualEndTime: firstIsoField(o, ACTUAL_END_KEYS),
    locationName:
      (typeof o.locationName === "string" && o.locationName) ||
      (typeof o.location_name === "string" && o.location_name) ||
      undefined,
    plateNumber: plateFromRow,
    carModel: modelFromRow,
    pricePerHour: pricePerHour != null ? String(pricePerHour) : undefined,
    accrued: o.accrued ?? o.totalCost ?? o.amount,
    vehicle: vehicle ?? {
      plateNumber: plateFromRow,
      carModel: modelFromRow,
    },
    spot:
      spot ??
      (pricePerHour != null
        ? { pricePerHour: String(pricePerHour) }
        : undefined),
  };
}

export function clerkSessionToReservation(session: ClerkSession): Reservation {
  return (
    normalizeReservation({
      ...session,
      vehicle: {
        plateNumber: session.plateNumber,
        carModel: session.carModel,
      },
      spot: session.pricePerHour
        ? { pricePerHour: session.pricePerHour }
        : undefined,
    }) ?? {
      id: session.id,
      startTime: session.startTime || new Date().toISOString(),
      endTime: session.endTime || new Date().toISOString(),
      status: session.status,
    }
  );
}

export function getReservationDisplayPriceEt(r: Reservation): string {
  const status = String(r.status ?? "").toUpperCase();

  if (isPreCheckInReservation(status, r)) {
    return BOOKING_FEE_ET.toFixed(2);
  }

  if (status === "COMPLETED" || status === "PAID" || status === "UNPAID") {
    const apiTotal = getApiParkingTotal(r);
    if (apiTotal != null) return apiTotal;
  }

  const window = getPricingTimeWindow(r);
  if (!window) return "0.00";

  return parkingFeeFromWindow(window.start, window.end, hourlyRate(r));
}

export function getDashboardSessionPriceEt(r: Reservation): string {
  const status = String(r.status ?? "").toUpperCase();

  if (isPreCheckInReservation(status, r)) {
    return BOOKING_FEE_ET.toFixed(2);
  }

  if (status === "ACTIVE") {
    const start = getReservationActualStartInstant(r);
    if (!start) return "0.00";
    return parkingFeeFromWindow(start, dayjs(), hourlyRate(r));
  }

  return getReservationDisplayPriceEt(r);
}

export function getReservationParkingFeeEt(r: Reservation): string {
  const status = String(r.status ?? "").toUpperCase();

  if (isPreCheckInReservation(status, r)) {
    return "0.00";
  }

  if (status === "COMPLETED" || status === "PAID" || status === "UNPAID") {
    const apiTotal = getApiParkingTotal(r);
    if (apiTotal != null) return apiTotal;
  }

  const window = getPricingTimeWindow(r);
  if (!window) return "0.00";

  return parkingFeeFromWindow(window.start, window.end, hourlyRate(r));
}

export function getReservationReceiptGrandTotalEt(r: Reservation): string {
  const status = String(r.status ?? "").toUpperCase();
  if (isPreCheckInReservation(status, r)) {
    return BOOKING_FEE_ET.toFixed(2);
  }
  const parking = parseFloat(getReservationParkingFeeEt(r));
  return (parking + BOOKING_FEE_ET).toFixed(2);
}

export function getReservationModalType(
  r: Reservation,
): "ticket" | "receipt" {
  const status = String(r.status ?? "").toUpperCase();
  if (
    status === "ACTIVE" ||
    status === "RESERVED" ||
    (status === "PAID" && !getReservationActualStartInstant(r))
  ) {
    return "ticket";
  }
  return "receipt";
}

export function getSessionModalType(session: ClerkSession): "ticket" | "receipt" {
  return getReservationModalType(clerkSessionToReservation(session));
}

export function getReservationLocationLabel(
  r: Reservation,
  fallback = "ParkAddis Station",
): string {
  if (r.locationName) return String(r.locationName);
  return fallback;
}

export function getReservationQrToken(r: Reservation): string | null {
  if (r.qrToken && r.qrToken.length > 0) return r.qrToken;
  return null;
}

export function getReservationPlateLabel(
  r: Reservation,
  fallback = "—",
): string {
  if (r.vehicle?.plateNumber) return String(r.vehicle.plateNumber);
  if (r.plateNumber) return String(r.plateNumber);
  return fallback;
}
