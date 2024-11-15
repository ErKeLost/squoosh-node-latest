import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

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
      import('squoosh-next')
        .then((module) => {
          // SquooshPool = module.ImagePool;
          // delete globalThis.navigator;
          // console.log(SquooshPool);
        })
        .catch(console.error);
    },
  };
}
