[< Back](../README.md)

# `style` Function

This function will create a style.

```ts
import { style } from "ammolite";

const container: string = style({
    display: "block",
});
```

For creating a style for specific conditions:

```ts
import { style } from "ammolite";

const containerMobile: string = style({
    display: "block",
    "@media (min-width: 600px)": {
        display: "none",
    },
});

const containerDesktop: string = style({
    display: "none",
    "@media (min-width: 600px)": {
        display: "block",
    },
});
```

It is possible to create a style with fallback values by using an array:

```ts
import { style } from "ammolite";

const container: string = style({
    display: ["flex", "grid"],
});
```

For using the style in pure JavaScript/TypeScript:

```ts
const el: HTMLDivElement = document.createElement("div");

el.className = container;

document.body.append(el);
```

For using the style in React:

```tsx
import * as React from "react";

const Component = (): React.JSX.Element => {
    return <div className={container} />;
}
```
