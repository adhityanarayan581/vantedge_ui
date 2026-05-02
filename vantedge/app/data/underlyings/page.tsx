'use client';

import { useState } from 'react';

interface Underlying {
  id?: string;
  name: string;
  tickerSymbol: string;
  assetClass: string;
}

const assetClasses = ['Index', 'Stock', 'Commodity'];

export default function UnderlyingsPage() {
  const [formData, setFormData] = useState<Underlying>({
    name: '',
    tickerSymbol: '',
    assetClass: assetClasses[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    console.log('Form submitted:', formData);
    alert('Underlying added successfully!');
    setFormData({
      name: '',
      tickerSymbol: '',
      assetClass: assetClasses[0],
    });
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Underlying Asset</h1>
      
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
          <label htmlFor="assetClass">Asset Class</label>
          <select
            id="assetClass"
            name="assetClass"
            className="form-control"
            value={formData.assetClass}
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

        <button type="submit" className="btn btn-primary">
          Add Underlying
        </button>
      </form>
    </div>
  );
}
