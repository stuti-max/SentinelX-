/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_DEMO_MODE: string;
  readonly VITE_POLL_INTERVAL_MS: string;
  readonly VITE_CLUSTER_NAME: string;
  readonly VITE_CLUSTER_REGION: string;
  readonly VITE_K8S_NAMESPACE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
