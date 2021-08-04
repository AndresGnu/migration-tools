export { createMigration } from "./schemas/index";
export { defineTable } from "./tables/index";
export { defineFunction } from "./functions";
export { defineType } from "./types";
export declare const getName: (baseName: string) => {
    dir: string;
    file: string;
    schema: string;
};
