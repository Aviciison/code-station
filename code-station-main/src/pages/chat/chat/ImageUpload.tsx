import { uploadImg } from '@/services';
import { InboxOutlined } from '@ant-design/icons';
import { GetProp, message, UploadProps } from 'antd';
import Dragger, { DraggerProps } from 'antd/es/upload/Dragger';
import { AxiosError } from 'axios';

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  type: 'image' | 'file';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-function-type
let onChange: Function;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const props: DraggerProps = {
  beforeUpload: (file: FileType) => {
    const r = new FileReader();
    r.readAsDataURL(file);
    r.onload = async (res) => {
      console.log(res, 'res');
      // setLoading(true);
      console.log(file);

      try {
        const result = await uploadImg(file);
        console.log(result);
        message.success('上传成功');
        onChange(result);
      } catch (e) {
        message.error(
          (e as AxiosError<{ message: string }>).response?.data?.message ||
            '系统繁忙，请稍后再试',
        );
      } finally {
        // setLoading(false);
      }
    };
    return false;
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const dragger = (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined></InboxOutlined>
    </p>
    <p className="ant-upload-text">点击或拖拽文件到这个区域来上传</p>
  </Dragger>
);

export function ImageUpload(props: ImageUploadProps) {
  onChange = props.onChange!;

  return props?.value ? (
    <div>
      <img src={props.value} alt="图片" width="100" height="100" />
      {dragger}
    </div>
  ) : (
    <div>{dragger}</div>
  );
}
