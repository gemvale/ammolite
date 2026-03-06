import type * as React from "react";

import "./index.css";

export default ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>): React.JSX.Element => {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
};
