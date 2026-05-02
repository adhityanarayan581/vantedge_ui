'use client';

import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

interface OptionsContract {
  id?: string;
  underlyingId: string;
  strikePrice: string;
  lotSize: string;
  expirationDate: Dayjs | null;
  tickerSymbol: string;
  contractType: string;
}

const contractTypes = ['Call', 'Put'];

// Mock data - will come from backend
const mockUnderlyings = [
  { id: '1', name: 'Nifty 50', tickerSymbol: 'NIFTY' },
  { id: '2', name: 'Bank Nifty', tickerSymbol: 'BANKNIFTY' },
  { id: '3', name: 'Reliance Industries', tickerSymbol: 'RELIANCE' },
];

export default function OptionsContractsPage() {
  const [formData, setFormData] = useState<OptionsContract>({
    underlyingId: '',
    strikePrice: '',
    lotSize: '',
    expirationDate: null,
    tickerSymbol: '',
    contractType: contractTypes[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFormData(prev => ({
      ...prev,
      expirationDate: date,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    console.log('Form submitted:', formData);
    alert('Options Contract added successfully!');
    setFormData({
      underlyingId: '',
      strikePrice: '',
      lotSize: '',
      expirationDate: null,
      tickerSymbol: '',
      contractType: contractTypes[0],
    });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Options Contract</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="underlyingId">Underlying Asset</label>
          <select
            id="underlyingId"
            name="underlyingId"
            className="form-control"
            value={formData.underlyingId}
            onChange={handleChange}
            required
          >
            <option value="">Select Underlying Asset</option>
            {mockUnderlyings.map((underlying) => (
              <option key={underlying.id} value={underlying.id}>
                {underlying.name} ({underlying.tickerSymbol})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="strikePrice">Strike Price</label>
          <input
            type="number"
            id="strikePrice"
            name="strikePrice"
            className="form-control"
            value={formData.strikePrice}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lotSize">Lot Size</label>
          <input
            type="number"
            id="lotSize"
            name="lotSize"
            className="form-control"
            value={formData.lotSize}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date</label>
          <DatePicker
            value={formData.expirationDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                required: true,
                fullWidth: true,
              },
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="tickerSymbol">Ticker Symbol</label>
          <input
            type="text"
            id="tickerSymbol"
            name="tickerSymbol"
            className="form-control"
            value={formData.tickerSymbol}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contractType">Contract Type</label>
          <select
            id="contractType"
            name="contractType"
            className="form-control"
            value={formData.contractType}
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

        <button type="submit" className="btn btn-primary">
          Add Options Contract
        </button>
      </form>
    </div>
  );
}
