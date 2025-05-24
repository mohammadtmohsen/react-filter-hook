# react-filter-hook

<div align="center">

[![npm version](https://img.shields.io/npm/v/react-filter-hook.svg)](https://www.npmjs.com/package/react-filter-hook)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and lightweight React hook for managing filter state through URL search parameters.
Seamlessly synchronize your application's filter state with the URL for better user experience and deep-linking support.

</div>

## ✨ Features

- 🔄 **URL Synchronization** - Automatically sync filter state with URL parameters
- 🌐 **React Integration** - Built specifically for React applications
- 📝 **TypeScript Support** - Full TypeScript support with type inference
- 🏷️ **Namespacing** - Support for multiple independent filter sets
- 💾 **State Persistence** - Filters persist through page refreshes
- 🎯 **Zero Dependencies** - Lightweight with no external dependencies
- 🔙 **History Support** - Seamless browser history integration

## 🚀 Getting Started

### Installation

```bash
# Using npm
npm install react-filter-hook

# Using yarn
yarn add react-filter-hook

# Using pnpm
pnpm add react-filter-hook
```

## 📖 Usage

### Basic Example

```typescript
import { useFilters } from 'react-filter-hook';

interface MyFilters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
}

function ProductList() {
  const { filters, onChangeFilter } = useFilters<MyFilters>({
    namespace: 'products',
    initialFilters: {
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
    },
  });

  return (
    <div>
      <input
        type='text'
        value={filters.search}
        onChange={(e) => onChangeFilter('search', e.target.value)}
        placeholder='Search products...'
      />

      <select
        value={filters.category}
        onChange={(e) => onChangeFilter('category', e.target.value)}
      >
        <option value='all'>All Categories</option>
        <option value='electronics'>Electronics</option>
        <option value='clothing'>Clothing</option>
      </select>

      <div>
        <input
          type='number'
          value={filters.minPrice}
          onChange={(e) => onChangeFilter('minPrice', Number(e.target.value))}
          min={0}
          max={filters.maxPrice}
        />
        <input
          type='number'
          value={filters.maxPrice}
          onChange={(e) => onChangeFilter('maxPrice', Number(e.target.value))}
          min={filters.minPrice}
        />
      </div>
    </div>
  );
}
```

## 🔧 Advanced Features

### Array Values Support

The hook seamlessly handles array values, storing them as comma-separated values in the URL:

```typescript
interface FiltersWithArrays {
  tags: string[];
  prices: number[];
}

const { filters, onChangeFilter } = useFilters<FiltersWithArrays>({
  initialFilters: {
    tags: [],
    prices: [],
  },
});

// Update array values
onChangeFilter('tags', ['react', 'typescript']);
// Results in URL: ?tags=react,typescript
```

### Type Safety

The hook is fully typed and provides excellent TypeScript integration:

```typescript
// Your filters will be fully typed
type MyFilters = {
  category: 'all' | 'electronics' | 'clothing';
  price: number;
  inStock: boolean;
};

const { filters } = useFilters<MyFilters>({
  initialFilters: {
    category: 'all',
    price: 0,
    inStock: true,
  },
});
// filters.category will only accept: 'all' | 'electronics' | 'clothing'
```

## 🔧 API Reference

### useFilters

```typescript
function useFilters<T>(options: FilterOptions<T>): {
  filters: T;
  onChangeFilter: (
    key: keyof T,
    value: T[keyof T],
    options?: { resetSkip?: boolean }
  ) => void;
};
```

#### Options

| Option         | Type     | Required | Description                                  |
| -------------- | -------- | -------- | -------------------------------------------- |
| initialFilters | `T`      | Yes      | The initial state of your filters            |
| namespace      | `string` | No       | Prefix for URL parameters to avoid conflicts |

#### Returns

| Property       | Type       | Description                      |
| -------------- | ---------- | -------------------------------- |
| filters        | `T`        | Current state of the filters     |
| onChangeFilter | `Function` | Function to update filter values |

## 🎯 Examples

### With TypeScript

```typescript
import { useFilters } from 'react-filter-hook';

interface Filters {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
}

function ProductList() {
  const { filters, onChangeFilter } = useFilters<Filters>({
    namespace: 'products',
    initialFilters: {
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: 1000,
      page: 1,
    },
  });

  // Use filters in your component
  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => onChangeFilter('search', e.target.value)}
      />
      {/* Other filter controls */}
    </div>
  );
}
```

### With Namespaces

```typescript
// Filter set 1
const { filters: productFilters } = useFilters({
  namespace: 'products',
  initialFilters: {
    /* ... */
  },
});

// Filter set 2 (won't conflict with products)
const { filters: userFilters } = useFilters({
  namespace: 'users',
  initialFilters: {
    /* ... */
  },
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support

If you find this package helpful, please consider:

- Starring the [GitHub repository](https://github.com/mohammadtmohsen/react-filter-hook)
- Creating an issue for any bugs or feature requests
- Contributing to the codebase

---

<div align="center">
  Made with ❤️ for the React community
</div>
