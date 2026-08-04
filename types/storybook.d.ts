// Minimal ambient types for `@storybook/react` so CSF3 stories in this repo
// typecheck without taking a hard dependency on `@storybook/react` (which is
// only relevant at Storybook time, not for the registry consumers).
//
// When a consumer installs Storybook, drop this file in favour of the real
// `@storybook/react` types.

declare module "@storybook/react" {
  export type Meta<T = unknown> = {
    title?: string;
    component?: T;
    parameters?: Record<string, unknown>;
    args?: Record<string, unknown>;
  };
  export type StoryObj<T = unknown> = {
    name?: string;
    args?: Partial<T>;
    render?: (args: T) => unknown;
  };
}
