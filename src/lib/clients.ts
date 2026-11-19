export type ClientGroup = 'government' | 'banks-insurers' | 'groups' | 'growth';

export const GROUP_ORDER: ClientGroup[] = ['government', 'banks-insurers', 'groups', 'growth'];

export const GROUP_LABELS: Record<ClientGroup, string> = {
  government: 'Government and public institutions',
  'banks-insurers': 'Banks and insurers',
  groups: 'International and hospitality groups',
  growth: 'Growth and technology companies',
};

export function groupClients<T extends { group: ClientGroup; order: number }>(
  clients: T[],
): Array<{ group: ClientGroup; label: string; clients: T[] }> {
  return GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    clients: clients.filter((c) => c.group === group).sort((a, b) => a.order - b.order),
  })).filter((g) => g.clients.length > 0);
}
