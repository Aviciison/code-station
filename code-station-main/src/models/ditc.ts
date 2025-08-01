import { getDictList } from '@/services';
import { useState } from 'react';

export type dictDataListType = {
  dictCode: number;
  label: string;
  value: string;
};

type dictDataType = {
  [key: string]: dictDataListType[];
};

export default function Page() {
  const [dictData, setDictData] = useState<dictDataType>({});

  const getDictData = async (payload: string) => {
    try {
      const res = await getDictList({ dictType: payload });
      setDictData((oldData) => {
        oldData[payload] = res;
        return {
          ...oldData,
        };
      });
    } catch (e) {
      console.log(e);
    }
  };

  return { dictData, getDictData };
}
