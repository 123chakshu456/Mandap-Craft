import { filterRepository } from './filter.repository.js';
import { slugify } from '../../shared/utils/slugify.js';

export const filterService = {
  /**
   * Get public active filters, optionally filtered by category
   */
  async getPublicFilters(categoryId) {
    const filters = await filterRepository.findAll({ isActive: true });

    if (!categoryId || categoryId === 'all') {
      return filters;
    }

    // Filter by category applicability
    return filters.filter((f) => {
      const cats = Array.isArray(f.applicableCategories) ? f.applicableCategories : [];
      return cats.includes('all') || cats.includes(categoryId);
    });
  },

  /**
   * Get all filters for admin panel
   */
  async getAdminFilters() {
    return filterRepository.findAll();
  },

  /**
   * Create a new filter
   */
  async createFilter(payload) {
    const { name, label, key, type = 'select', sortOrder, applicableCategories, values = [] } = payload;

    if (!name || !label) {
      const err = new Error('Filter name and label are required.');
      err.statusCode = 400;
      throw err;
    }

    const filterKey = slugify(key || name);
    const existing = await filterRepository.findByKey(filterKey);
    if (existing) {
      const err = new Error(`Filter with key '${filterKey}' already exists.`);
      err.statusCode = 400;
      throw err;
    }

    return filterRepository.create({
      name,
      label,
      key: filterKey,
      type,
      sortOrder: parseInt(sortOrder) || 0,
      applicableCategories: Array.isArray(applicableCategories) ? applicableCategories : ['all'],
      values: {
        create: values.map((v, idx) => ({
          value: v.value || slugify(v.label),
          label: v.label,
          sortOrder: v.sortOrder !== undefined ? parseInt(v.sortOrder) : idx + 1,
        })),
      },
    });
  },

  /**
   * Update filter
   */
  async updateFilter(id, payload) {
    const existing = await filterRepository.findById(id);
    if (!existing) {
      const err = new Error('Filter not found.');
      err.statusCode = 404;
      throw err;
    }

    const { name, label, key, type, sortOrder, isActive, applicableCategories } = payload;

    let filterKey = existing.key;
    if (key && key !== existing.key) {
      filterKey = slugify(key);
      const check = await filterRepository.findByKey(filterKey);
      if (check && check.id !== id) {
        const err = new Error(`Filter key '${filterKey}' is already in use.`);
        err.statusCode = 400;
        throw err;
      }
    }

    return filterRepository.update(id, {
      ...(name !== undefined && { name }),
      ...(label !== undefined && { label }),
      key: filterKey,
      ...(type !== undefined && { type }),
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(applicableCategories !== undefined && { applicableCategories }),
    });
  },

  /**
   * Delete filter
   */
  async deleteFilter(id) {
    const existing = await filterRepository.findById(id);
    if (!existing) {
      const err = new Error('Filter not found.');
      err.statusCode = 404;
      throw err;
    }
    return filterRepository.delete(id);
  },

  /**
   * Add a value to a filter
   */
  async addFilterValue(filterId, payload) {
    const filter = await filterRepository.findById(filterId);
    if (!filter) {
      const err = new Error('Filter not found.');
      err.statusCode = 404;
      throw err;
    }

    const { value, label, sortOrder } = payload;
    if (!label) {
      const err = new Error('Value label is required.');
      err.statusCode = 400;
      throw err;
    }

    const val = value || slugify(label);

    return filterRepository.createValue({
      filterId,
      value: val,
      label,
      sortOrder: parseInt(sortOrder) || filter.values.length + 1,
    });
  },

  /**
   * Update filter value
   */
  async updateFilterValue(filterId, valueId, payload) {
    const { value, label, sortOrder } = payload;
    return filterRepository.updateValue(valueId, {
      ...(value !== undefined && { value }),
      ...(label !== undefined && { label }),
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
    });
  },

  /**
   * Delete filter value
   */
  async deleteFilterValue(filterId, valueId) {
    return filterRepository.deleteValue(valueId);
  },
};
