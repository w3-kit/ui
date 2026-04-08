# Contributing to @w3-kit/ui

Thanks for your interest in contributing to the w3-kit UI component library!

## How to contribute

1. Fork the repo
2. Create a branch (`git checkout -b my-component`)
3. Make your changes
4. Commit and push
5. Open a pull request

## Adding a component

Components follow the shadcn registry format. Create a new directory in `registry/w3-kit/`:

```
registry/w3-kit/your-component/
├── your-component.tsx
├── your-component-types.ts
├── your-component-utils.ts
└── .learn.md
```

## Local development

```bash
git clone https://github.com/YOUR_USERNAME/ui.git
cd ui
npm install --legacy-peer-deps
```

### Run all CI checks locally

```bash
npm run typecheck && npm run lint && npm run format:check && npm run build
```

## Guidelines

- Follow shadcn conventions
- Components must be accessible (ARIA)
- Include TypeScript types
- Add a `.learn.md` explaining the component
- Keep components composable and customizable

Check [open issues](https://github.com/w3-kit/ui/issues) for ideas.
