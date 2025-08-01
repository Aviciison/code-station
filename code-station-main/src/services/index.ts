import { dictDataListType } from '@/models/ditc';
import instance from '@/utils/request';

// 上传图片接口
export const uploadImg = async (file: File): Promise<string> => {
  const payLoad = new FormData();
  payLoad.append('file', file);
  return await instance.post('upload/img', payLoad);
};

// 查询字典接口
export const getDictList = async (data: {
  dictType: string;
}): Promise<dictDataListType[]> => {
  return await instance.post('dict/findAllData', data);
};
