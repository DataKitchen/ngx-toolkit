export type LifeCycle = 'OnInit' | 'AfterContentInit' | 'AfterViewInit';
export type FnVoid = () => void;

export type LifeCycleHoos = Record<LifeCycle, { hooked: FnVoid[], done: boolean }>;
