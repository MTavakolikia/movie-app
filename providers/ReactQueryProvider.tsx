import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Hydrate } from "react-query";

export default function App({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    const dehydratedState = dehydrate(queryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={dehydratedState}>{children}</Hydrate>
        </QueryClientProvider>
    );
}
