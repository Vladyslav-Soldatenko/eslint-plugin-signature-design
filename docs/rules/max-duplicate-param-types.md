## Rule: max-duplicate-param-types

This ESLint rule prevents primitive obsession and excessive repetition of parameters with the same type in function and method signatures.
It aims to encourage better code maintainability by grouping related parameters into a single object when the same type appears too often.

### Rule Details

This rule disallows using more than a configurable number (`maxOfSameType`) of parameters with the same type.

For example, the following code is considered **invalid** if the default maximum of two is exceeded:

```ts
function tooManyStrings(a: string, b: string, c: string) {} // ❌
```

Instead, consider grouping the parameters:

```ts
function betterSignature(args: { a: string; b: string; c: string }) {}
```

### Options

```json
{
  "maxOfSameType": 2 // default: 2
}
```

* `maxOfSameType` (**number**, default `2`): the maximum number of parameters allowed for any single type.

### Examples

#### Default Configuration (`maxOfSameType: 2`)

✅ **Valid:**

```ts
function validDefault(a: string, b: string) {}

function mixedTypes(a: string, b: number, c: boolean) {}

const arrowValid = (x: number, y: number) => x + y;

function singleCustomType(a: MyType, b: number, c: boolean) {}

function restParams(...args: string[]) {}
```

❌ **Invalid:**

```ts
function tooManyStrings(a: string, b: string, c: string) {} // ❌ 3 strings, max is 2

const tooManyNumbers = (x: number, y: number, z: number) => x + y + z;
```

#### Custom Configuration (`maxOfSameType: 1`)

✅ **Valid:**

```ts
function uniquePrimitives(a: string, b: number, c: boolean) {}

interface TUser { name: string; }
function singleCustom(a: TUser, b: string, c: number) {}
```

❌ **Invalid:**

```ts
function forbiddenDuo(a: string, b: string, c: number) {} // ❌ 2 strings, max is 1

interface TUser { name: string; }
function duplicateCustom(a: TUser, b: TUser, c: number) {}
```

### Notes

* Union types (e.g., `string | number`) are treated as a single type.
* Arrays and generics count based on their apparent type signature.
* Optional and default parameters are included in the count.

### When Not to Use

This rule is optional and intended for projects that want to enforce consistency and discourage function parameters with the same type.


### Resources
* [Primitive Obsession in Software Design](https://refactoring.guru/smells/primitive-obsession)
