import { SetMetadata } from '@nestjs/common';

export const CAN_EVADE_JWT_GUARD_KEY = 'canEvadeJWTGuard';
export function EvadeJWTGuard() {
  return SetMetadata(CAN_EVADE_JWT_GUARD_KEY, true);
}
