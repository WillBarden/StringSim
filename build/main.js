"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var me_mock_api_1 = require("./me-mock-api");
var moment_1 = __importDefault(require("moment"));
var lodash_1 = require("lodash");
;
;
var recordEquality = function (record1, record2) {
    return record1.contractId === record2.contractId &&
        record1.memberId === record2.memberId &&
        record1.efDat === record2.efDat;
};
var searchEquality = function (criteria, record) {
    return record.contractId.includes(criteria.contractId) &&
        (!criteria.memberId || record.memberId.includes(criteria.memberId)) &&
        (!criteria.effectiveDate || moment_1.default(criteria.effectiveDate).isSameOrBefore(moment_1.default(record.efDat)));
};
var initRecord = function (amountPaid, contractId, memberId, efDat, isVioded, vendorId, enDat) { return ({ amountPaid: amountPaid, contractId: contractId, memberId: memberId, efDat: efDat, enDat: enDat, isVioded: isVioded, vendorId: vendorId }); };
var printRes = function (msg, results) {
    if (!results) {
        return function (res) { return printRes(msg, res); };
    }
    console.log(msg + ': ');
    console.log(results);
};
var printNewlines = function (n) { return lodash_1.times(n, function () { return console.log(); }); };
exports.main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var initialValues, api, record, criteria;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                initialValues = [
                    initRecord(0, '678', '01', new Date(2004, 11, 2), false, 'UFR'),
                    initRecord(2, '678', '02', new Date(2008, 3, 2), false, 'UFR', new Date(2014, 4, 5)),
                    initRecord(7.32, '645', '01', new Date(2006, 5, 15), true, 'YXU'),
                    initRecord(4.54, '645', '02', new Date(2006, 2, 15), true, 'YXU'),
                    initRecord(8, '645', '03', new Date(2007, 1, 18), false, 'YXU', new Date(2008, 2, 11)),
                ];
                api = new me_mock_api_1.MockApi(initialValues, recordEquality, searchEquality);
                printRes('All Records', api.sync_search());
                printNewlines(3);
                criteria = {
                    contractId: '645',
                    effectiveDate: new Date(2006, 1, 1)
                };
                printRes('Searching for records with criteria', criteria);
                printRes('Results', api.sync_search(criteria));
                // Create a new record to add and then perform operations on
                record = initRecord(10, '666', '01', new Date(1995, 12, 24), false, 'WFB');
                // This will get the record were mutating when we search for it after operations
                criteria = {
                    contractId: record.contractId,
                    memberId: record.memberId,
                    effectiveDate: record.efDat
                };
                printNewlines(3);
                printRes('Search results for record before it was added', api.sync_search(criteria));
                printRes('Record to add', record);
                return [4 /*yield*/, api.add(record)];
            case 1:
                _a.sent();
                printRes('New record', api.sync_search(criteria));
                printNewlines(3);
                printRes('Record to edit by changing "amountPaid" to 12.00', record);
                return [4 /*yield*/, api.edit(__assign(__assign({}, record), { amountPaid: 12 }))];
            case 2:
                _a.sent();
                printRes('Edited record', api.sync_search(criteria));
                printNewlines(3);
                printRes('Record to void', record);
                return [4 /*yield*/, api.void(record)];
            case 3:
                _a.sent();
                printRes('Voided record', api.sync_search(criteria));
                printNewlines(3);
                printRes('Record to end-date', record);
                return [4 /*yield*/, api.endDate(record)];
            case 4:
                _a.sent();
                printRes('End-dated record', api.sync_search(criteria));
                printNewlines(3);
                printRes('Record to delete', record);
                return [4 /*yield*/, api.delete(record)];
            case 5:
                _a.sent();
                printRes('Deleted record (This should be blank)', api.sync_search(criteria));
                return [2 /*return*/];
        }
    });
}); };
