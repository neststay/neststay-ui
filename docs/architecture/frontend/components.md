# UI Components

## Heading

**Always use the `Heading` component** (`components/Heading.tsx`) instead of bare `<h1>`–`<h6>` tags anywhere in the app.

```tsx
import { Heading } from "@/components/Heading";

<Heading level="h1" text="Welcome back" className="font-display-lg text-display-lg" />
```

Props:
- `level` — `"h1"` through `"h6"`, controls the rendered HTML element
- `text` — the heading string
- `className` — optional Tailwind classes for size/weight/color overrides

**Why:** Centralises heading rendering so semantic level and visual style can be changed independently. Bare heading tags bypass this and make global changes harder.
