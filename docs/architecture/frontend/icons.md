# SVG Icons

## UI icons — `Icon` component

Use `components/Icon.tsx` for **app UI icons** (form fields, navigation, actions). These are single-path Material-style icons that inherit color via `currentColor`.

```tsx
import { Icon } from "@/components/Icon";

<Icon name="mail" className="w-5 h-5" />
```

Add new UI icon names to the `IconName` union and `paths` map in `Icon.tsx`.

## Brand and standalone icons — `components/icons/`

Use **`components/icons/`** for icons that do not fit the `Icon` registry:

- **Brand logos** (Google, Apple, etc.) with fixed brand colors or multi-path SVGs
- **One-off icons** that are not part of the shared UI set

Each icon is its own file exporting a named component (e.g. `GoogleIcon`, `AppleIcon`).

```tsx
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { AppleIcon } from "@/components/icons/AppleIcon";

<GoogleIcon className="w-5 h-5" />
```

### Conventions

- **Do not inline `<svg>` markup in pages or feature components.** Extract to `Icon` or `components/icons/`.
- **`className` prop** — optional, defaults to `"w-5 h-5"` so size stays consistent with `Icon`.
- **`aria-hidden="true"`** — set on decorative icons; pair with visible text or an accessible label on the control.
- **File naming** — PascalCase matching the export: `GoogleIcon.tsx` → `GoogleIcon`.

### When to use which

| Use case | Location |
|----------|----------|
| Form, nav, action glyphs (single color) | `components/Icon.tsx` |
| OAuth / social brand marks | `components/icons/` |
| Complex multi-path or fixed-color SVGs | `components/icons/` |

**Why:** Keeps pages readable, avoids duplicated path data, and separates themeable UI icons from brand assets.
