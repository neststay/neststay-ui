# Forms

## Standalone form components

Every form must be its own self-contained component in `components/`. The component owns its fields, validation, and submit logic — the page only renders `<LoginForm />` or similar, with no form state leaking upward.

```tsx
// Good — page is layout only
export default function Page() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}

// Bad — form state managed on the page
export default function Page() {
  const [email, setEmail] = useState("");
  return <input value={email} onChange={…} />;
}
```

**Why:** Self-contained form components can be dropped into any route or modal without rewiring state. It also keeps pages as pure layout shells.

## Implementation

Use Formik for all forms (already a project dependency). Follow the pattern in `components/LoginForm.tsx`:
- `"use client"` directive at the top
- `validate` function for field-level validation
- `<Field>` + `<ErrorMessage>` for each input
- Error state reflected via conditional Tailwind classes on the input (`border-error ring-error`)
