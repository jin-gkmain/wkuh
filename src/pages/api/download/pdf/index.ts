// import type { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import puppeteer from 'puppeteer';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { type, lang, info } = await req.body;
//   const htmlTemplatePath = path.join(
//     // process.env.NEXT_PUBLIC_HOST_URL,
//     process.cwd(),
//     'public',
//     'templates',
//     lang,
//     type === 'patient' ? 'patientInfo.html' : 'carePlanInfo.html'
//   );

//   // let htmlTemplate = '';
//   // try {
//   //   htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');
//   // } catch (err) {
//   //   res.status(400).json({
//   //     msg: '파일 읽기 실패',
//   //     path: htmlTemplatePath,
//   //     cwd: process.cwd(),
//   //     err: err,
//   //   });
//   // }

//   let htmlTemplate = '';

//   // fs.readFile(htmlTemplatePath, 'utf8', (err, data) => {
//   //   if (err) {
//   //     return res
//   //       .status(400)
//   //       .json({ err, path: htmlTemplatePath, mas: '파일을 읽을 수 없음' });
//   //   }
//   //   console.log('파일 내용:', data);
//   //   htmlTemplate = data;
//   // });

//   ////////
//   // if (!fs.existsSync(htmlTemplatePath)) {
//   //   return res.status(201).json({ msg: '????' });
//   // } else {
//   //   return res.status(202).json({ msg: '!!!!!' });
//   // }

//   /////

//   if (fs.existsSync(htmlTemplatePath)) {
//     let text = '1';
//     const setText = (txt: string) => {
//       text = txt;
//     };
//     try {
//       const fileContent = fs.readFileSync(htmlTemplatePath, 'utf-8');
//       text = '2';
//       const renderedHtml = replaceKeyToValue(fileContent, info);
//       // res.status(200).json({ content: renderedHtml });
//       text = '3';
//       // const { pdfBuffer, msg } = await generatePDF(renderedHtml, setText);
//       try {
//         const browser = await puppeteer.launch({
//           // args: [
//           //   '--no-sandbox',
//           //   '--disable-setuid-sandbox',
//           //   '--ignore-certificate-errors',
//           //   '--disable-web-security',
//           // ],
//           args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--disable-web-security',
//             '--ignore-certificate-errors',
//             '--allow-insecure-localhost', // HTTPS 환경에서 localhost 허용
//             '--disable-dev-shm-usage', // /dev/shm 사용 비활성화
//             '--disable-gpu', // GPU 비활성화
//           ],
//           headless: true,
//           ignoreHTTPSErrors: true,
//           ignoreDefaultArgs: ['--enable-automation'],
//         });
//       } catch (err) {
//         text = '4';
//         return res.status(200).json({ text, err });
//       }

//       res.status(200).json({ text });

//       // res.status(200).json({ content: pdfBuffer, msg });

//       // text = msg;
//       // if (msg) {
//       //   return res.status(205).json({ msg });
//       // }

//       // res.setHeader('Content-Type', 'application/pdf');
//       // res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

//       // res.end(pdfBuffer);
//     } catch (err) {
//       res
//         .status(500)
//         .json({ error: '파일을 읽는 중 오류가 발생했습니다.', text, err });
//     }
//   }

//   // try {
//   //   htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');

//   //   // htmlTemplate = await fs.promises.readFile(htmlTemplatePath, 'utf-8');
//   //   return res.status.json(htmlTemplate);
//   // } catch (err) {
//   //   res.status(400).json({
//   //     msg: '파일 읽기 실패',
//   //     path: htmlTemplatePath,
//   //     cwd: process.cwd(),
//   //     dirname: __dirname,
//   //     err: err,
//   //   });
//   // }

//   /////////////

//   // const renderedHtml = replaceKeyToValue(htmlTemplate, info);
//   // const { pdfBuffer, msg } = await generatePDF(renderedHtml);

//   // if (msg) {
//   //   return res.status(205).json({ msg });
//   // }

//   // res.setHeader('Content-Type', 'application/pdf');
//   // res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');

//   // res.end(pdfBuffer);
// }

// function replaceKeyToValue(str: string, obj: { [key: string]: string }) {
//   for (const key in obj) {
//     str = str.replace(`{{${key}}}`, obj[key] ? obj[key] : '');
//   }

//   return str;
// }

// async function generatePDF(
//   htmlContent: string,
//   setText: (txt: string) => void
// ) {
//   let msg = '문제 없음';
//   try {
//     const browser = await puppeteer.launch({
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--ignore-certificate-errors',
//         '--disable-web-security',
//       ],
//       headless: true,
//       ignoreHTTPSErrors: true,
//     });
//   } catch (err) {
//     throw new Error('launch 문제...ㅠㅠ');
//   }

//   // let page: any;
//   // setText('11');
//   // try {
//   //   page = await browser.newPage();
//   //   setText('22');
//   // } catch (err) {
//   //   msg = '페이지 에러';
//   //   setText('33');
//   //   await browser.close();
//   //   throw new Error('페이지 에러');
//   // }
//   // setText('44');
//   // try {
//   //   await page.setContent(htmlContent, {
//   //     waitUntil: 'domcontentloaded',
//   //     timeout: 60000,
//   //   });
//   //   setText('55');
//   // } catch (err) {
//   //   msg = 'setConent 에러';
//   //   setText('66');
//   //   await browser.close();
//   //   throw new Error('setConent 에러');
//   // }
//   // setText('77');
//   // let pdfBuffer;

//   // try {
//   //   pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
//   //   setText('88');
//   // } catch (err) {
//   //   msg = 'page.pdf 에러';
//   //   setText('99');
//   //   await browser.close();
//   //   throw new Error('page.pdf 에러');
//   // }
//   // setText('1000');
//   // try {
//   //   await browser.close();
//   //   setText('1100');
//   // } catch (err) {
//   //   await browser.process().kill();
//   //   msg = 'browser.close 에러';
//   //   setText('1200');
//   //   throw new Error('browser.close 에러');
//   // }

//   return { pdfBuffer: '', msg };
// }

import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { type, lang, info } = await req.body;
  const htmlTemplatePath = path.join(
    process.cwd(),
    'public',
    'templates',
    lang,
    type === 'patient' ? 'patientInfo.html' : 'carePlanInfo.html'
  );

  let htmlTemplate = '';
  try {
    htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');
  } catch (err) {
    return res.status(400).json({
      msg: '파일 읽기 실패',
      path: htmlTemplatePath,
      cwd: process.cwd(),
      err: err,
    });
  }

  const renderedHtml = replaceKeyToValue(htmlTemplate, info);

  const pdfBuffer = await generatePDF(renderedHtml);

  // return res.status(400).json({ pdfBuffer });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
  res.end(pdfBuffer);
}

function replaceKeyToValue(str: string, obj: { [key: string]: string }) {
  for (const key in obj) {
    str = str.replace(`{{${key}}}`, obj[key] ? obj[key] : '');
  }
  return str;
}

async function generatePDF(htmlContent: string) {
  const browser = await chromium.launch();
  // const page = await browser.newPage();

  const context = await browser.newContext({
    ignoreHTTPSErrors: true, // HTTPS 환경에서 SSL 문제 무시
    locale: 'ko-KR',
  });

  const page = await context.newPage();

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  // 네트워크 활동이 없을 때까지 기다린다.
  await page.waitForLoadState('networkidle');

  // await page.evaluate(() => document.fonts.ready);

  // 페이지의 미디어 유형을 에뮬레이트하는 데 사용
  await page.emulateMedia({ media: 'screen' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  return pdfBuffer;
}
