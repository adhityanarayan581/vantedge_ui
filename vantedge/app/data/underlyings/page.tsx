'use client';

import { useState, useEffect } from 'react';
import { assetApi } from '@/lib/api';

interface Asset {
  id?: number;
  name: string;
  ticker_symbol: string;
  asset_class: string;
}

const assetClasses = ['Index', 'Stock', 'Commodity'];

export default function AssetsPage() {
  const [formData, setFormData] = useState<Asset>({
    name: '',
    ticker_symbol: '',
    asset_class: assetClasses[0],
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const data = await assetApi.getAll();
      setAssets(data);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Map frontend field names to backend field names
      const payload = {
        name: formData.name,
        ticker_symbol: formData.ticker_symbol,
        asset_class: formData.asset_class,
      };

      await assetApi.create(payload);
      
      setSuccess('Asset added successfully!');
      setFormData({
        name: '',
        ticker_symbol: '',
        asset_class: assetClasses[0],
      });
      
      // Refresh the list
      fetchAssets();
    } catch (err) {
      console.error('Error creating asset:', err);
      setError(err instanceof Error ? err.message : 'Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Underlying Asset</h1>
      
      {error && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#fee', border: '1px solid #c00', borderRadius: '4px', color: '#c00' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#efe', border: '1px solid #0a0', borderRadius: '4px', color: '#0a0' }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticker_symbol">Ticker Symbol</label>
          <input
            type="text"
            id="ticker_symbol"
            name="ticker_symbol"
            className="form-control"
            value={formData.ticker_symbol}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="asset_class">Asset Class</label>
          <select
            id="asset_class"
            name="asset_class"
            className="form-control"
            value={formData.asset_class}
            onChange={handleChange}
            required
          >
            {assetClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Underlying'}
        </button>
      </form>

      {assets.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Existing Assets</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Ticker</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Asset Class</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{asset.name}</td>
                  <td style={{ padding: '10px' }}>{asset.ticker_symbol}</td>
                  <td style={{ padding: '10px' }}>{asset.asset_class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
