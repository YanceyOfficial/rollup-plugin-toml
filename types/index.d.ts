import type { Plugin } from 'rollup';
import type { FilterPattern } from '@rollup/pluginutils';
export interface Options {
    include?: FilterPattern;
    exclude?: FilterPattern;
}
export default function toml(options?: Options): Plugin;
