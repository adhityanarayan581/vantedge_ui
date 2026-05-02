'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { optionsContractApi, assetApi } from '@/lib/api';

interface Asset {
  id: number;
  name: string;
  ticker_symbol: string;
  asset_class: string;
}

interface OptionsContract {
  id?: number;
  underlying_id: number | '';
  strike_price: string;
  lot_size: string;
  expiration_date: Dayjs | null;
  ticker_symbol: string;
  contract_type: string;
}

const contractTypes = ['Call', 'Put'];

export default function OptionsContractsPage() {
  const [formData, setFormData] = useState<OptionsContract>({
    underlying_id: '',
    strike_price: '',
    lot_size: '',
    expiration_date: null,
    ticker_symbol: '',
    contract_type: contractTypes[0],
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch assets and contracts on component mount
  useEffect(() => {
    fetchAssets();
    fetchContracts();
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

  const fetchContracts = async () => {
    try {
      const data = await optionsContractApi.getAll();
      setContracts(data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setError('Failed to fetch options contracts');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'underlying_id' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      expiration_date: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.underlying_id) {
        throw new Error('Please select an underlying asset');
      }

      if (!formData.expiration_date) {
        throw new Error('Please select an expiration date');
      }

      // Map frontend field names to backend field names
      const payload = {
        underlying_id: Number(formData.underlying_id),
        strike_price: parseFloat(formData.strike_price),
        lot_size: parseInt(formData.lot_size),
        expiration_date: formData.expiration_date.format('YYYY-MM-DD'),
        ticker_symbol: formData.ticker_symbol,
        contract_type: formData.contract_type.toUpperCase(),
      };

      await optionsContractApi.create(payload);
      
      setSuccess('Options Contract added successfully!');
      setFormData({
        underlying_id: '',
        strike_price: '',
        lot_size: '',
        expiration_date: null,
        ticker_symbol: '',
        contract_type: contractTypes[0],
      });
      
      // Refresh the list
      fetchContracts();
    } catch (err) {
      console.error('Error creating options contract:', err);
      setError(err instanceof Error ? err.message : 'Failed to create options contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Options Contract</h1>
      
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
          <label htmlFor="underlying_id">Underlying Asset</label>
          <select
            id="underlying_id"
            name="underlying_id"
            className="form-control"
            value={formData.underlying_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.ticker_symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="strike_price">Strike Price</label>
          <input
            type="number"
            id="strike_price"
            name="strike_price"
            className="form-control"
            value={formData.strike_price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lot_size">Lot Size</label>
          <input
            type="number"
            id="lot_size"
            name="lot_size"
            className="form-control"
            value={formData.lot_size}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expiration_date">Expiration Date</label>
          <DatePicker
            value={formData.expiration_date}
            onChange={handleDateChange}
            format="MMMM DD, YYYY"
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
              },
            }}
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
          <label htmlFor="contract_type">Contract Type</label>
          <select
            id="contract_type"
            name="contract_type"
            className="form-control"
            value={formData.contract_type}
            onChange={handleChange}
            required
          >
            {contractTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Options Contract'}
        </button>
      </form>

      {contracts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2>Existing Options Contracts</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Ticker</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Strike</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Expiration</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Lot Size</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px' }}>{contract.ticker_symbol}</td>
                  <td style={{ padding: '10px' }}>{contract.strike_price}</td>
                  <td style={{ padding: '10px' }}>{contract.contract_type}</td>
                  <td style={{ padding: '10px' }}>{dayjs(contract.expiration_date).format('MMMM DD, YYYY')}</td>
                  <td style={{ padding: '10px' }}>{contract.lot_size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
