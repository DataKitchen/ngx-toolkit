export type LifeCycle = 'OnInit' | 'AfterContentInit' | 'AfterViewInit';
export type FnVoid = () => void;

export type LifeCycleHooks = Record<LifeCycle, { hooked: FnVoid[], done: boolean }>;
