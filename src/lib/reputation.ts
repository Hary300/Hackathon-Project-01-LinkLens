export type ReputationCheckStatus = 'found' | 'clear' | 'unavailable';

export type ReputationCheck = {
  indicator: 21 | 22 | 23 | 24 | 25;
  status: ReputationCheckStatus;
  description: string;
  source: string;
};

export const isReputationCheck = (value: unknown): value is ReputationCheck =>
  typeof value === 'object' &&
  value !== null &&
  'indicator' in value &&
  typeof value.indicator === 'number' &&
  [21, 22, 23, 24, 25].includes(value.indicator) &&
  'status' in value &&
  typeof value.status === 'string' &&
  ['found', 'clear', 'unavailable'].includes(value.status) &&
  'description' in value &&
  typeof value.description === 'string' &&
  'source' in value &&
  typeof value.source === 'string';

export type GoogleCheckResult =
  | { status: 'checking' }
  | { status: 'error'; message: string }
  | { status: 'complete'; checks: ReputationCheck[] };
