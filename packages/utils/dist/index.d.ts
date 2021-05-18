export { createSchemas } from "./schemas";
export { defineTable, DefineTable, TableObject } from "./tables";
export { defineFunction } from "./functions";
export { defineType } from "./types";
export declare const getName: (baseName: string) => {
    dir: string;
    file: string;
    schema: string;
};
