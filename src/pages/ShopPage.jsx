import { useState, useMemo, useEffect } from 'react'
import ProductCard, { ProductCardSkeleton } from '../components/ui/ProductCard'
import useProductStore from '../store/productStore'
import styles from './ShopPage.module.css'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
]

const ShopPage = () => {
  const allProducts = useProductStore((s) => s.products)
  const reload = useProductStore((s) => s.reload)
  const loading = useProductStore((s) => s.loading)
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState('')

  // Fetch from Supabase on mount and on window focus
  useEffect(() => {
    reload()
    const onFocus = () => reload()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  // Build category list from actual products
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))]
    return ['All', ...cats]
  }, [allProducts])

  const products = useMemo(() => {
    let list = allProducts
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
      )
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'name') list = [...list].sort((a, b) => a.name?.localeCompare(b.name))
    return list
  }, [allProducts, category, sort, search])

  return (
    <div className={`page-fade ${styles.page}`}>
      <div className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>Shop</h1>
          <p className={styles.count}>{products.length} {products.length === 1 ? 'product' : 'products'}</p>
        </div>
      </div>

      <div className="container">
        {loading && allProducts.length === 0 ? (
          /* Full page skeleton on first load */
          <div className={styles.layout}>
            <aside className={styles.sidebar} />
            <div className={styles.main}>
              <div className={styles.grid}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : allProducts.length === 0 ? (
          <EmptyShop />
        ) : (
          <div className={styles.layout}>
            {/* Sidebar filters */}
            <aside className={styles.sidebar}>
              <Filters
                categories={categories}
                category={category}
                setCategory={setCategory}
                sort={sort}
                setSort={setSort}
                search={search}
                setSearch={setSearch}
              />
            </aside>

            <div className={styles.main}>
              {/* Mobile bar */}
              <div className={styles.mobileBar}>
                <input
                  type="search"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={styles.mobileSearch}
                  aria-label="Search products"
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={styles.mobileSort}
                  aria-label="Sort"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {loading && allProducts.length === 0 ? (
                /* Skeleton grid while first load */
                <div className={styles.grid}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className={styles.noMatch}>
                  <p>No products match.</p>
                  <button className={styles.clearBtn} onClick={() => { setCategory('All'); setSearch('') }}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className={styles.grid}>
                  {products.map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Filters = ({ categories, category, setCategory, sort, setSort, search, setSearch }) => (
  <div className={styles.filterPanel}>
    <div className={styles.filterGroup}>
      <p className={styles.filterLabel}>Search</p>
      <input
        type="search"
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
        aria-label="Search products"
      />
    </div>
    <div className={styles.filterGroup}>
      <p className={styles.filterLabel}>Category</p>
      {categories.map((c) => (
        <button
          key={c}
          className={`${styles.catBtn} ${category === c ? styles.catActive : ''}`}
          onClick={() => setCategory(c)}
          aria-pressed={category === c}
        >
          {c}
        </button>
      ))}
    </div>
    <div className={styles.filterGroup}>
      <label className={styles.filterLabel} htmlFor="sort-select">Sort</label>
      <select
        id="sort-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={styles.sortSelect}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  </div>
)

const EmptyShop = () => (
  <div className={styles.emptyShop}>
    <p className={styles.emptyText}>No products added yet.</p>
  </div>
)

export default ShopPage
