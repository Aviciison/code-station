interface dictTypeList {
  dictId: number;
  dictName: string;
  dictType: string;
}

export class articleByUserListVo {
  pageNo: number;
  pageSize: number;
  total: number;
  dictTypeList: Array<dictTypeList>;
}
