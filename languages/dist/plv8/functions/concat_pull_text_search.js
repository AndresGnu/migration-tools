"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log(__filename);
const run = ({ ARGS }) => {
    const { texts } = ARGS;
    //@INIT
    const l = texts.map((v) => {
        const n = Number(v);
        return !!n ? `${n} ${v}` : v;
    });
    const text = l.join(' ').toLowerCase();
    return text;
    //@END
};
exports.default = {
    run,
    name: '',
};
