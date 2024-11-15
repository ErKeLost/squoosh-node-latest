import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { ImagePool } from 'squoosh-next';
import { cpus } from 'os';
import fs from 'fs/promises';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), squoosh()],
});

function squoosh() {
  return {
    name: 'squoosh',
    load(id) {},
    buildStart() {
      // let SquooshPool;
      compressImage(path.resolve('./pic.jpeg'));
    },
  };
}

async function compressImage(inputPath) {
  // 创建一个 ImagePool 实例，允许并行处理图像
  const imagePool = new ImagePool(cpus().length);

  // 读取输入图像文件
  const file = await fs.readFile(inputPath);

  // 将图像文件导入到 ImagePool 中
  const image = imagePool.ingestImage(file);

  // // 设置预处理选项（例如调整尺寸）
  const preprocessOptions = {
    resize: {
      width: 600, // 调整图像宽度为 800 像素
      height: 600, // 调整图像宽度为 800 像素
    },
  };
  await image.preprocess(preprocessOptions);

  // // 设置编码选项（例如使用 MozJPEG 编码）
  const encodeOptions = {
    mozjpeg: {
      quality: 75, // 设置 JPEG 压缩质量
    },
  };
  const result = await image.encode(encodeOptions);

  // // 获取编码后的图像数据
  const rawEncodedImage = result.mozjpeg.binary;

  // // 将编码后的图像数据写入输出文件
  await fs.writeFile(path.resolve('test.jpeg'), rawEncodedImage);

  // // 关闭 ImagePool
  await imagePool.close();
}
