import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Sử dụng compat.config để tránh lỗi Circular JSON của plugin React
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  eslintConfigPrettier,
];

export default eslintConfig;
