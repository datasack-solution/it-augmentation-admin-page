import "@/styles/globals.css";
import { EuiProvider } from "@elastic/eui";
import type { AppProps } from "next/app";
import '@elastic/eui/dist/eui_theme_light.css';
import { QueryClient, QueryClientProvider } from 'react-query';


export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return <QueryClientProvider client={queryClient}> <EuiProvider colorMode="light">
    <Component {...pageProps} /></EuiProvider></QueryClientProvider>
}
