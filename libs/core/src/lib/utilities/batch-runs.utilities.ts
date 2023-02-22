import { Run, RunProcessedStatus } from '../models/runs.model';

interface RunsByComponent {
  [componentId: string]: Run[];
}

export function runsByComponent(runs: Run[]): RunsByComponent {
  const groups = {} as RunsByComponent;
  const result = runs.reduce((g, run) => {
    if (!g[run.pipeline.id]) {
      g[run.pipeline.id] = [];
    }
    g[run.pipeline.id].push(run);
    return g;
  }, groups);

  return result;
}

export function mostImportantStatus(runs: Run[], initial: RunProcessedStatus = RunProcessedStatus.Pending): RunProcessedStatus {
  return runs.map((run) => run.status).sort((a, b) => statusWeight[b] - statusWeight[a])[0] ?? initial;
}

const statusWeight: {[status in RunProcessedStatus]: number} = {
  [RunProcessedStatus.Failed]: 6,
  [RunProcessedStatus.Missing]: 5,
  [RunProcessedStatus.CompletedWithWarnings]: 4,
  [RunProcessedStatus.Running]: 3,
  [RunProcessedStatus.Pending]: 2,
  [RunProcessedStatus.Completed]: 1,
};
