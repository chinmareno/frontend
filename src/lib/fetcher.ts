import { toast } from "sonner";

export async function fetcher<T>(
  url: string,
  {
    body,
    method,
  }: { body: {} | undefined; method: "GET" | "POST" | "PATCH" | "DELETE" } = {
    body: undefined,
    method: "GET",
  }
) {
  const isClient = typeof window !== undefined;

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: body && JSON.stringify(body),
      method,
      credentials: "include",
      cache: "no-store",
    });
    const result = (await res.json()) as {
      success: boolean;
      message: string;
      data?: any;
    };
    console.log({ ...result, url, method });
    if (!result.success) {
      if (isClient) toast.error(result.message);
      return null;
    }
    return result.data as T;
  } catch (error) {
    console.log(error);
    return null;
  }
}
