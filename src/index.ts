import type { TSESLint } from '@typescript-eslint/utils';
import maxDuplicateParamType from './rules/max-duplicate-param-types';

export const rules: Record<string, TSESLint.RuleModule<string, unknown[]>> = {
  'max-duplicate-param-types': maxDuplicateParamType,
};

export const configs = {
  recommended: {
    rules: {
      'signature-design/max-duplicate-param-types': 'warn',
    },
  },
};
