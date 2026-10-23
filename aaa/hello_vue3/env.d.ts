/// <reference types="vite/client" />
declare module './router' {
  import type { Router } from 'vue-router';
  const router: Router;
  export default router;
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  //  eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}