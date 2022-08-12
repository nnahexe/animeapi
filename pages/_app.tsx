import "../styles/globals.css";
import Layout from "./components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/theme";
import { useState } from "react";
import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client hydration next for prefetch data in ssg or ssr
// https://tanstack.com/query/v4/docs/guides/ssr

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
