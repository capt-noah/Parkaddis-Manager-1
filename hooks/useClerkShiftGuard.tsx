import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  checkClerkGateAccess,
  ClerkGateBlockReason,
} from "../lib/clerkShift";
import ShiftHoursModal from "../components/ShiftHoursModal";

export function useClerkShiftGuard() {
  const { user } = useAuth();
  const [showGateModal, setShowGateModal] = useState(false);
  const [blockReason, setBlockReason] = useState<ClerkGateBlockReason>("shift");
  const [blockMessage, setBlockMessage] = useState<string | undefined>();

  const gateProfile = {
    status: user?.status,
    shiftStartTime: user?.shiftStartTime,
    shiftEndTime: user?.shiftEndTime,
  };

  const canUseGate = checkClerkGateAccess(gateProfile).ok;

  const showGateBlocked = useCallback(() => {
    const check = checkClerkGateAccess(gateProfile);
    if (!check.ok) {
      setBlockReason(check.reason);
      setBlockMessage(check.message);
      setShowGateModal(true);
    }
  }, [user?.status, user?.shiftStartTime, user?.shiftEndTime]);

  const guardAction = useCallback(
    (action: () => void) => {
      const check = checkClerkGateAccess(gateProfile);
      if (!check.ok) {
        setBlockReason(check.reason);
        setBlockMessage(check.message);
        setShowGateModal(true);
        return false;
      }
      action();
      return true;
    },
    [user?.status, user?.shiftStartTime, user?.shiftEndTime],
  );

  const ShiftGuardModal = () => (
    <ShiftHoursModal
      visible={showGateModal}
      onClose={() => setShowGateModal(false)}
      reason={blockReason}
      message={blockMessage}
      shiftStartTime={user?.shiftStartTime}
      shiftEndTime={user?.shiftEndTime}
    />
  );

  return {
    guardAction,
    ShiftGuardModal,
    isWithinShift: canUseGate,
    showShiftBlocked: showGateBlocked,
  };
}
