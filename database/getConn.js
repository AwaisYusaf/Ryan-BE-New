"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
//@ts-ignore
let sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
        }
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('database connection successful');
    }
    catch (error) {
        console.log('database connection failed');
    }
}))();
module.exports = { Sequelize, sequelize };
