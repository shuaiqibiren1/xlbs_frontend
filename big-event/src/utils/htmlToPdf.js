import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// 导出 PDF  
export const downloadPDF = async (page) => {
    const canvas = await html2canvas(page, {
        useCORS: true, // 允许跨域请求  
        allowTaint: true, // 允许跨域  
        scale: 2, // 设置放大倍数  
        backgroundColor: '#ffffff' // 背景色  
    });

    canvas2PDF(canvas);
};

// 将 canvas 转换为 PDF  
const canvas2PDF = (canvas) => {
    const PDF = new jsPDF({
        orientation: 'p', // 参数： l：横向  p：纵向  
        unit: 'mm', // 参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"）  
        format: 'a4' // A4纸  
    });

    const ctx = canvas.getContext('2d');
    const a4w = 190; // A4 宽度  
    const a4h = 277; // A4 高度  
    const imgHeight = Math.floor(a4h * canvas.width / a4w); // 计算每页的高度  
    let renderedHeight = 0;

    while (renderedHeight < canvas.height) {
        let page = document.createElement("canvas");
        page.width = canvas.width;
        page.height = Math.min(imgHeight, canvas.height - renderedHeight);

        // 用 getImageData 剪裁指定区域  
        page.getContext('2d').putImageData(
            ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)),
            0, 0
        );

        // canvas 转成图片并添加到 PDF  
        PDF.addImage(page.toDataURL('image/jpeg', 0.2), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width));

        renderedHeight += imgHeight;

        // 判断是否需要分页  
        if (renderedHeight < canvas.height) {
            PDF.addPage();
        }
    }

    PDF.save("心脏诊疗报告.pdf"); // 保存 PDF 文件  
    console.log("成功下载文件");
    console.log("page Height : " + imgHeight);
};