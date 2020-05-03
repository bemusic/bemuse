declare module 'serviceworker-webpack-plugin/lib/runtime' {
  const runtime: { register: () => Promise<ServiceWorkerRegistration> }
  export default runtime
}
