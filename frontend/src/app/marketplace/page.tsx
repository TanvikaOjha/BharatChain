'use client';

import { useMemo, useState } from 'react';
import { formatEther } from 'viem';
import { useAssets } from '../../hooks/useAssets';
import { AssetCard } from '../../components/AssetCard';
import { FilterBar, SortOption } from '../../components/FilterBar';
import { EventFeed } from '../../components/EventFeed';

const PAGE_SIZE = 9;

export default function MarketplacePage() {
  const { assets, loading, error, refresh } = useAssets();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [maxPriceEth, setMaxPriceEth] = useState(1000);
  const [creatorFilter, setCreatorFilter] = useState('');
  const [page, setPage] = useState(1);

  const creatorOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of assets) {
      seen.set(a.creator, a.creatorProfile?.label ?? a.creator);
    }
    return Array.from(seen.entries()).map(([address, label]) => ({ address, label }));
  }, [assets]);

  const filtered = useMemo(() => {
    let result = assets;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((a) => String(a.assetId).includes(q) || a.cid.toLowerCase().includes(q));
    }
    if (creatorFilter) {
      result = result.filter((a) => a.creator.toLowerCase() === creatorFilter.toLowerCase());
    }
    result = result.filter((a) => Number(formatEther(a.price)) <= maxPriceEth);

    result = [...result].sort((a, b) => {
      if (sort === 'price-asc') return Number(a.price - b.price);
      if (sort === 'price-desc') return Number(b.price - a.price);
      return b.mintedAtBlock - a.mintedAtBlock; // newest
    });

    return result;
  }, [assets, search, creatorFilter, maxPriceEth, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Marketplace</h1>
        <button onClick={refresh}>Refresh</button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        sort={sort}
        onSortChange={setSort}
        maxPriceEth={maxPriceEth}
        onMaxPriceChange={setMaxPriceEth}
        creatorFilter={creatorFilter}
        onCreatorFilterChange={(v) => {
          setCreatorFilter(v);
          setPage(1);
        }}
        creatorOptions={creatorOptions}
      />

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {loading && <p style={{ color: 'var(--text-muted)' }}>Loading datasets…</p>}

      {!loading && pageItems.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No datasets match your filters.</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {pageItems.map((asset) => (
          <AssetCard key={asset.assetId} asset={asset} />
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span style={{ alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      <EventFeed title="Global On-Chain Activity" />
    </div>
  );
}