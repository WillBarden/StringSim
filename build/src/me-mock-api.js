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
var _a = require('./diff'), mostSimilar = _a.mostSimilar, leastSimilar = _a.leastSimilar;
function MockApi(initValues, valueEqualityFn, searchEqualityFn) {
    if (searchEqualityFn === void 0) { searchEqualityFn = null; }
    this.allValues = initValues;
    this.eqFunc = valueEqualityFn;
    this.searchEqFunc = searchEqualityFn;
    this.search = searchRecords;
    this.create = createRecord;
    this.edit = editRecord;
    this.void = voidRecord;
    this.endDate = endDateRecord;
}
function searchRecords(criteria) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!criteria) {
                return [2 /*return*/, Promise.resolve(this.allValues)];
            }
            return [2 /*return*/, Promise.resolve(this.allValues.filter(function (value) { return _this.searchEqFunc(criteria, value); }))];
        });
    });
}
function createRecord(record) {
    return __awaiter(this, void 0, void 0, function () {
        var correspondingRecord;
        var _this = this;
        return __generator(this, function (_a) {
            correspondingRecord = this.allValues.find(function (value) { return _this.eqFunc(value, record); });
            if (correspondingRecord) {
                return [2 /*return*/, Promise.reject('Cannot create a record that already exists!')];
            }
            this.allValues.push(record);
            return [2 /*return*/, Promise.resolve(record)];
        });
    });
}
function editRecord(record) {
    return __awaiter(this, void 0, void 0, function () {
        var existingRecordIndex;
        return __generator(this, function (_a) {
            for (existingRecordIndex in this.allValues) {
                if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
                    this.allValues[existingRecordIndex] = record;
                    return [2 /*return*/, Promise.resolve(this.allValues[existingRecordIndex])];
                }
            }
            return [2 /*return*/, Promise.reject('Could not find the specified record to edit!')];
        });
    });
}
function getVoidProperty(record) {
    return mostSimilar(['isVoid', 'void', 'voidFlag'], Object.keys(record));
}
function voidRecord(record) {
    return __awaiter(this, void 0, void 0, function () {
        var existingRecordIndex, voidProp;
        return __generator(this, function (_a) {
            for (existingRecordIndex in this.allValues) {
                if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
                    this.allValues[existingRecordIndex] = record;
                    voidProp = getVoidProperty(this.allValues[existingRecordIndex]);
                    this.allValues[existingRecordIndex][voidProp] = true;
                    return [2 /*return*/, Promise.resolve(this.allValues[existingRecordIndex])];
                }
            }
            return [2 /*return*/, Promise.reject('Could not find the specified record to void!')];
        });
    });
}
function getEndDateProperty(record) {
    return mostSimilar(['end', 'endDate'], Object.keys(record));
}
function endDateRecord(record) {
    return __awaiter(this, void 0, void 0, function () {
        var existingRecordIndex, endDateProp;
        return __generator(this, function (_a) {
            for (existingRecordIndex in this.allValues) {
                if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
                    this.allValues[existingRecordIndex] = record;
                    endDateProp = getEndDateProperty(this.allValues[existingRecordIndex]);
                    this.allValues[existingRecordIndex][endDateProp] = new Date();
                    return [2 /*return*/, Promise.resolve(this.allValues[existingRecordIndex])];
                }
            }
            return [2 /*return*/, Promise.reject('Could not find the specified record to end-date!')];
        });
    });
}
module.exports = { MockApi: MockApi };
