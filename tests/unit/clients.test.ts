import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, it, expect } from 'vitest';
import { groupClients, type ClientGroup } from '../../src/lib/clients';

const c = (id: string, group: ClientGroup, order: number) => ({ id, group, order });

describe('groupClients', () => {
  it('orders groups and clients, drops empty groups', () => {
    const out = groupClients([c('tahreez', 'growth', 3), c('hrsd', 'government', 1), c('snb', 'banks-insurers', 1), c('kingsaud', 'government', 2)]);
    expect(out.map((g) => g.group)).toEqual(['government', 'banks-insurers', 'growth']);
    expect(out[0].clients.map((x) => x.id)).toEqual(['hrsd', 'kingsaud']);
    expect(out[0].label).toBe('Government and public institutions');
  });
});

describe('clients.yaml', () => {
  const clients = parse(readFileSync('src/data/clients.yaml', 'utf8')) as Array<{ id: string; name: string; group: ClientGroup }>;
  const names = (group: ClientGroup) => clients.filter((x) => x.group === group).map((x) => x.name);

  it('lists twelve clients with parent group names, never venues', () => {
    expect(clients).toHaveLength(12);
    const all = clients.map((x) => x.name).join(' | ');
    expect(all).toContain('Barceló Group');
    expect(all).toContain('Atlas Group');
    expect(all).not.toMatch(/Casa Harris|Shanzoo/);
  });

  it('matches the content spec grouping', () => {
    expect(names('government')).toEqual(['HRSD (Ministry of Human Resources and Social Development)', 'King Saud Medical City']);
    expect(names('banks-insurers')).toEqual(['Saudi National Bank (SNB)', 'Crédit du Maroc (CDM)', 'SANLAM', 'AtlantaSanad']);
    expect(names('groups')).toEqual(['Hertz', 'Barceló Group', 'Atlas Group']);
    expect(names('growth')).toEqual(['YouCan', 'CityClub', 'Tahreez']);
  });
});
