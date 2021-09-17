import { PLV8 } from "../types";
export { ContextFunction, ContextTriggeFun } from "../types";
export declare const createPlv8: () => PLV8;
export declare const getDefinition: (fileName: string, name: string) => {
    name: string;
    definition: string;
};
