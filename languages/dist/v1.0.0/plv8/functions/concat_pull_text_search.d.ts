import { ContextFunction } from '@redware/migration-plv8';
interface Args {
    texts: string[];
}
declare const _default: {
    name: string;
    definition: string;
    run: ({ ARGS }: ContextFunction<Args>) => string;
};
export default _default;
