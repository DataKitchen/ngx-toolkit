import { AlertLevel } from '../models';
import {} from '../models';

export interface RemappedInstanceAlert<T> {
  count: number;
  alerts: T[];
}

interface Summary {
  status: string;
  count: number;
}

export function aggregateAlerts<T extends { level: AlertLevel }>(alerts: Array<T>): { errors: RemappedInstanceAlert<T>; warnings: RemappedInstanceAlert<T> } {
  const errorAlerts = alerts.filter(x => x.level === 'ERROR');
  const warningAlerts = alerts.filter(x => x.level === 'WARNING');

  return {
    errors: {
      count: errorAlerts.length,
      alerts: errorAlerts,
    },
    warnings: {
      count: warningAlerts.length,
      alerts: warningAlerts,
    },
  };
}

export function getSummary(entities: Array<{ status: string }>): Summary[] {
  const entitesByStatus = entities.reduce((map, entity) => map.set(entity.status, (map.get(entity.status) ?? 0) + 1), new Map<string, number>());

  const summary: Summary[] = [];

  entitesByStatus.forEach((count, status) => {
    summary.push({
      status,
      count
    });
  });

  return summary;
}
