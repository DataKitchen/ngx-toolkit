import { aggregateAlerts } from './instance.utilities';

describe('instance.utilities', () => {
  describe('aggregateAlerts()', () => {
    const alerts = [ {level: 'ERROR', message: 'Error 1'}, {level: 'ERROR', message: 'Error 2'}, {level: 'ERROR', message: 'Error 3'}, {level: 'WARNING', message: 'Warning 1'} ] as any;

    it('should count the error alerts', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({errors: expect.objectContaining({count: 3})}));
    });

    it('should add all the error alerts in an array', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({errors: expect.objectContaining({alerts: alerts.filter((a: any) => a.level === 'ERROR')})}));
    });

    it('should count the warning alerts', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({warnings: expect.objectContaining({count: 1})}));
    });

    it('should add all the warning alerts in an array', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({warnings: expect.objectContaining({alerts: alerts.filter((a: any) => a.level === 'WARNING')})}));
    });
  });
});
