import { merge } from "ammolite";
import { bench } from "vitest";

import {
    mergeValuesLarge,
    mergeValuesNullable,
    mergeValuesSmall,
} from "#/index";

bench("merge-small", (): void => {
    merge(...mergeValuesSmall);
});

bench("merge-nullable", (): void => {
    merge(...mergeValuesNullable);
});

bench("merge-large", (): void => {
    merge(...mergeValuesLarge);
});
