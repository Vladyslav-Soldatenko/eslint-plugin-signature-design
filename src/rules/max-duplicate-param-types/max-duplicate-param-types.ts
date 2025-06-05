import {
  TSESTree,
  AST_NODE_TYPES,
  ESLintUtils,
} from '@typescript-eslint/utils';

type Options = [{ maxOfSameType?: number }];
type MessageIds = 'tooManyOfSameType';

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/Vladyslav-Soldatenko/eslint-plugin-signature-designn/blob/main/docs/rules/${name}.md`,
);

export default createRule<Options, MessageIds>({
  name: 'max-duplicate-param-types',
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow using too many parameters of the same type in a function signature',
    },
    messages: {
      tooManyOfSameType:
        'Too many parameters of the same type "{{type}}" ({{count}} > {{max}}). It is easy to confuse the order of arguments when they have the same type. Refactor the function signature to accept object.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxOfSameType: {
            type: 'integer',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ maxOfSameType: 2 }],
  create(context, [options]) {
    const maxAllowed = options.maxOfSameType ?? 2;
    const sourceCode = context.sourceCode;

    function getTypeNode(param: TSESTree.Parameter): TSESTree.TypeNode | null {
      switch (param.type) {
        case AST_NODE_TYPES.Identifier:
          return param.typeAnnotation
            ? param.typeAnnotation.typeAnnotation
            : null;

        case AST_NODE_TYPES.AssignmentPattern: {
          const left = param.left;
          if (left.type === AST_NODE_TYPES.Identifier && left.typeAnnotation) {
            return left.typeAnnotation.typeAnnotation;
          }
          return null;
        }

        case AST_NODE_TYPES.RestElement: {
          const arg = param.argument;
          if (arg.type === AST_NODE_TYPES.Identifier && arg.typeAnnotation) {
            return arg.typeAnnotation.typeAnnotation;
          }
          return null;
        }
        default:
          return null;
      }
    }

    function checkFunctionParams(
      node:
        | TSESTree.FunctionDeclaration
        | TSESTree.FunctionExpression
        | TSESTree.ArrowFunctionExpression,
    ): void {
      const counts: Record<string, number> = Object.create(null);

      for (const param of node.params) {
        const tsType = getTypeNode(param);
        if (!tsType) {
          continue;
        }

        const typeText = sourceCode.getText(tsType);

        const prev = counts[typeText] ?? 0;
        const next = prev + 1;
        counts[typeText] = next;

        if (next > maxAllowed) {
          context.report({
            node: tsType,
            messageId: 'tooManyOfSameType',
            data: {
              type: typeText,
              count: next,
              max: maxAllowed,
            },
          });
          counts[typeText] = -Infinity;
        }
      }
    }

    return {
      FunctionDeclaration: checkFunctionParams,
      FunctionExpression: checkFunctionParams,
      ArrowFunctionExpression: checkFunctionParams,
    };
  },
});
