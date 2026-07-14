"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    type: 'better-sqlite3',
    database: '.db/sql',
    synchronize: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
};
//# sourceMappingURL=ormconfig.js.map