import { ReactNode } from 'react';

// TODO: def Base Type

// when children return to props
export type StrictPropsWithChildren<T = unknown> = T & { children: ReactNode };
