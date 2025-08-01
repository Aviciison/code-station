import { Modal } from "antd";
import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
interface UploadImageModalProps {
  isOpen: boolean;
  handleClose: (imageSrc?: string) => void;
  type: "image" | "file";
}

export function UploadImageModal(props: UploadImageModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("");

  return (
    <Modal
      title={`上传${props.type === "image" ? "图片" : "文件"}`}
      open={props.isOpen}
      onOk={() => {
        props.handleClose(imgSrc);
        setImgSrc("");
      }}
      onCancel={() => props.handleClose()}
      okText={"确认"}
      cancelText={"取消"}
    >
      <ImageUpload
        value={imgSrc}
        onChange={(value: string) => {
          setImgSrc(value);
        }}
        type={props.type}
      ></ImageUpload>
    </Modal>
  );
}
