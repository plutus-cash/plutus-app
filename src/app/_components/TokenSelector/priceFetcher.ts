import { tokenConfigs } from "./constants";

const UNISWAP_API_URL = "https://interface.gateway.uniswap.org/v1/graphql";

interface TokenPriceResponse {
  data: {
    token: {
      project: {
        markets: Array<{
          price: {
            value: number;
          };
        }>;
      };
    };
  };
}

async function fetchTokenPrice(tokenAddress: string, chain: string): Promise<number> {
  const query = `
    query TokenSpotPrice($chain: Chain!, $address: String!) {
      token(chain: $chain, address: $address) {
        project {
          markets(currencies: [USD]) {
            price {
              value
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(UNISWAP_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://app.uniswap.org",
      },
      body: JSON.stringify({
        query,
        variables: {
          chain: chain.toUpperCase(),
          address: tokenAddress.toLowerCase(),
        },
      }),
    });

    const data = (await response.json()) as TokenPriceResponse;

    const price = data.data?.token?.project?.markets[0]?.price?.value;
    return price || 0;
  } catch (error) {
    console.error(`Error fetching price for token ${tokenAddress} on ${chain}:`, error);
    return 0;
  }
}

export async function fetchTokenPrices(): Promise<Record<string, Record<string, number>>> {
  const prices: Record<string, Record<string, number>> = {};

  for (const [chain, tokens] of Object.entries(tokenConfigs)) {
    prices[chain] = {};

    await Promise.all(
      Object.values(tokens).map(async (token) => {
        const price = await fetchTokenPrice(token.address, chain);
        prices[chain][token.address] = price;
      })
    );
  }

  return prices;
}
