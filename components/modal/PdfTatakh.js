import { DownloadOutlined } from "@ant-design/icons";
import { Button, Modal, Popover, message } from "antd";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export default function PdfTatakh({
  title,
  open,
  onCancel,
  cancelText,
  htmlRef,
}) {
  const generateImageLandscape = async () => {
    const image = await toPng(htmlRef.current, { quality: 1 });
    const doc = new jsPDF({
      orientation: "landscape",
      format: "a4",
    });

    doc.addImage(image, "JPEG", 5, 15, 287, 180);
    doc.save('graphicTailan.pdf');
    message.info("Татаж эхэллээ",1)
    setTimeout(()=>{
      onCancel();
    },500)
  };
  const generateImagePortrait = async () => {
    const image = await toPng(htmlRef.current, { quality: 1 });
    const doc = new jsPDF({
      orientation: "portrait",
      format: "a4",
    });

    doc.addImage(image,'JPEG',5,22,200,160);
    doc.save('graphicTailan.pdf');
    message.info("Татаж эхэллээ",1)
    setTimeout(()=>{
      onCancel();
    },500)
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      cancelText={cancelText}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Хаах
        </Button>,
      ]}
    >
      <Popover
        className="flex justify-center items-center gap-2 border rounded-lg py-2 px-4 w-1/4 cursor-pointer"
        content={
            <div className="flex justify-between items-center gap-4">
                <Button onClick={generateImagePortrait}>Босоо</Button>
                <div className="h-full border-2 py-4 border-dashed"></div>
                <Button onClick={generateImageLandscape}>Хэвтээ</Button>
            </div>}
        trigger="hover"
        placement="bottom"
        >
        <DownloadOutlined />
        Татах
      </Popover>
    </Modal>
  );
}
