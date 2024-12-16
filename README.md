# useFilter

### Description:

A custom hook for managing filter state and synchronizing it with URL search parameters. It allows you to define initial filters and updates the URL parameters when filters change.

</br>

### Hooks:

| Name      | Description                                                          | Props with Types                                                                              |
| --------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| useFilter | Manages filter state and synchronizes it with URL search parameters. | `namespace: string`, `initialFilters: T & Partial<DefaultFilters>`, `syncUrlParams?: boolean` |

</br>

### Basic Usage

```typescript
const { filters, onChangeFilter } = useFilter<FilterType>({
  namespace: 'myNamespace',
  initialFilters: {
    search: '',
    category: '',
    skip: 0,
    limit: 5,
  },
  syncUrlParams: true,
});
```

### Parameters

- **`namespace`**: `string`  
  A namespace to prefix the filter keys in the URL search parameters.

- **`initialFilters`**: `T & Partial<DefaultFilters>`  
  An object containing the initial filter values.

- **`syncUrlParams`**: `boolean`  
  A boolean to indicate whether to synchronize the filter state with URL search parameters.

</br>

### Returns

- **`filters`**: `T & DefaultFilters`  
  The current filter state.

- **`onChangeFilter`**: `(key: keyof (T & DefaultFilters), value: T[keyof T & DefaultFilters]) => void`  
  A function to update a specific filter value.

### Basic Usage

```typescript
import { useFilter } from '_hooks/useFilter';

interface MyFilters {
  search: string;
  category: string;
  skip: number;
  limit: number;
}

const MyComponent = () => {
  const { filters, onChangeFilter } = useFilter<MyFilters>({
    namespace: 'myNamespace',
    initialFilters: {
      search: '',
      category: '',
      skip: 0,
      limit: 5,
    },
    syncUrlParams: true,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilter('search', e.target.value);
  };

  return (
    <div>
      <input
        type='text'
        value={filters.search}
        onChange={handleSearchChange}
        placeholder='Search...'
      />
      {/* Other filter controls */}
    </div>
  );
};
```

### Dependencies:

- `useCallback`, `useMemo`, `useState` from `react`
- `useSearchParams` from `react-router-dom`
- `parseValue` from `_utils/helpers`
