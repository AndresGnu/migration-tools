"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefinition = exports.createPlv8 = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const useExecute = (state) => (sql, args) => {
    if (sql.includes('DELETE')) {
        return 0;
    }
    else {
        const data = state.datas[state.index];
        state.index += 1;
        return data;
    }
};
const find_function = (state) => (name) => (...params) => {
    if (state.functions[name]) {
        const data = state.functions[name]();
        // state.index += 1;
        return data;
    }
    else {
        throw new Error('No data return');
    }
};
const elog = (level, ...msg) => {
    console.log(msg);
};
const prepare = (state) => (sql, typenames) => {
    const _execute = (args) => {
        useExecute(state)(sql, args);
    };
    const cursor = (args) => {
        return {
            fetch: (nrows) => {
                return {};
            },
            move: (nrows) => {
                return {};
            },
            close: () => {
                //
            },
        };
    };
    return {
        execute: _execute,
        free: () => {
            //
        },
        cursor,
    };
};
const subtransaction = (callback) => {
    //
};
const createPlv8 = () => {
    const state = {
        functions: {},
        index: 0,
        datas: [],
    };
    return {
        execute: useExecute(state),
        prepare: prepare(state),
        find_function: find_function(state),
        elog,
        subtransaction,
        $data: (data) => {
            state.datas.push(data);
        },
        $function: (name, data) => {
            //
            state.functions[name] = () => data;
        },
    };
};
exports.createPlv8 = createPlv8;
const getDefinition = (fileName) => {
    const file = fs_1.default.readFileSync(fileName, 'utf8');
    const re = /@INIT([^@]+)?@/g;
    const match = re.exec(file);
    // return match[1].trim();
    if (!match)
        throw new Error(`Incorrect definition: ${fileName}`);
    return {
        name: path_1.default.basename(fileName).replace(/(\.js|\.ts)/g, ''),
        definition: match[1].trim(),
    };
};
exports.getDefinition = getDefinition;
