type AlertType = 'WARNING' | 'ERROR';

export interface RemappedInstanceAlert<T> {
  count: number;
  alerts: T[];
}

export function aggregateAlerts<T extends {level: AlertType}>(alerts: Array<T>): {errors: RemappedInstanceAlert<T>; warnings: RemappedInstanceAlert<T>} {
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
