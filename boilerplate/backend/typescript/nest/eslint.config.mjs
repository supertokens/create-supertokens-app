import tseslint from 'typescript-eslint';

export default [{ ignores: ['dist/'] }, ...tseslint.configs.recommended];
