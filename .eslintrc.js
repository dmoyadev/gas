module.exports = {
    root: true, // Indicates that this ESLint configuration applies at the root of the project.

    env: {
        node: true, // Specifies the Node.js environment for linting.
    },

    extends: [
        'plugin:vue/vue3-recommended', // Extends Vue.js recommended rules.
        '@vue/standard', // Extends standard ESLint rules with Vue.js-specific rules.
        '@vue/typescript/recommended', // Extends TypeScript-specific rules for Vue.js.
    ],

    parserOptions: { parser: '@typescript-eslint/parser' }, // Specifies the TypeScript parser for ESLint.

    rules: {
        // Rules for code quality and style:
        '@typescript-eslint/ban-ts-comment': 'off', // Disable TypeScript-specific comment rule.
        '@typescript-eslint/no-explicit-any': 'off', // Disable explicit 'any' type rule in TypeScript.
        'no-console': 'off', // Allows console statements (console.log(), console.warn(), etc.).
        'no-debugger': 'warn', // Warn about 'debugger' statements.
        'no-alert': 'warn', // Warn about 'alert' statements.
        'no-irregular-whitespace': 'warn', // Warn about irregular whitespace.
        'no-constant-condition': 'warn', // Warn about constant conditions.
        'no-empty': 'warn', // Warn about empty blocks.
        'no-multiple-empty-lines': 'warn', // Warn about multiple consecutive empty lines.

        // Rules for code quality and style (Vue):
        'vue/no-v-html': 'off', // Disable 'v-html' usage rule in Vue.js templates.
        'vue/no-deprecated-slot-attribute': 'off', // Disable deprecated slot attribute rule.
        'vue/no-v-text-v-html-on-component': 'off', // Disable 'v-text' and 'v-html' on components.
        'vue/script-setup-uses-vars': 'error', // Enforce variable usage in '<script setup>' in Vue.js.

        // Rules for code formatting:
        'no-tabs': 'off', // Allow tabs for indentation.
        'indent': [ 'warn', 'tab', { 'SwitchCase': 1 } ], // Indentation rules.
        'vue/html-indent': [ 'warn', 'tab', {
            'attribute': 1, // Indentation level for attributes.
            'baseIndent': 1, // Base indentation level.
        } ],
        'quotes': [ 'warn', 'single' ], // Enforce single quotes.
        'semi': [ 'error', 'always' ], // Require semicolons at the end of statements.
        'comma-dangle': [ 'warn', 'always-multiline' ], // Require trailing commas in multiline objects and arrays.
        'arrow-spacing': 'warn', // Enforce spacing around arrow functions.
        'curly': [ 'warn', 'multi-line' ], // Enforce curly braces for multiline blocks.
        'object-curly-newline': [ 'warn', {
            'ObjectExpression': {
                'multiline': true, // Enforce multiline object literals.
                'minProperties': 2, // Minimum number of properties for multiline.
            },
        } ],
        'object-property-newline': 'warn', // Enforce newline after object properties.
        'object-curly-spacing': [ 'warn', 'always' ], // Enforce spacing around object literals.
        'array-bracket-spacing': [ 'warn', 'always', { 'singleValue': false } ], // Enforce spacing around array brackets.
        'comma-spacing': [ 'warn', {
            'before': false, // No space before commas.
            'after': true, // Space after commas.
        } ],
        'comma-style': [ 'warn', 'last' ], // Requires a comma after and on the same line as an element.
        'arrow-parens': [ 'warn', 'always' ], // Enforce parentheses around parameters in arrow functions.
    },

    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
                '**cy.{j,t}s?(x)',
                '**test.{j,t}s?(x)',
            ],

            env: { jest: true }, // Set the environment to Jest for testing files.
            rules: { 'sonarjs/no-duplicate-string': 'off' }, // Turn off a specific rule for testing files.
        },
    ],
};
