import { getAuthToken } from '../../../shared/api/httpClient';

const getBaseUrl = (): string => {
  const apiBase = import.meta.env.VITE_API_URL ? String(import.meta.env.VITE_API_URL).replace(/\/+$/, '') : '';
  return apiBase ? `${apiBase}/api` : '/api';
};

export interface ExcelImportOptions {
  categoryId?: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  defaultStatus?: string;
  defaultStyle?: string;
}

export interface ExcelImportResult {
  totalRows: number;
  importedCount: number;
  updatedCount: number;
  errors: Array<{ row: number; error: string }>;
}

export interface RestoreResult {
  categories: number;
  filters: number;
  badges: number;
  pages: number;
  products: number;
}

export const dataApi = {
  /**
   * 1. Download Database JSON Snapshot
   */
  async downloadBackup(): Promise<void> {
    const token = getAuthToken();
    const url = `${getBaseUrl()}/admin/data/backup`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to download backup snapshot.');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = downloadUrl;
    link.download = `shiv-shakti-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  /**
   * 2. Restore Database from JSON Snapshot
   */
  async restoreBackup(file: File): Promise<RestoreResult> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const url = `${getBaseUrl()}/admin/data/restore`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.message || 'Failed to restore database from backup.');
    }

    return json.data?.results;
  },

  /**
   * 3. Restore Master Baseline Catalog
   */
  async restoreMaster(): Promise<{ inserted: number; updated: number; total: number }> {
    const token = getAuthToken();
    const url = `${getBaseUrl()}/admin/data/seed-master`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.message || 'Failed to restore master baseline catalog.');
    }

    return json.data?.results;
  },

  /**
   * 4. Upload & Import Excel / CSV Products with Destination Route
   */
  async importExcel(file: File, options: ExcelImportOptions): Promise<ExcelImportResult> {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    if (options.categoryId) formData.append('categoryId', options.categoryId);
    if (options.subcategoryId) formData.append('subcategoryId', options.subcategoryId);
    if (options.subSubcategoryId) formData.append('subSubcategoryId', options.subSubcategoryId);
    if (options.defaultStatus) formData.append('defaultStatus', options.defaultStatus);
    if (options.defaultStyle) formData.append('defaultStyle', options.defaultStyle);

    const url = `${getBaseUrl()}/admin/data/import-excel`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: formData,
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(json.message || 'Failed to import Excel products.');
    }

    return json.data?.results;
  },

  /**
   * 5. Download Products Export as Excel (.xlsx) - Category & Subcategory Wise
   */
  async downloadExcelExport(params: {
    categoryId?: string;
    subcategoryId?: string;
    subSubcategoryId?: string;
    status?: string;
  } = {}): Promise<void> {
    const token = getAuthToken();
    const query = new URLSearchParams();
    if (params.categoryId && params.categoryId !== 'all') query.set('categoryId', params.categoryId);
    if (params.subcategoryId && params.subcategoryId !== 'all') query.set('subcategoryId', params.subcategoryId);
    if (params.subSubcategoryId && params.subSubcategoryId !== 'all') query.set('subSubcategoryId', params.subSubcategoryId);
    if (params.status && params.status !== 'all') query.set('status', params.status);

    const url = `${getBaseUrl()}/admin/data/export-excel${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to export products.');
    }

    // Try extracting filename from Content-Disposition header
    let filename = '';
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim();
      }
    }

    if (!filename) {
      const dateStr = new Date().toISOString().slice(0, 10);
      if (params.subcategoryId && params.subcategoryId !== 'all') {
        filename = `shiv-shakti-products-${params.categoryId ? `${params.categoryId}-` : ''}${params.subcategoryId}-${dateStr}.xlsx`;
      } else if (params.categoryId && params.categoryId !== 'all') {
        filename = `shiv-shakti-products-${params.categoryId}-${dateStr}.xlsx`;
      } else {
        filename = `shiv-shakti-products-all-categories-${dateStr}.xlsx`;
      }
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  /**
   * 6. Download Sample Product Excel Template
   */
  async downloadTemplate(): Promise<void> {
    const token = getAuthToken();
    const url = `${getBaseUrl()}/admin/data/template`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || 'Failed to download template.');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'shiv_shakti_product_import_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export default dataApi;
