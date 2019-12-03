const mockapi = require('./me-mock-api');

export const main = async () => {
  const api = new mockapi.MockApi(
    [
      { amount: 323.32, isViodFlag: false, contractId: '234724234', memberId: '01', efDate: new Date(2008, 4, 1), enDate: null },
      { amount: 33.32,  isViodFlag: false, contractId: '523423465', memberId: '03', efDate: new Date(2014, 8, 8), enDate: new Date(2016, 4, 4) },
      { amount: 88.32,  isViodFlag: true,  contractId: '234892348', memberId: '02', efDate: new Date(2016, 1, 1), enDate: null },
    ],
    (recordA, recordB) => recordA.contractId + recordA.memberId === recordB.contractId + recordB.memberId,
    (searchCriteria, record) => record.contractId.includes(searchCriteria.contractId) &&
      (!searchCriteria.memberId || record.memberId.includes(searchCriteria.memberId))
  );

  let newRecord = { amount: 0.0,  isViodFlag: false,  contractId: '9087234322', memberId: '02', efDate: new Date(2015, 1, 1), enDate: null };
  await api.create(newRecord).then().catch();
  console.log();
  console.log('creating a new record:');
  await api.search().then(results => console.log(results[3])).catch();



  newRecord.amount = 10.0;
  await api.edit(newRecord).then().catch();
  console.log();
  console.log(`editing the created records amount to be ${ newRecord.amount }:`);
  await api.search().then(results => console.log(results[3])).catch();



  await api.void(newRecord).then().catch();
  console.log();
  console.log('voiding the created record:');
  await api.search().then(results => console.log(results[3])).catch();



  await api.endDate(newRecord).then().catch();
  console.log();
  console.log('end dating the created record:')
  await api.search().then(results => console.log(results[3])).catch();



  console.log();
  console.log('searching for records with a contract ID with "72" in it:');
  await api.search({ contractId: '72' }).then(console.log).catch();
};

