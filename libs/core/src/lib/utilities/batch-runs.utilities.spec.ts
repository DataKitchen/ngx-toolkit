import { Run, RunProcessedStatus } from '../models/runs.model';
import { getDatasetStatus, mostImportantStatus, runsByComponent } from './batch-runs.utilities';
import { EventType, Schedule, TestStatus } from '../models';

describe('batch-runs.utilities', () => {
  const runs = [
    { status: RunProcessedStatus.Completed, pipeline: { id: '2', name: 'Pipeline B' } },
    { status: RunProcessedStatus.Pending, pipeline: { id: '3', name: 'Pipeline C' } },
    { status: RunProcessedStatus.Running, pipeline: { id: '3', name: 'Pipeline C' } },
    { status: RunProcessedStatus.CompletedWithWarnings, pipeline: { id: '1', name: 'Pipeline A' } },
    { status: RunProcessedStatus.Missing, pipeline: { id: '3', name: 'Pipeline C' } },
    { status: RunProcessedStatus.Failed, pipeline: { id: '1', name: 'Pipeline A' } },
  ] as Run[];

  const tests = [
    { status: TestStatus.Passed },
    { status: TestStatus.Warning },
    { status: TestStatus.Failed },
  ];

  describe('runsByComponent()', () => {
    it('should group the runs by component id', () => {
      expect(runsByComponent(runs)).toEqual({
        1: expect.arrayContaining([ runs[5], runs[3] ]),
        2: expect.arrayContaining([ runs[0] ]),
        3: expect.arrayContaining([ runs[1], runs[2], runs[4] ]),
      });
    });
  });

  describe('mostImportantStatus()', () => {
    it('should default to the initial pending status', () => {
      expect(mostImportantStatus([])).toBe(RunProcessedStatus.Pending);
    });

    it('should default to the provided initial status', () => {
      expect(mostImportantStatus([], RunProcessedStatus.Running)).toBe(RunProcessedStatus.Running);
    });

    it('should give most priority to error status', () => {
      expect(mostImportantStatus(runs)).toBe(RunProcessedStatus.Failed);
    });

    it('should give second priority to missing status', () => {
      expect(mostImportantStatus(runs.slice(0, -1))).toBe(RunProcessedStatus.Missing);
    });

    it('should give third priority to warning status', () => {
      expect(mostImportantStatus(runs.slice(0, -2))).toBe(RunProcessedStatus.CompletedWithWarnings);
    });

    it('should give fourth priority to running status', () => {
      expect(mostImportantStatus(runs.slice(0, -3))).toBe(RunProcessedStatus.Running);
    });

    it('should give fifth priority to pending status', () => {
      expect(mostImportantStatus(runs.slice(0, -4))).toBe(RunProcessedStatus.Pending);
    });

    it('should give least priority to completed status', () => {
      expect(mostImportantStatus(runs.slice(0, -5))).toBe(RunProcessedStatus.Completed);
    });

    it('should give default priority to completed status', () => {
      expect(mostImportantStatus(runs.slice(0, -5))).toBe(RunProcessedStatus.Completed);
    });

    it('should give most priority to failed test', () => {
      expect(mostImportantStatus(tests)).toBe(RunProcessedStatus.Failed);
    });

    it('should give second priority to warning test', () => {
      expect(mostImportantStatus(tests.slice(0, -1))).toBe(RunProcessedStatus.CompletedWithWarnings);
    });

    it('should give least priority to passed status', () => {
      expect(mostImportantStatus(tests.slice(0, -2))).toBe(RunProcessedStatus.Completed);
    });
  });

  describe('getDatasetStatus', () => {
    it('should return Failed if at least one test is Failed', () => {
      const datasetOperationEvents: EventType[] = [
        {
          raw_data: {
            operation: 'WRITE'
          }
        } as EventType
      ];

      const tests: { status: TestStatus }[] = [
        { status: TestStatus.Failed }
      ];

      const schedules: Schedule[] = [];

      expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.Failed);
    });

    it('should return CompletedWithWarnings if at least one test is Warning', () => {
      const datasetOperationEvents: EventType[] = [
        {
          raw_data: {
            operation: 'WRITE'
          }
        } as EventType
      ];

      const tests: { status: TestStatus }[] = [
        { status: TestStatus.Warning }
      ];

      const schedules: Schedule[] = [];

      expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.CompletedWithWarnings);
    });

    describe('if there are no Failed or Warning tests and there is at least one schedule', () => {
      it('should return completed if there is at least one WRITE operation', () => {
        const datasetOperationEvents: EventType[] = [
          {
            raw_data: {
              operation: 'WRITE'
            }
          } as EventType
        ];
        const tests: { status: TestStatus }[] = [ { status: TestStatus.Passed } ];
        const schedules: Schedule[] = [ {} as Schedule ];

        expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.Completed);
      });

      it('should return missing if there are no WRITE operations', () => {
        const datasetOperationEvents: EventType[] = [
          {
            raw_data: {
              operation: 'READ'
            }
          } as EventType
        ];
        const tests: { status: TestStatus }[] = [ { status: TestStatus.Passed } ];
        const schedules: Schedule[] = [ {} as Schedule ];

        expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.Missing);
      });
    });

    describe('if there are no Failed or Warning tests and there are no schedules', () => {
      it('should return completed if there is at least one WRITE operation', () => {
        const datasetOperationEvents: EventType[] = [
          {
            raw_data: {
              operation: 'WRITE'
            }
          } as EventType
        ];
        const tests: { status: TestStatus }[] = [ { status: TestStatus.Passed } ];
        const schedules: Schedule[] = [];

        expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.Completed);
      });

      it('should return pending if there are no WRITE operations', () => {
        const datasetOperationEvents: EventType[] = [
          {
            raw_data: {
              operation: 'READ'
            }
          } as EventType
        ];
        const tests: { status: TestStatus }[] = [ { status: TestStatus.Passed } ];
        const schedules: Schedule[] = [];

        expect(getDatasetStatus(datasetOperationEvents, tests, schedules)).toEqual(RunProcessedStatus.Pending);
      });
    });
  });
});
