## primitive-obsession

Enforce grouping of repeated primitive-type parameters into a single object to improve function signature readability and maintainability.

### Rule Definition

This rule flags functions that declare more than a configurable number of parameters of the same primitive or custom type. Instead of listing too many individual parameters of the same type, it is preferred to bundle them into a single options object or type.

When the number of parameters of a given type exceeds `maxOfSameType`, the rule reports an error. By default, `maxOfSameType` is `2`.

## Usage

Add the rule to your plugin’s configuration. In your flat ESLint configuration file (e.g. `.eslintrc.mjs`), enable the rule or customize the option:

```js
import { defineConfig } from 'eslint-define-config';
import primitiveObsession from 'eslint-plugin-primitive-obsession/rules/primitive-obsession';

export default defineConfig({
  plugins: { 'primitive-obsession': primitiveObsession },
  rules: {
    'primitive-obsession/primitive-obsession': ['error', { maxOfSameType: 2 }],
  },
});
```

### Options

The rule accepts a single options object with the following property:

- `maxOfSameType` (integer, default: `2`) – The maximum allowed number of parameters of the same type. If more parameters of a given type are detected, an error is reported.

### Default Configuration

```json
{
  "rules": {
    "primitive-obsession/primitive-obsession": ["error", { "maxOfSameType": 2 }]
  }
}
```

## Rule Details

This rule examines function declarations, function expressions, arrow functions, and methods. It groups parameters by their annotated type (including primitive types `string`, `number`, `boolean`, union types, custom interface or type aliases, generics, array types, etc.).

- Union types (e.g., `string | number`) are considered a single type unit.
- Generic type parameters (e.g., `<T>`) count as a single type.
- Array types (e.g., `TObj[]`) count as their full annotation string.
- Optional (`b?: string`) and default parameters (`c: number = 5`) are included in the count.
- Rest parameters (e.g., `...args: string[]`) are not counted as multiple individual primitives; the array type is counted once.

If the count for any type exceeds `maxOfSameType`, an error is reported with the message `{type} parameters count {count} exceeds allowed maximum of {max}`.

## Examples

### Valid

```ts
/* Default maxOfSameType = 2 */
function validDefault(a: string, b: string) {
  return a + b;
}

const arrowValid: (x: number, y: number) => number = (x, y) => x + y;

function mixedTypes(a: string, b: string, c: number) {
  return a + b + c;
}

/* Override maxOfSameType to 1: only one of each type allowed */
// In this example, `a: string`, `b: number`, `c: boolean` are each unique
function uniquePrimitives(a: string, b: number, c: boolean) {
  return a + b + c;
}

/* Union types count as single unit */
function unionExample(a: string | number, b: string | number, c: boolean) {
  return c;
}

/* Optional and default parameters included */
function optionalParams(a: string, b?: string, c: number = 5) {
  return a + (b || '') + c;
}

/* Rest parameter array is counted once */
function restParams(...args: string[]) {
  return args.join(',');
}
```

### Invalid

```ts
/* Default maxOfSameType = 2: three strings exceeds allowed maximum */
function tooManyStrings(a: string, b: string, c: string) {}
// Error: "string parameters count 3 exceeds allowed maximum of 2"

/* Three numbers in arrow function */
const tooManyNumbers = (x: number, y: number, z: number) => x + y + z;
// Error: "number parameters count 3 exceeds allowed maximum of 2"

/* Override maxOfSameType to 1: two strings is too many */
function forbiddenDuo(a: string, b: string, c: number) {}
// Error: "string parameters count 2 exceeds allowed maximum of 1"

/* Custom type alias exceeding */
type TUser = { id: number };
function duplicateCustom(a: TUser, b: TUser, c: string) {}
// With { maxOfSameType: 1 }
// Error: "TUser parameters count 2 exceeds allowed maximum of 1"

/* Mixed exceed: three strings and two booleans */
function multiExceed(a: string, b: string, c: string, d: boolean, e: boolean) {}
// Error for strings: "string parameters count 3 exceeds allowed maximum of 2"
// Error for booleans: "boolean parameters count 2 exceeds allowed maximum of 2" — if maxOfSameType is default 2, booleans are okay.

/* Array type counted as TObj[] once per parameter */
function arraysExceed(a: TObj[], b: TObj[], c: TObj[]) {}
// Error: "TObj[] parameters count 3 exceeds allowed maximum of 2"

/* Union count as single unit: three unions exceeds */
function unionExceed(
  a: string | number,
  b: string | number,
  c: string | number,
) {}
// Error: "string | number parameters count 3 exceeds allowed maximum of 2"

/* Generic type exceeding when maxOfSameType = 1 */
function genericExceed<T>(a: T, b: T, c: number) {}
// With { maxOfSameType: 1 }
// Error: "T parameters count 2 exceeds allowed maximum of 1"
```

## Further Reading

- [Avoid Primitive Obsession (Martin Fowler)](https://refactoring.guru/smells/primitive-obsession)
