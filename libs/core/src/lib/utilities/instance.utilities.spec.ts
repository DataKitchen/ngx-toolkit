import { aggregateAlerts, testsByComponent } from './instance.utilities';
import { TestOutcomeItem, TestStatus } from '../models';

describe('instance.utilities', () => {
  describe('aggregateAlerts()', () => {
    const alerts = [ { level: 'ERROR', message: 'Error 1' }, { level: 'ERROR', message: 'Error 2' }, {
      level: 'ERROR',
      message: 'Error 3'
    }, { level: 'WARNING', message: 'Warning 1' } ] as any;

    it('should count the error alerts', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({ errors: expect.objectContaining({ count: 3 }) }));
    });

    it('should add all the error alerts in an array', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({ errors: expect.objectContaining({ alerts: alerts.filter((a: any) => a.level === 'ERROR') }) }));
    });

    it('should count the warning alerts', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({ warnings: expect.objectContaining({ count: 1 }) }));
    });

    it('should add all the warning alerts in an array', () => {
      expect(aggregateAlerts(alerts)).toEqual(expect.objectContaining({ warnings: expect.objectContaining({ alerts: alerts.filter((a: any) => a.level === 'WARNING') }) }));
    });
  });

  describe('testByComponents', () => {
    it('should group tests by component', () => {
      const tests: TestOutcomeItem[] = [
        {
          status: TestStatus.Failed,
          component: {
            display_name: 'test',
            id: 'id1'
          },
        } as TestOutcomeItem,
        {
          status: TestStatus.Passed,
          component: {
            display_name: 'test2',
            id: 'id2'
          },
        } as TestOutcomeItem
      ];

      const expected = {
          id1: [
            {
              'component': {
                'display_name': 'test',
                'id': 'id1',
              },
              'status': 'FAILED',
            },
          ],
          id2:
            [
              {
                'component': {
                  'display_name': 'test2',
                  'id': 'id2',
                },
                'status': 'PASSED',
              },
            ]
        }
      ;

      expect(testsByComponent(tests)).toEqual(expected);
    });
  });
});
