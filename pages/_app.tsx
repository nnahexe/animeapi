import "../styles/globals.css";
import Layout from "./components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../utils/theme";

import {
  QueryClientProvider,
  QueryClient,
  Hydrate,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
// Create a client hydration next for prefetch data in ssg or ssr
// https://tanstack.com/query/v4/docs/guides/ssr
function MyApp({ Component, pageProps }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Hydrate state={pageProps.dehydratedState} />
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
