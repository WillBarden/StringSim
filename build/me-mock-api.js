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
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var diff_1 = require("./diff");
var MockApi = /** @class */ (function () {
    function MockApi(initialValues, valueEqualityFn, criteriaEqualityFn, isVoidBoolean, isEndDateADate) {
        if (isVoidBoolean === void 0) { isVoidBoolean = true; }
        if (isEndDateADate === void 0) { isEndDateADate = true; }
        this.values = [];
        this.valueEqualityFn = lodash_1.isEqual;
        this.criteriaEqualityFn = function (criteria, record) { return true; };
        this.values = initialValues;
        if (valueEqualityFn) {
            this.valueEqualityFn = valueEqualityFn;
        }
        if (criteriaEqualityFn) {
            this.criteriaEqualityFn = criteriaEqualityFn;
        }
        this.isVoidBoolean = isVoidBoolean;
        this.isEndDateADate = isEndDateADate;
    }
    MockApi.prototype.sync_search = function (searchCriteria) {
        var _this = this;
        if (!searchCriteria) {
            return this.values;
        }
        return this.values.filter(function (value) { return _this.criteriaEqualityFn(searchCriteria, value); });
    };
    MockApi.prototype.search = function (searchCriteria) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this.sync_search(searchCriteria))];
            });
        });
    };
    MockApi.prototype.add = function (newRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (lodash_1.some(this.values, function (value) { return _this.valueEqualityFn(value, newRecord); })) {
                    return [2 /*return*/, Promise.reject('Cannot create a record that already exists')];
                }
                this.values.push(newRecord);
                return [2 /*return*/, Promise.resolve(newRecord)];
            });
        });
    };
    MockApi.prototype.edit = function (editedRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < this.values.length; i++) {
                    if (this.valueEqualityFn(this.values[i], editedRecord)) {
                        this.values[i] = editedRecord;
                        return [2 /*return*/, Promise.resolve(editedRecord)];
                    }
                }
                return [2 /*return*/, Promise.reject('Could not find the requested record to edit')];
            });
        });
    };
    MockApi.prototype.delete = function (deletedRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                for (i = 0; i < this.values.length; i++) {
                    if (this.valueEqualityFn(this.values[i], deletedRecord)) {
                        this.values.splice(i, 1);
                        return [2 /*return*/, Promise.resolve(deletedRecord)];
                    }
                }
                return [2 /*return*/, Promise.reject('Could not find the requested record to delete')];
            });
        });
    };
    MockApi.prototype.getVoidProperty = function (record) {
        return diff_1.mostSimilar(['isVoid', 'void', 'voidFlag'], lodash_1.keys(record));
    };
    MockApi.prototype.void = function (voidedRecord) {
        return __awaiter(this, void 0, void 0, function () {
            var i, voidProperty, voidedRecordNewValue;
            return __generator(this, function (_a) {
                for (i in this.values) {
                    if (this.valueEqualityFn(this.values[i], voidedRecord)) {
                        voidProperty = this.getVoidProperty(this.values[i]);
                        if (!voidProperty) {
                            return [2 /*return*/, Promise.reject('Could not automatically infer the void property of the record')];
                        }
                        voidedRecordNewValue = voidedRecord;
                        if ((lodash_1.isBoolean(voidedRecordNewValue[voidProperty]) && voidedRecordNewValue[voidProperty] === true) ||
                            (lodash_1.isString(voidedRecordNewValue[voidProperty]) && voidedRecordNewValue[voidProperty] === 'Y')) {
                            return [2 /*return*/, Promise.reject('Can not void a record that has already been voided')];
                        }
                        voidedRecordNewValue[voidProperty] = this.isVoidBoolean ? true : 'Y';
                        this.values[i] = voidedRecordNewValue;
                        return [2 /*return*/, Promise.resolve(this.values[i])];
                    }
                }
                return [2 /*return*/, Promise.reject('Could not find the requested record to void')];
            });
        });
    };
    MockApi.prototype.getEndDateProperty = function (record) {
        return diff_1.mostSimilar(['end', 'endDate'], lodash_1.keys(record));
    };
    MockApi.prototype.endDate = function (endDatedRecord, isDate, endDate) {
        if (isDate === void 0) { isDate = true; }
        return __awaiter(this, void 0, void 0, function () {
            var i, endDateProperty, endDatedRecordNewValue;
            return __generator(this, function (_a) {
                if (lodash_1.isNil(endDate)) {
                    // Not done using a default param so that it calculates everytime
                    endDate = new Date();
                }
                for (i in this.values) {
                    if (this.valueEqualityFn(this.values[i], endDatedRecord)) {
                        endDateProperty = this.getEndDateProperty(this.values[i]);
                        if (!endDateProperty) {
                            return [2 /*return*/, Promise.reject('Could not automatically infer the end-date property of the record')];
                        }
                        endDatedRecordNewValue = endDatedRecord;
                        if (!lodash_1.isEmpty(endDatedRecordNewValue[endDateProperty])) {
                            return [2 /*return*/, Promise.reject('Can not end-date a record that has an end-date already')];
                        }
                        endDatedRecordNewValue[endDateProperty] = this.isEndDateADate ?
                            endDate : endDate.getFullYear() + "-" + endDate.getMonth() + "-" + endDate.getDate();
                        this.values[i] = endDatedRecordNewValue;
                        return [2 /*return*/, Promise.resolve(this.values[i])];
                    }
                }
                return [2 /*return*/, Promise.reject('Could not find the requested record to end-date')];
            });
        });
    };
    return MockApi;
}());
exports.MockApi = MockApi;
;
