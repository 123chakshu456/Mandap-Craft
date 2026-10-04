import dataManagementService from './dataManagement.service.js';
import { successResponse, errorResponse } from '../../shared/utils/response.js';

export const dataManagementController = {
  /**
   * Export Full Database Snapshot (JSON)
   */
  async downloadBackup(req, res) {
    try {
      const backupData = await dataManagementService.generateFullBackup();
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `shiv-shakti-backup-${dateStr}.json`;

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(JSON.stringify(backupData, null, 2));
    } catch (err) {
      console.error('Backup generation error:', err);
      return errorResponse(res, `Failed to generate database backup: ${err.message}`, 500);
    }
  },

  /**
   * Restore Database from JSON Snapshot
   */
  async restoreBackup(req, res) {
    try {
      let snapshotData = null;

      if (req.file) {
        // Uploaded via multipart/form-data
        const jsonContent = req.file.buffer.toString('utf8');
        snapshotData = JSON.parse(jsonContent);
      } else if (req.body && (req.body.products || req.body.categories)) {
        // Sent as raw JSON body
        snapshotData = req.body;
      } else {
        return errorResponse(res, 'No backup file or valid JSON snapshot provided.', 400);
      }

      const results = await dataManagementService.restoreFullBackup(snapshotData, req.user);
      return successResponse(res, 'Database successfully restored from snapshot.', { results });
    } catch (err) {
      console.error('Restore error:', err);
      return errorResponse(res, `Failed to restore database: ${err.message}`, 500);
    }
  },

  /**
   * Restore Base Master Catalog
   */
  async seedMaster(req, res) {
    try {
      const results = await dataManagementService.restoreMasterBaseline(req.user);
      return successResponse(res, 'Master baseline catalog successfully restored.', { results });
    } catch (err) {
      console.error('Master seed error:', err);
      return errorResponse(res, `Failed to restore master catalog: ${err.message}`, 500);
    }
  },

  /**
   * Import Products from Excel / CSV with Destination Route
   */
  async importExcel(req, res) {
    try {
      if (!req.file || !req.file.buffer) {
        return errorResponse(res, 'Please upload an Excel (.xlsx, .xls) or CSV file.', 400);
      }

      const destinationRoute = {
        categoryId: req.body.categoryId || '',
        subcategoryId: req.body.subcategoryId || '',
        subSubcategoryId: req.body.subSubcategoryId || '',
      };

      const options = {
        defaultStatus: req.body.defaultStatus || 'PUBLISHED',
        defaultStyle: req.body.defaultStyle || 'Traditional',
      };

      const results = await dataManagementService.parseAndImportExcel(
        req.file.buffer,
        destinationRoute,
        options,
        req.user
      );

      return successResponse(res, `Excel import completed: ${results.importedCount} new SKUs added, ${results.updatedCount} updated.`, { results });
    } catch (err) {
      console.error('Excel import error:', err);
      return errorResponse(res, `Failed to import Excel products: ${err.message}`, 500);
    }
  },

  /**
   * Export All Products to Excel (.xlsx) - Category & Subcategory Wise
   */
  async exportProductsExcel(req, res) {
    try {
      const { categoryId, subcategoryId, subSubcategoryId, status } = req.query;
      const buffer = await dataManagementService.exportProductsExcel({
        categoryId,
        subcategoryId,
        subSubcategoryId,
        status,
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      let filename = `shiv-shakti-products-${dateStr}.xlsx`;

      if (subcategoryId && subcategoryId !== 'all') {
        filename = `products-${categoryId ? `${categoryId}-` : ''}${subcategoryId}-${dateStr}.xlsx`;
      } else if (categoryId && categoryId !== 'all') {
        filename = `products-${categoryId}-${dateStr}.xlsx`;
      } else {
        filename = `products-all-categories-${dateStr}.xlsx`;
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      return res.status(200).send(buffer);
    } catch (err) {
      console.error('Excel export error:', err);
      return errorResponse(res, `Failed to export products to Excel: ${err.message}`, 500);
    }
  },

  /**
   * Download Sample Product Excel Template
   */
  async downloadTemplate(req, res) {
    try {
      const buffer = await dataManagementService.generateExcelTemplate();
      const filename = 'shiv_shakti_product_import_template.xlsx';

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(buffer);
    } catch (err) {
      console.error('Template download error:', err);
      return errorResponse(res, `Failed to generate Excel template: ${err.message}`, 500);
    }
  },
};

export default dataManagementController;
