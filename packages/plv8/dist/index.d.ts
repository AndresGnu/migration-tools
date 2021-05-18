import { PLV8 } from "../types/index";
export { ContextFunction, ContextTriggeFun } from "../types/index";
export declare const createPlv8: () => PLV8;
export declare const getDefinition: (fileName: string) => {
    name: string;
    definition: string;
};
