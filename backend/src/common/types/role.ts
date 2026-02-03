export const ROLES = ['user', 'owner', 'admin'] as const;

export type Role = (typeof ROLES)[number];
