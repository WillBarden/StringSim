import { MockApi } from './me-mock-api';
import moment from 'moment';
import { times } from 'lodash';

interface Record {
  amountPaid: number;
  contractId: string;
  memberId: string;
  efDat: Date;
  enDat?: Date;
  isVioded: boolean;
  vendorId: string;
};

interface SearchCriteria {
  contractId: string;
  memberId?: string;
  effectiveDate?: Date;
};







const initRecord = (
  amountPaid: number, contractId: string, memberId: string, efDat: Date, isVioded: boolean, vendorId: string, enDat?: Date
): Record => (
  { amountPaid, contractId, memberId, efDat, enDat, isVioded, vendorId }
);

const printRes = (msg: string, results: object | object[]) => {
  if (!results) {
    return (res: object[]) => printRes(msg, res);
  }
  console.log(msg + ': ');
  console.log(results);
}

const printNewlines = (n: number) => times(n, () => console.log());


export const main = async () => {














  // Setting up the mock API
  const initialValues: Record[] = [
    initRecord(0, '678', '01', new Date(2004, 11, 2), false, 'UFR'),
    initRecord(2, '678', '02', new Date(2008, 3, 2), false, 'UFR', new Date(2014, 4, 5)),

    initRecord(7.32, '645', '01', new Date(2006, 5, 15), true, 'YXU'),
    initRecord(4.54, '645', '02', new Date(2006, 2, 15), true, 'YXU'),
    initRecord(8, '645', '03', new Date(2007, 1, 18), false, 'YXU', new Date(2008, 2, 11)),
  ];
  const recordEquality = (record1: Record, record2: Record): boolean => {
    return record1.contractId === record2.contractId &&
      record1.memberId === record2.memberId &&
      record1.efDat === record2.efDat;
  };

  const searchEquality = (criteria: SearchCriteria, record: Record): boolean => {
    return record.contractId.includes(criteria.contractId) &&
      (!criteria.memberId || record.memberId.includes(criteria.memberId)) &&
      (!criteria.effectiveDate || moment(criteria.effectiveDate).isSameOrBefore(moment(record.efDat)))
  };

  const api = new MockApi<Record, SearchCriteria>(initialValues, recordEquality, searchEquality);
  printRes('All Records', api.sync_search());









  // Some mock operations
  let record: Record;
  let criteria: SearchCriteria;

  printNewlines(3);
  criteria = {
    contractId: '645',
    effectiveDate: new Date(2006, 1, 1)
  };
  printRes('Searching for records with criteria', criteria);
  printRes('Results', api.sync_search(criteria));

  // Create a new record to add and then perform operations on
  record = initRecord(10, '666', '01', new Date(1995, 12, 24), false, 'WFB')
  // This will get the record were mutating when we search for it after operations
  criteria = {
    contractId: record.contractId,
    memberId: record.memberId,
    effectiveDate: record.efDat
  };






  printNewlines(3);
  printRes('Search results for record before it was added', api.sync_search(criteria));
  printRes('Record to add', record);
  await api.add(record);
  printRes('New record', api.sync_search(criteria));








  printNewlines(3);
  printRes('Record to edit by changing "amountPaid" to 12.00', record);
  await api.edit({ ...record, amountPaid: 12});
  printRes('Edited record', api.sync_search(criteria));





  printNewlines(3);
  printRes('Record to void', record);
  await api.void(record);
  printRes('Voided record', api.sync_search(criteria));






  printNewlines(3);
  printRes('Record to end-date', record);
  await api.endDate(record);
  printRes('End-dated record', api.sync_search(criteria));









  printNewlines(3);
  printRes('Record to delete', record);
  await api.delete(record);
  printRes('Deleted record (This should be blank)', api.sync_search(criteria));
};
