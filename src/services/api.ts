const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// TODO: change this to type forlder
export interface CreateWalletRequest {
  name: string;
  signers: string[]; // Array of principal strings
  creatorPrincipal: string; // Principal of wallet creator
}

interface CreateWalletResponse {
  success: boolean;
  data: {
    canisterId: string;
    walletId: string;
  };
}

//TODO: Should have shared model
export interface WalletListResponse {
  success: boolean;
  data: Wallet[];
  count: number;
}

export interface WalletDetailResponse {
  success: boolean;
  data: Wallet;
}

export interface Wallet {
  id: string;
  canisterId: string;
  name: string;
  status: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  signers?: Array<{
    principal: string;
    displayName?: string;
  }>;
  threshold?: number;
}

export const createWalletAPI = async (walletData: CreateWalletRequest): Promise<CreateWalletResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(walletData),
  });

  if (!response.ok) {
    throw new Error(`Backend Error: ${response.statusText}`);
  }

  return response.json();
};

// Get all wallets for a principal
export const getWalletsByPrincipal = async (principal: string): Promise<Wallet[]> => {
  const response = await fetch(`${API_BASE_URL}/api/wallets?principal=${principal}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wallets: ${response.statusText}`);
  }

  const result: WalletListResponse = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};

// Get specific wallet by canister ID
export const getWalletByCanisterId = async (canisterId: string): Promise<Wallet> => {
  if (!canisterId) {
    throw new Error("Canister ID is required");
  }
  const response = await fetch(`${API_BASE_URL}/api/wallets/${canisterId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch wallet: ${response.statusText}`);
  }

  const result: WalletDetailResponse = await response.json();

  if (!result.success) {
    throw new Error("API returned error");
  }

  return result.data;
};
