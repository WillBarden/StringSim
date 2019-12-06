import { isEqual, some, keys, every } from 'lodash';
import { mostSimilar } from './diff';

export class MockApi<RecordType, SearchCriteriaType = object> {

  values: RecordType[] = [];
  valueEqualityFn: (record1: RecordType, record2: RecordType) => boolean
    = isEqual;
  criteriaEqualityFn: (criteria: SearchCriteriaType, record: RecordType) => boolean
    = (criteria: SearchCriteriaType, record: RecordType) => true;

  constructor(
    initialValues: RecordType[],
    valueEqualityFn?: (record1: RecordType, record2: RecordType) => boolean,
    criteriaEqualityFn?: (criteria: SearchCriteriaType, record: RecordType) => boolean
  ) {
    this.values = initialValues;
    if (valueEqualityFn) {
      this.valueEqualityFn = valueEqualityFn;
    }
    if (criteriaEqualityFn) {
      this.criteriaEqualityFn = criteriaEqualityFn;
    }
  }

  async getAllRecords(): Promise<RecordType[]> {
    return Promise.resolve(this.values);
  }

  async searchRecords(searchCriteria?: SearchCriteriaType): Promise<RecordType[]> {
    if (!searchCriteria) {
      return this.getAllRecords();
    }
    return Promise.resolve(
      this.values.filter(value => this.criteriaEqualityFn(searchCriteria, value))
    );
  }

  async createRecord(newRecord: RecordType): Promise<RecordType> {
    if (some(this.values, (value: RecordType) => this.valueEqualityFn(value, newRecord))) {
      return Promise.reject('Cannot create a record that already exists');
    }
    this.values.push(newRecord);
    return Promise.resolve(newRecord);
  }

  async editRecord(editedRecord: RecordType): Promise<RecordType> {
    for (const i in this.values) {
      if (this.valueEqualityFn(this.values[i], editedRecord)) {
        this.values[i] = editedRecord;
        return Promise.resolve(editedRecord);
      }
    }
    return Promise.reject('Could not find the requested record to edit');
  }

  getVoidProperty(record: RecordType): string | null {
    return mostSimilar(
      ['isVoid', 'void', 'voidFlag'],
      Object.keys(record)
    );
  }

  async voidRecord(voidedRecord: RecordType): Promise<RecordType> {
    for (const i in this.values) {
      if (this.valueEqualityFn(this.values[i], voidedRecord)) {
        const voidProperty = this.getVoidProperty(this.values[i]);
        if (!voidProperty) {
          return Promise.reject('Could not automatically infer the void property of the record');
        }

        const voidedRecordNewValue = voidedRecord as any;
        voidedRecordNewValue[voidProperty] = true;
        this.values[i] = voidedRecordNewValue as RecordType;
        return Promise.resolve(this.values[i]);
      }
    }
    return Promise.reject('Could not find the requested record to void');
  }

  getEndDateProperty(record: RecordType): string | null {
    return mostSimilar(
      ['end', 'endDate'],
      Object.keys(record)
    );
  }

  async endDateRecord(endDatedRecord: RecordType): Promise<RecordType> {
    for (const i in this.values) {
      if (this.valueEqualityFn(this.values[i], endDatedRecord)) {
        const endDateProperty = this.getVoidProperty(this.values[i]);
        if (!endDateProperty) {
          return Promise.reject('Could not automatically infer the end-date property of the record');
        }

        const endDatedRecordNewValue = endDatedRecord as any;
        endDatedRecordNewValue[endDateProperty] = true;
        this.values[i] = endDatedRecordNewValue as RecordType;
        return Promise.resolve(this.values[i]);
      }
    }
    return Promise.reject('Could not find the requested record to end-date');
  }

};
