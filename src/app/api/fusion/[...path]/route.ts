import { NextResponse } from "next/server";

async function handleRequest(request: Request, { params }: { params: { path: string[] } }) {
  try {
    const { searchParams } = new URL(request.url);
    const pathSegments = params.path.join("/");
    const url = new URL(`https://api.1inch.dev/fusion-plus/${pathSegments}`);

    // Copy all search params to the new URL
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    console.log("Request URL:", url.toString());
    console.log("Request Method:", request.method);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
      Accept: "application/json",
    };

    // Handle request body for POST requests
    let requestBody;
    if (request.method === "POST") {
      headers["Content-Type"] = "application/json";
      const bodyText = await request.text();
      console.log("Request Body Text:", bodyText);

      try {
        requestBody = bodyText ? JSON.parse(bodyText) : undefined;
      } catch (e) {
        console.error("Failed to parse request body:", e);
      }
    }

    console.log("Request Headers:", headers);
    console.log("Processed Request Body:", requestBody);

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method === "POST" && requestBody) {
      fetchOptions.body = JSON.stringify(requestBody);
    }

    const response = await fetch(url, fetchOptions);

    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

    // Read response as text first
    const responseText = await response.text();
    console.log("Response Text:", responseText);

    if (!response.ok) {
      throw new Error(`1inch API responded with status: ${response.status}. Body: ${responseText}`);
    }

    // Try to parse JSON only if we have content
    const data = responseText ? JSON.parse(responseText) : null;
    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Fusion API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch from 1inch API",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function POST(request: Request, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}
