import { RuleTester } from '@typescript-eslint/rule-tester';
import tsParser from '@typescript-eslint/parser';
import rule from './max-duplicate-param-types';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
});

ruleTester.run('max-duplicate-param-types', rule, {
  valid: [
    // Default maxOfSameType = 2: two primitives of same type is allowed
    {
      code: `
        function validDefault(a: string, b: string) {
          return a + b;
        }
      `,
    },
    {
      code: `
        const arrowValidDefault = (x: number, y: number) => x + y;
      `,
    },
    // Default maxOfSameType = 2: mix of types below threshold
    {
      code: `
        function mixedTypes(a: string, b: string, c: number) {
          return a + b + c;
        }
      `,
    },
    // Override maxOfSameType to 1: only one primitive of each type allowed
    {
      code: `
        function uniquePrimitives(a: string, b: number, c: boolean) {
          return a + b + c;
        }
      `,
      options: [{ maxOfSameType: 1 }],
    },
    // Complex: non-primitives count separately; default treats type references same as primitives
    {
      code: `
        interface TUser { name: string; }
        function customTypes(a: TUser, b: TUser, c: number) {
          return c;
        }
      `,
      // default maxOfSameType=2: two TUser is OK since it counts as "non-primitive" type grouping
    },
    // Override maxOfSameType to 1: two TUser should trigger error; avoid here by using only one TUser
    {
      code: `
        interface TUser { name: string; }
        function singleCustom(a: TUser, b: string, c: number) {
          return b + c;
        }
      `,
      options: [{ maxOfSameType: 1 }],
    },
    // Parameters with union types: treat entire union as a single type
    {
      code: `
        function unionTypes(a: string | number, b: string | number, c: boolean) {
          return c;
        }
      `,
      // default maxOfSameType=2: two union params OK
    },
    // Optional and defaulted parameters
    {
      code: `
        function optionalParams(a: string, b?: string, c: number = 5) {
          return a + (b || '') + c;
        }
      `,
      // default maxOfSameType=2: two string (one optional) is OK
    },
    // Rest parameters
    {
      code: `
        function restParams(...args: string[]) {
          return args.join(',');
        }
      `,
      // Arrays of primitives are not counted individually for this rule
    },
  ],

  invalid: [
    // Exceed default maxOfSameType = 2: three strings
    {
      code: `
        function tooManyStrings(a: string, b: string, c: string) {}
      `,
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'string', count: 3, max: 2 },
        },
      ],
    },
    {
      code: `
        function optionalParams(a?: string, b?: string, c: number = 5) {
          return a + (b || '') + c;
        }
      `,
      options: [{ maxOfSameType: 1 }],
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'string', count: 2, max: 1 },
        },
      ],
    },
    // Exceed default maxOfSameType = 2: three numbers in arrow function
    {
      code: `
        const tooManyNumbers = (x: number, y: number, z: number) => x + y + z;
      `,
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'number', count: 3, max: 2 },
        },
      ],
    },
    // Override maxOfSameType to 1: two strings is too many
    {
      code: `
        function forbiddenDuo(a: string, b: string, c: number) {}
      `,
      options: [{ maxOfSameType: 1 }],
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'string', count: 2, max: 1 },
        },
      ],
    },
    // Custom types exceeding maxOfSameType
    {
      code: `
        type TUser = { id: number };
        function duplicateCustom(a: TUser, b: TUser, c: string) {}
      `,
      options: [{ maxOfSameType: 1 }],
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'TUser', count: 2, max: 1 },
        },
      ],
    },
    // Corrected: three strings and two booleans
    {
      code: `
        function multiExceed(a: string, b: string, c: string, d: boolean, e: boolean) {}
      `,
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'string', count: 3, max: 2 },
        },
      ],
    },
    {
      code: `
        function arraysExceed(a: TObj[], b: TObj[], c: TObj[]) {}
      `,
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'TObj[]', count: 3, max: 2 },
        },
      ],
    },
    // Union type splitting: if unions counted per constituent type, but our implementation counts union as single type
    {
      code: `
        function unionExceed(a: string | number, b: string | number, c: string | number) {}
      `,
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'string | number', count: 3, max: 2 },
        },
      ],
    },
    // Generic types exceeding
    {
      code: `
        function genericExceed<T>(a: T, b: T, c: number) {}
      `,
      options: [{ maxOfSameType: 1 }],
      errors: [
        {
          messageId: 'tooManyOfSameType',
          data: { type: 'T', count: 2, max: 1 },
        },
      ],
    },
  ],
});
