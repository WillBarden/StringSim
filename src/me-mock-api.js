const { mostSimilar, leastSimilar } = require('./diff');

function MockApi(initValues, valueEqualityFn, searchEqualityFn = null) {
  this.allValues = initValues;
  this.eqFunc = valueEqualityFn;
  this.searchEqFunc = searchEqualityFn;
  this.search = searchRecords;
  this.create = createRecord;
  this.edit = editRecord;
  this.void = voidRecord;
  this.endDate = endDateRecord;
}

async function searchRecords(criteria) {
  if (!criteria) {
    return Promise.resolve(this.allValues);
  }
  return Promise.resolve(this.allValues.filter(
    value => this.searchEqFunc(criteria, value)
  ));
}

async function createRecord(record) {
  const correspondingRecord = this.allValues.find(
    value => this.eqFunc(value, record)
  );
  if (correspondingRecord) {
    return Promise.reject('Cannot create a record that already exists!');
  }
  this.allValues.push(record);
  return Promise.resolve(record);
}

async function editRecord(record) {
  for (let existingRecordIndex in this.allValues) {
    if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
      this.allValues[existingRecordIndex] = record;
      return Promise.resolve(this.allValues[existingRecordIndex]);
    }
  }
  return Promise.reject('Could not find the specified record to edit!');
}

function getVoidProperty(record) {
  return mostSimilar(
    ['isVoid', 'void', 'voidFlag'],
    Object.keys(record)
  );
}

async function voidRecord(record) {
  for (let existingRecordIndex in this.allValues) {
    if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
      this.allValues[existingRecordIndex] = record;
      const voidProp = getVoidProperty(this.allValues[existingRecordIndex]);
      this.allValues[existingRecordIndex][voidProp] = true;
      return Promise.resolve(this.allValues[existingRecordIndex]);
    }
  }
  return Promise.reject('Could not find the specified record to void!');
}

function getEndDateProperty(record) {
  return mostSimilar(
    ['end', 'endDate'],
    Object.keys(record)
  );
}

async function endDateRecord(record) {
  for (let existingRecordIndex in this.allValues) {
    if (this.eqFunc(this.allValues[existingRecordIndex], record)) {
      this.allValues[existingRecordIndex] = record;
      const endDateProp = getEndDateProperty(this.allValues[existingRecordIndex]);
      this.allValues[existingRecordIndex][endDateProp] = new Date();
      return Promise.resolve(this.allValues[existingRecordIndex]);
    }
  }
  return Promise.reject('Could not find the specified record to end-date!');
}

module.exports = { MockApi }
