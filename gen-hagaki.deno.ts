import { PDFDocument, degrees } from "https://cdn.skypack.dev/pdf-lib@^1.7.0";
import fontkit from 'https://cdn.skypack.dev/@pdf-lib/fontkit@^1.0.0?dts';

const calcPt = (mm: number) => (mm / 25.4) * 72;
const drawVertical = (page: any, text: string, font: any, x: number, y: number, size: number) => {
  let textHeight = text.length * font.heightAtSize(size)
  for(let i = 0; i < text.length; i ++) {
    page.drawText(text.at(i), {
      font: customFont,
      x: x,
      y: y + textHeight - i * customFont.heightAtSize(size),
      size: size
    })
  }
}

const fontFilePath = 'M_PLUS_Rounded_1c/MPLUSRounded1c-Regular.ttf'
const fontBytes = await Deno.readFile(fontFilePath);

const pdfDoc = await PDFDocument.create();
pdfDoc.registerFontkit(fontkit);
const customFont = await pdfDoc.embedFont(fontBytes);

const atena = pdfDoc.addPage([calcPt(100), calcPt(148)]);
const { width, height } = atena.getSize();
atena.drawText('郵便はがき', {
  font: customFont,
  x: (width / 2) - (customFont.widthOfTextAtSize('郵便はがき', 10.5) / 2),
  y: calcPt(142),
  size: 10.5
})
atena.drawText('〒123-4567', {
  font: customFont,
  x: calcPt(47),
  y: calcPt(132),
  size: 24
});

drawVertical(atena, '送り先住所', customFont, calcPt(77), calcPt(57), 24)
drawVertical(atena, '宛名 太郎 様', customFont, (width / 2) - (customFont.widthOfTextAtSize('宛', 30) / 2) + calcPt(5), calcPt(10), 30)
drawVertical(atena, '送り主住所', customFont, calcPt(20), calcPt(5), 18)
drawVertical(atena, '送り主名', customFont, calcPt(5), calcPt(5), 18)

atena.drawText('〒765-4321', {
  font: customFont,
  x: calcPt(4),
  y: calcPt(4),
  size: 12
})

const bunmen = pdfDoc.addPage([calcPt(100), calcPt(148)])
bunmen.drawText('謹賀新年', {
  font: customFont,
  x: calcPt(10),
  y: calcPt(128),
  size: calcPt(20)
})

const iconPicture = await Deno.readFile('icon.png')
const iconImage = await pdfDoc.embedPng(iconPicture)
const iconDims = iconImage.scale(0.2)
bunmen.drawImage(iconImage, {
  x: calcPt(10),
  y: calcPt(5),
  width: iconDims.width,
  height: iconDims.height
})

bunmen.drawText('今年もよろしくお願いします！', {
  font: customFont,
  x: calcPt(30),
  y: calcPt(10),
  size: 12
})

const pdfBytes = await pdfDoc.save();
await Deno.writeFile('./out.pdf', pdfBytes);
console.log('PDF file written to ./out.pdf');
