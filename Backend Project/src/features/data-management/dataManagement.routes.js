import express from 'express';
import multer from 'multer';
import dataManagementController from './dataManagement.controller.js';
import { authenticate, authorize } from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
});

// All data management endpoints require Admin authentication
router.use(authenticate, authorize('ADMIN'));

// 1-Click JSON Snapshot Backup
router.get('/backup', dataManagementController.downloadBackup);

// 1-Click Restore JSON Snapshot
router.post('/restore', upload.single('file'), dataManagementController.restoreBackup);

// 1-Click Restore Master Baseline
router.post('/seed-master', dataManagementController.seedMaster);

// Excel / CSV Bulk SKU Import with Destination Route
router.post('/import-excel', upload.single('file'), dataManagementController.importExcel);

// Export Catalog to Excel (.xlsx)
router.get('/export-excel', dataManagementController.exportProductsExcel);

// Download Sample Product Template (.xlsx)
router.get('/template', dataManagementController.downloadTemplate);

export default router;
