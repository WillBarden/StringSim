import { isEqual, some, remove, keys, isString, isBoolean, isNil, isEmpty } from 'lodash';
import { mostSimilar } from './diff';

export class MockApi<RecordType, SearchCriteriaType = object> {

  values: RecordType[] = [];
  valueEqualityFn: (record1: RecordType, record2: RecordType) => boolean
    = isEqual;
  criteriaEqualityFn: (criteria: SearchCriteriaType, record: RecordType) => boolean
    = (criteria: SearchCriteriaType, record: RecordType) => true;
  private isVoidBoolean: boolean;
  private isEndDateADate: boolean;

  constructor(
    initialValues: RecordType[],
    valueEqualityFn?: (record1: RecordType, record2: RecordType) => boolean,
    criteriaEqualityFn?: (criteria: SearchCriteriaType, record: RecordType) => boolean,
    isVoidBoolean: boolean = true,
    isEndDateADate: boolean = true
  ) {
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

  sync_search(searchCriteria?: SearchCriteriaType): RecordType[] {
    if (!searchCriteria) {
      return this.values;
    }
    return this.values.filter(value => this.criteriaEqualityFn(searchCriteria, value));
  }

  async search(searchCriteria?: SearchCriteriaType): Promise<RecordType[]> {
    return Promise.resolve(this.sync_search(searchCriteria));
  }

  async add(newRecord: RecordType): Promise<RecordType> {
    if (some(this.values, (value: RecordType) => this.valueEqualityFn(value, newRecord))) {
      return Promise.reject('Cannot create a record that already exists');
    }
    this.values.push(newRecord);
    return Promise.resolve(newRecord);
  }

  async edit(editedRecord: RecordType): Promise<RecordType> {
    for (let i = 0; i < this.values.length; i++) {
      if (this.valueEqualityFn(this.values[i], editedRecord)) {
        this.values[i] = editedRecord;
        return Promise.resolve(editedRecord);
      }
    }
    return Promise.reject('Could not find the requested record to edit');
  }

  async delete(deletedRecord: RecordType): Promise<RecordType> {
    for (let i = 0; i < this.values.length; i++) {
      if (this.valueEqualityFn(this.values[i], deletedRecord)) {
        this.values.splice(i, 1);
        return Promise.resolve(deletedRecord);
      }
    }
    return Promise.reject('Could not find the requested record to delete');
  }

  getVoidProperty(record: RecordType): string | null {
    return mostSimilar(
      ['isVoid', 'void', 'voidFlag'],
      keys(record)
    );
  }

  async void(voidedRecord: RecordType): Promise<RecordType> {
    for (const i in this.values) {
      if (this.valueEqualityFn(this.values[i], voidedRecord)) {
        const voidProperty = this.getVoidProperty(this.values[i]);
        if (!voidProperty) {
          return Promise.reject('Could not automatically infer the void property of the record');
        }

        const voidedRecordNewValue = voidedRecord as any;
        if (
          (isBoolean(voidedRecordNewValue[voidProperty]) && voidedRecordNewValue[voidProperty] === true) ||
          (isString(voidedRecordNewValue[voidProperty]) && voidedRecordNewValue[voidProperty] === 'Y')
        ) {
          return Promise.reject('Can not void a record that has already been voided');
        }
        voidedRecordNewValue[voidProperty] = this.isVoidBoolean ? true : 'Y';
        this.values[i] = voidedRecordNewValue as RecordType;
        return Promise.resolve(this.values[i]);
      }
    }
    return Promise.reject('Could not find the requested record to void');
  }

  getEndDateProperty(record: RecordType): string | null {
    return mostSimilar(
      ['end', 'endDate'],
      keys(record)
    );
  }

  async endDate(endDatedRecord: RecordType, isDate: boolean = true, endDate?: Date): Promise<RecordType> {
    if (isNil(endDate)) {
      // Not done using a default param so that it calculates everytime
      endDate = new Date();
    }

    for (const i in this.values) {
      if (this.valueEqualityFn(this.values[i], endDatedRecord)) {
        const endDateProperty = this.getEndDateProperty(this.values[i]);
        if (!endDateProperty) {
          return Promise.reject('Could not automatically infer the end-date property of the record');
        }

        const endDatedRecordNewValue = endDatedRecord as any;
        if (!isEmpty(endDatedRecordNewValue[endDateProperty])) {
          return Promise.reject('Can not end-date a record that has an end-date already');
        }
        endDatedRecordNewValue[endDateProperty] = this.isEndDateADate ?
          endDate : `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`;
        this.values[i] = endDatedRecordNewValue as RecordType;
        return Promise.resolve(this.values[i]);
      }
    }
    return Promise.reject('Could not find the requested record to end-date');
  }

};
