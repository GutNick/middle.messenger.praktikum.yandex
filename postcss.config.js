import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import postcssNested from 'postcss-nested';

export default {
  plugins: [
    postcssNested(),
    postcssPresetEnv(),
    autoprefixer(),
  ],
};