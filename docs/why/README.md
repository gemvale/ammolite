[< Back](../README.md)

# Why Ammolite

Ammolite was born from the real-world experience of building modern applications. During the development process, it is often to meet different annoying situations.

## Type Safety

When working with different styling libraries, styling code often lacks strong type guarantees. Errors only show up in the runtime, which feels like writing untyped JavaScript.

```tsx
import type * as React from "react";

// bundle size++, runtime overhead++
import styled from "styled-components";

const StyledButton = (): React.JSX.Element => {
    return <Button />;
};

// not type-safe
const Button = styled.button`
    display: block;
`;
```

Without static validation, mistakes in styling definitions remain undetected until execution.

## Runtime Overhead

Some of the CSS-in-JS libraries provide better type support, but the additional bundle size and runtime work are still a concern.

```tsx
import type * as React from "react";

// bundle size++, runtime overhead++
import styled from "@emotion/styled";

const StyledButton = (): React.JSX.Element => {
    return <Button />;
};

const Button = styled.button({
    display: "block",
});
```

While the API feels convenient, additional JavaScript and runtime computation can accumulate over time.

## Scalability

Scalability matters as applications grow. Not every styling approach scales cleanly across large projects.

Tailwind CSS demonstrates how layouts can scale with zero runtime overhead. However, this reintroduces the earlier situation - limited type safety.

```html
<!-- not type-safe -->
<button class="block"></button>
```

It sacrifices the readability and maintainability of the code with limited type safety.

## The Solution

Ammolite resolves these situations without compromise.

It is designed for scale while preserving type safety and runtime performance. An internal compiler transforms static style functions into class names and extracted CSS. Identical declarations are deduplicated automatically, ensuring efficient output.

```tsx
// index.tsx

import type * as React from "react";

import { style } from "ammolite";

const StyledButton = (): React.JSX.Element => {
    return <button className={button} />;
};

// style declaration
const button: string = style({
    display: "block",
});
```

Compiled output:

```js
// index.js

import { jsx } from "react/jsx-runtime";

const StyledButton = () => {
    return jsx("button", {
        className: button,
    });
};

// final class name
const button = "djcd17uu";
```

```css
/* index.css */

/* declare once, use anywhere */
.djcd17uu {
    display: block;
}
```
