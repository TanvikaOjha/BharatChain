'use client';
 
export type SortOption = 'newest' | 'price-asc' | 'price-desc';
 
interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  maxPriceEth: number;
  onMaxPriceChange: (v: number) => void;
  creatorFilter: string;
  onCreatorFilterChange: (v: string) => void;
  creatorOptions: { address: string; label: string }[];
}
 
export function FilterBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  maxPriceEth,
  onMaxPriceChange,
  creatorFilter,
  onCreatorFilterChange,
  creatorOptions,
}: Props) {
  return (
    <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', alignItems: 'center' }}>
      <input
        type="search"
        placeholder="Search by asset ID or CID…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ flex: '1 1 220px', padding: '0.4rem 0.6rem' }}
      />
 
      <select value={sort} onChange={(e) => onSortChange(e.target.value as SortOption)}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
 
      <select value={creatorFilter} onChange={(e) => onCreatorFilterChange(e.target.value)}>
        <option value="">All creators</option>
        {creatorOptions.map((c) => (
          <option key={c.address} value={c.address}>
            {c.label}
          </option>
        ))}
      </select>
 
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
        Max price
        <input
          type="number"
          min={0}
          step={0.01}
          value={maxPriceEth}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          style={{ width: 80, padding: '0.3rem 0.4rem' }}
        />
        ETH
      </label>
    </div>
  );
}
 