export enum OrderStatus {
  Draft = 'draft',
  WaitApprove = 'waitapprove',
  OrderAvailable = 'orderavailable',
  ServicePrepared = 'serviceprepared',
  OrderCancel = 'ordercancel',
  GoLive = 'golive',
  Close = 'close',
  CloseWithCondition = 'closewithcondition',
}

export enum ContactStatus {
  Select = 'draft',
  WaitApprove = 'waitapprove',
  WaitContact = 'waitcontact',
  Confirm = 'confirm',
  Reject = 'reject',
  Arrival = 'arrival',
  Departure = 'departure',
  DriverReject = 'driver-reject',
}


export const TH_ORDERSTATUS: any = {
    'draft': 'จัดเส้นทาง',
    'waitapprove': 'รอยืนยัน',
    'orderavailable': 'ใบงานพร้อม',
    'serviceprepared': 'เตรียมการบริการ',
    'ordercancel': 'ยกเลิกใบงาน',
    'golive': 'กำลังให้บริการ',
    'close': 'จบบริการ',
    'closewithcondition': 'จบบริการ(ยกเลิก)',
  }


export const TH_CONTACTSTATUS: any = {
    'select': 'เลือก',
    'waitapprove': 'รอยืนยัน',
    'waitcontact': 'รอยืนยัน',
    'confirm': 'ยืนยัน',
    'reject': 'ลูกค้ายกเลิก',
    'arrival': 'ถึงจุดบริการ',
    'departure': 'ออกเดินทาง',
    'driver-reject': 'คนขับรถยกเลิก',
};