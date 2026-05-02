// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Asset API calls (formerly underlyings)
export const assetApi = {
  // Get all assets
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/assets/`);
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    return response.json();
  },

  // Get asset by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch asset');
    }
    return response.json();
  },

  // Create new asset
  create: async (data: { name: string; ticker_symbol: string; asset_class: string }) => {
    const response = await fetch(`${API_BASE_URL}/assets/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create asset');
    }
    return response.json();
  },

  // Update asset
  update: async (id: string, data: { name?: string; ticker_symbol?: string; asset_class?: string }) => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update asset');
    }
    return response.json();
  },

  // Delete asset
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete asset');
    }
    return response.json();
  },
};

// Options Contract API calls
export const optionsContractApi = {
  // Get all options contracts
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/options/`);
    if (!response.ok) {
      throw new Error('Failed to fetch options contracts');
    }
    return response.json();
  },

  // Get options contract by ID
  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/options/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch options contract');
    }
    return response.json();
  },

  // Get options contracts by underlying ID
  getByUnderlying: async (underlyingId: string) => {
    const response = await fetch(`${API_BASE_URL}/options/underlying/${underlyingId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch options contracts by underlying');
    }
    return response.json();
  },

  // Create new options contract
  create: async (data: {
    underlying_id: number;
    strike_price: number;
    lot_size: number;
    expiration_date: string;
    ticker_symbol: string;
    contract_type: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/options/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create options contract');
    }
    return response.json();
  },

  // Update options contract
  update: async (
    id: string,
    data: {
      underlying_id?: number;
      strike_price?: number;
      lot_size?: number;
      expiration_date?: string;
      ticker_symbol?: string;
      contract_type?: string;
    }
  ) => {
    const response = await fetch(`${API_BASE_URL}/options/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update options contract');
    }
    return response.json();
  },

  // Delete options contract
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/options/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete options contract');
    }
    return response.json();
  },
};
