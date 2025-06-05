# eslint-plugin-signature-design

This plugin provides a single ESLint rule designed to reduce the risk of **primitive obsession** and/or enhance maintainability of function signatures in TypeScript code by forbidding functions with too many parameters of the same type and encourages using object-based parameter patterns. Currently constists of only one rule.

---

## Rule: `max-duplicate-param-types`

### Description

This rule ensures that a function does not have more than a configurable number of parameters of the same type. It promotes grouping parameters into objects to avoid primitive obsession, avoid unintentional arguments order confusion and improve code clarity.

For example, the following function would **violate** the rule:

```ts
function confusingFoo(a: string, b: string, c: string) {}
```

An improved version:

```ts
function maintainableFoo(args: { a: string, b: string, c: string }) {}
```

---

### Configuration

You can configure the maximum number of allowed parameters of the same type:

```json
{
  "rules": {
    "signature-design/max-duplicate-param-types": ["error", { "maxOfSameType": 2 }]
  }
}
```

* **`maxOfSameType`** (default: `2`): The maximum number of function parameters allowed to have the same type.

---

### Examples

#### Valid

```ts
// By default, 2 parameters of the same type are allowed
function validExample(a: string, b: string) {}

// Override with maxOfSameType: 1
function uniqueParams(a: string, b: number, c: boolean) {}

// Using objects to group parameters
interface Params { a: string; b: string; }
function groupedParams(args: Params) {}
```

#### Invalid

```ts
// 3 parameters of the same type, default maxOfSameType = 2
function invalidExample(a: string, b: string, c: string) {}

// Override to maxOfSameType = 1
function tooManySameType(a: string, b: string) {}
```

---

### Installation

```bash
npm install eslint-plugin-signature-design --save-dev
```

---

### Usage

With ESLint 9 flat config, add `signatureDesign` to the plugins and configure the rule:

```js
// eslint.config.js
import signatureDesignPlugin from 'eslint-plugin-signature-design';

export default [
  {
    plugins: {
      signatureDesign: signatureDesignPlugin,
    },
    ....
    ....
    rules: {
      'signature-design/max-duplicate-param-types': ["error", { "maxOfSameType": 2 }],
    },
  },
];
```

---

### Contributing

If you'd like to contribute to this plugin (bug reports, feature requests, or pull requests), feel free to open issues and pull requests on [GitHub](https://github.com/Vladyslav-Soldatenko/eslint-plugin-signature-design).

---

### License

This project is licensed under the MIT License. Feel free to use it wherever you want.
