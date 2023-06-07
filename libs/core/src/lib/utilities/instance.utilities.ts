import { AlertLevel, Run, TestOutcomeItem } from '../models';
import {} from '../models';

export interface RemappedInstanceAlert<T> {
  count: number;
  alerts: T[];
}

interface Summary {
  status: string;
  count: number;
}

interface TestsByComponent {
  [componentId: string]: TestOutcomeItem[];
}

export function aggregateAlerts<T extends { level: AlertLevel }>(alerts: Array<T>): {
  errors: RemappedInstanceAlert<T>;
  warnings: RemappedInstanceAlert<T>
} {
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
  return Array.from(entities.reduce((map, entity) => map.set(entity.status, (map.get(entity.status) ?? 0) + 1), new Map<string, number>()).entries()).map(([ status, count ]) => ({
    status,
    count
  }));
}

export function testsByComponent(tests: TestOutcomeItem[]): TestsByComponent {
  const groups = {} as TestsByComponent;
  const result = tests.reduce((g, test) => {
    if (test.component) {
      if (!g[test.component.id]) {
        g[test.component.id] = [];
      }

      g[test.component.id].push(test);
    }

    return g;
  }, groups);

  return result;
}
