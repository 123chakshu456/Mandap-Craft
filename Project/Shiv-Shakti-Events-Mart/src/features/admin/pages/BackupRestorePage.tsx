import React, { useState, useEffect, useRef } from 'react';
import {
  Database,
  Upload,
  Download,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ShieldCheck,
  HardDrive,
  Info,
  Check,
  FileCode,
} from 'lucide-react';
import { categoryApi } from '../../categories/services/categoryApi';
import { dataApi, type ExcelImportResult, type RestoreResult } from '../services/dataApi';
import type { Category } from '../../../shared/types/models.types';

export const BackupRestorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'excel' | 'backup' | 'restore'>('excel');

  // Categories hierarchy for route selector
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedVerticalId, setSelectedVerticalId] = useState<string>('wedding');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [selectedSubSubcategoryId, setSelectedSubSubcategoryId] = useState<string>('');
  const [defaultStatus, setDefaultStatus] = useState<string>('PUBLISHED');
  const [defaultStyle, setDefaultStyle] = useState<string>('Traditional');

  // Excel Importer states
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isImportingExcel, setIsImportingExcel] = useState<boolean>(false);
  const [excelResult, setExcelResult] = useState<ExcelImportResult | null>(null);
  const [excelError, setExcelError] = useState<string | null>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  // Backup states
  const [isDownloadingBackup, setIsDownloadingBackup] = useState<boolean>(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState<boolean>(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState<boolean>(false);

  // Restore states
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoreResult, setRestoreResult] = useState<RestoreResult | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  // Master Baseline Seeder state
  const [isSeedingMaster, setIsSeedingMaster] = useState<boolean>(false);
  const [masterSeedResult, setMasterSeedResult] = useState<{ inserted: number; updated: number; total: number } | null>(null);
  const [masterSeedError, setMasterSeedError] = useState<string | null>(null);

  // Load category hierarchy for destination route picker
  useEffect(() => {
    categoryApi.getAdminTree().then((tree) => {
      setCategories(tree || []);
      if (tree && tree.length > 0) {
        setSelectedVerticalId(tree[0].id);
        if (tree[0].children && tree[0].children.length > 0) {
          setSelectedSubcategoryId(tree[0].children[0].id);
        }
      }
    }).catch((err) => console.error('Failed to load categories:', err));
  }, []);

  // Filtered lists based on selection
  const selectedVertical = categories.find((c) => c.id === selectedVerticalId);
  const availableSubcategories = selectedVertical?.children || [];
  const selectedSubcat = availableSubcategories.find((sc) => sc.id === selectedSubcategoryId);
  const availableSubSubcategories = selectedSubcat?.children || [];

  const handleVerticalChange = (verticalId: string) => {
    setSelectedVerticalId(verticalId);
    const vert = categories.find((c) => c.id === verticalId);
    if (vert && vert.children && vert.children.length > 0) {
      setSelectedSubcategoryId(vert.children[0].id);
      if (vert.children[0].children && vert.children[0].children.length > 0) {
        setSelectedSubSubcategoryId(vert.children[0].children[0].id);
      } else {
        setSelectedSubSubcategoryId('');
      }
    } else {
      setSelectedSubcategoryId('');
      setSelectedSubSubcategoryId('');
    }
  };

  const handleSubcategoryChange = (subcatId: string) => {
    setSelectedSubcategoryId(subcatId);
    const subcat = availableSubcategories.find((sc) => sc.id === subcatId);
    if (subcat && subcat.children && subcat.children.length > 0) {
      setSelectedSubSubcategoryId(subcat.children[0].id);
    } else {
      setSelectedSubSubcategoryId('');
    }
  };

  // 1. Handle Excel Import
  const handleExcelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      setExcelError('Please select an Excel or CSV file first.');
      return;
    }

    setIsImportingExcel(true);
    setExcelError(null);
    setExcelResult(null);

    try {
      const res = await dataApi.importExcel(excelFile, {
        categoryId: selectedVerticalId,
        subcategoryId: selectedSubcategoryId,
        subSubcategoryId: selectedSubSubcategoryId,
        defaultStatus,
        defaultStyle,
      });
      setExcelResult(res);
      setExcelFile(null);
      if (excelInputRef.current) excelInputRef.current.value = '';
    } catch (err: any) {
      setExcelError(err.message || 'Excel import failed.');
    } finally {
      setIsImportingExcel(false);
    }
  };

  // 2. Handle Backup Downloads
  const handleDownloadBackup = async () => {
    setIsDownloadingBackup(true);
    try {
      await dataApi.downloadBackup();
    } catch (err: any) {
      alert(`Download backup error: ${err.message}`);
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  const handleDownloadExcelExport = async () => {
    setIsDownloadingExcel(true);
    try {
      await dataApi.downloadExcelExport();
    } catch (err: any) {
      alert(`Excel export error: ${err.message}`);
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      await dataApi.downloadTemplate();
    } catch (err: any) {
      alert(`Template download error: ${err.message}`);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  // 3. Handle JSON Restore
  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restoreFile) {
      setRestoreError('Please select a valid .json backup file.');
      return;
    }

    if (!window.confirm('Are you sure you want to restore the database from this backup snapshot? Existing matching records will be updated.')) {
      return;
    }

    setIsRestoring(true);
    setRestoreError(null);
    setRestoreResult(null);

    try {
      const res = await dataApi.restoreBackup(restoreFile);
      setRestoreResult(res);
      setRestoreFile(null);
      if (restoreInputRef.current) restoreInputRef.current.value = '';
    } catch (err: any) {
      setRestoreError(err.message || 'Restore failed.');
    } finally {
      setIsRestoring(false);
    }
  };

  // 4. Handle Master Baseline Seed
  const handleSeedMaster = async () => {
    if (!window.confirm('This will restore all default 992 baseline catalog products from the system master files. Proceed?')) {
      return;
    }

    setIsSeedingMaster(true);
    setMasterSeedError(null);
    setMasterSeedResult(null);

    try {
      const res = await dataApi.restoreMaster();
      setMasterSeedResult(res);
    } catch (err: any) {
      setMasterSeedError(err.message || 'Master baseline restore failed.');
    } finally {
      setIsSeedingMaster(false);
    }
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto', color: '#f8fafc' }}>
      {/* ── HEADER ── */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
              }}
            >
              <Database size={20} />
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Data Management & Disaster Recovery
            </h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
            Bulk import new SKUs from Excel into specified category routes, download full database backups, and restore snapshots in 1 click.
          </p>
        </div>

        {/* System Health Badges */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: '#34d399',
              fontWeight: 600,
            }}
          >
            <ShieldCheck size={15} />
            <span>Neon PostgreSQL Connected</span>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1e293b',
          marginBottom: '28px',
          paddingBottom: '2px',
        }}
      >
        <button
          onClick={() => setActiveTab('excel')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'excel' ? '#1e293b' : 'transparent',
            color: activeTab === 'excel' ? '#a5b4fc' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'excel' ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <FileSpreadsheet size={17} />
          <span>Excel Bulk SKU Importer</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'backup' ? '#1e293b' : 'transparent',
            color: activeTab === 'backup' ? '#a5b4fc' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'backup' ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <Download size={17} />
          <span>1-Click Database Backup</span>
        </button>

        <button
          onClick={() => setActiveTab('restore')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px 8px 0 0',
            border: 'none',
            background: activeTab === 'restore' ? '#1e293b' : 'transparent',
            color: activeTab === 'restore' ? '#a5b4fc' : '#94a3b8',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: activeTab === 'restore' ? '2px solid #6366f1' : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          <RefreshCw size={17} />
          <span>Disaster Recovery & Restore</span>
        </button>
      </div>

      {/* ── TAB 1: EXCEL BULK SKU IMPORTER ── */}
      {activeTab === 'excel' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Main Importer Form Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                  Upload Excel File to Category Route
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                  Upload your Excel (.xlsx, .xls) or CSV sheet. Products will be automatically created or updated.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={isDownloadingTemplate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#a5b4fc',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Download size={14} />
                <span>{isDownloadingTemplate ? 'Downloading...' : 'Get Excel Template'}</span>
              </button>
            </div>

            <form onSubmit={handleExcelSubmit}>
              {/* Route Destination Specification */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Layers size={16} color="#818cf8" />
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.02em' }}>
                    Specify Destination Route for New SKUs
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  {/* Vertical (L1 Category) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Category Vertical *
                    </label>
                    <select
                      value={selectedVerticalId}
                      onChange={(e) => handleVerticalChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory (L2) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Subcategory *
                    </label>
                    <select
                      value={selectedSubcategoryId}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="">-- None / Root Vertical --</option>
                      {availableSubcategories.map((sc) => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub-subcategory (L3, optional) */}
                {availableSubSubcategories.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Sub-subcategory (L3 Specific Section)
                    </label>
                    <select
                      value={selectedSubSubcategoryId}
                      onChange={(e) => setSelectedSubSubcategoryId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="">-- General Subcategory --</option>
                      {availableSubSubcategories.map((ssc) => (
                        <option key={ssc.id} value={ssc.id}>
                          {ssc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Defaults Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Default Lifecycle Status
                    </label>
                    <select
                      value={defaultStatus}
                      onChange={(e) => setDefaultStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="PUBLISHED">PUBLISHED (Live on Store)</option>
                      <option value="DRAFT">DRAFT (Review First)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
                      Default Aesthetic Style
                    </label>
                    <select
                      value={defaultStyle}
                      onChange={(e) => setDefaultStyle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#f8fafc',
                        fontSize: '0.84rem',
                      }}
                    >
                      <option value="Traditional">Traditional</option>
                      <option value="Royal">Royal</option>
                      <option value="Modern">Modern</option>
                      <option value="Boho">Boho</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Bespoke">Bespoke</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* File Upload Dropzone */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>
                  Select Excel or CSV Spreadsheet
                </label>
                <div
                  onClick={() => excelInputRef.current?.click()}
                  style={{
                    border: '2px dashed #475569',
                    borderRadius: '10px',
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: excelFile ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                    borderColor: excelFile ? '#6366f1' : '#334155',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    ref={excelInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setExcelFile(e.target.files[0]);
                        setExcelError(null);
                        setExcelResult(null);
                      }
                    }}
                  />
                  {excelFile ? (
                    <div>
                      <FileSpreadsheet size={36} color="#818cf8" style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                        {excelFile.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                        {(excelFile.size / 1024).toFixed(1)} KB — Ready to import
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={32} color="#64748b" style={{ margin: '0 auto 10px' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
                        Click to select or drag & drop Excel file
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        Supports .xlsx, .xls, and .csv files
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Banner */}
              {excelError && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.82rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{excelError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isImportingExcel || !excelFile}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isImportingExcel || !excelFile ? '#334155' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: isImportingExcel || !excelFile ? '#94a3b8' : '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: isImportingExcel || !excelFile ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isImportingExcel || !excelFile ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.4)',
                }}
              >
                {isImportingExcel ? (
                  <>
                    <RefreshCw size={18} className="spin" />
                    <span>Parsing & Inserting SKUs into Database...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Import SKUs to {selectedSubcat ? selectedSubcat.name : selectedVertical?.name}</span>
                  </>
                )}
              </button>
            </form>

            {/* Results Output */}
            {excelResult && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>Import Completed Successfully!</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span>📦 <strong>{excelResult.totalRows}</strong> Rows in File</span>
                  <span>✨ <strong>{excelResult.importedCount}</strong> New SKUs Created</span>
                  <span>🔄 <strong>{excelResult.updatedCount}</strong> SKUs Updated</span>
                  {excelResult.errors.length > 0 && (
                    <span style={{ color: '#f87171' }}>⚠️ <strong>{excelResult.errors.length}</strong> Errors</span>
                  )}
                </div>

                {excelResult.errors.length > 0 && (
                  <div style={{ marginTop: '12px', maxHeight: '120px', overflowY: 'auto', fontSize: '0.75rem', color: '#fca5a5' }}>
                    {excelResult.errors.map((err, idx) => (
                      <div key={idx}>Row {err.row}: {err.error}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Guide & Instructions Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              height: 'fit-content',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Info size={18} color="#60a5fa" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Excel Format & Smart Column Mapping
              </h3>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '16px' }}>
              The importer accepts any `.xlsx` or `.csv` spreadsheet. The system automatically detects and maps column names case-insensitively:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Product Name *</span>
                <p style={{ color: '#94a3b8', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
                  Accepts columns: <code>name</code>, <code>product name</code>, <code>title</code>. Required for every row.
                </p>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>SKU Code</span>
                <p style={{ color: '#94a3b8', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
                  If omitted, auto-generated based on the vertical (e.g. <code>SKU-WED-0921</code>). Existing SKUs will be updated instead of duplicated.
                </p>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Category & Subcategory</span>
                <p style={{ color: '#94a3b8', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
                  If row has a category, it uses it; if empty, it automatically assigns the <strong>Destination Route</strong> selected on the left!
                </p>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Price & Compare Price</span>
                <p style={{ color: '#94a3b8', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
                  Accepts numbers or formatted currency (e.g. <code>45000</code> or <code>₹45,000</code>).
                </p>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid #1e293b' }}>
                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Features / Specs</span>
                <p style={{ color: '#94a3b8', margin: '3px 0 0 0', fontSize: '0.75rem' }}>
                  Separate multiple bullet points with a pipe (<code>|</code>), comma, or newline.
                </p>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={isDownloadingTemplate}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid #6366f1',
                  color: '#a5b4fc',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Download size={15} />
                <span>Download Sample Excel Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: DATABASE BACKUP SNAPSHOTS ── */}
      {activeTab === 'backup' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* 1-Click JSON Snapshot Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                }}
              >
                <Database size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Full Database Snapshot (JSON)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>All-in-one disaster recovery archive</span>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Downloads a timestamped `.json` file containing your entire website data: all <strong>Products</strong>, <strong>Categories</strong> (with 3-tier parent hierarchy), <strong>Dynamic Filters</strong>, <strong>Promotional Badges</strong>, and <strong>Website CMS Pages</strong>.
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.78rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Safely stores image galleries & facet links</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Can be re-imported into any instance or branch</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Zero downtime during snapshot export</span>
              </div>
            </div>

            <button
              onClick={handleDownloadBackup}
              disabled={isDownloadingBackup}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isDownloadingBackup ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              }}
            >
              {isDownloadingBackup ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  <span>Generating Full Snapshot...</span>
                </>
              ) : (
                <>
                  <Download size={17} />
                  <span>Download Full Database Backup (.json)</span>
                </>
              )}
            </button>
          </div>

          {/* Export Catalog to Excel Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                }}
              >
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Export Products to Excel (.xlsx)
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Spreadsheet for offline inventory editing</span>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Exports your active catalog of SKUs into a clean, formatted Microsoft Excel workbook. Includes SKU, product names, categories, pricing, stock statuses, descriptions, and features.
            </p>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '0.78rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Compatible with Microsoft Excel, Google Sheets, LibreOffice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Easily edit prices or descriptions offline & re-upload</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontWeight: 600 }}>
                <Check size={14} color="#34d399" />
                <span>Maintains proper column headers for instant re-import</span>
              </div>
            </div>

            <button
              onClick={handleDownloadExcelExport}
              disabled={isDownloadingExcel}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isDownloadingExcel ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              }}
            >
              {isDownloadingExcel ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  <span>Generating Excel File...</span>
                </>
              ) : (
                <>
                  <Download size={17} />
                  <span>Download Catalog as Excel (.xlsx)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: DISASTER RECOVERY & RESTORE ── */}
      {activeTab === 'restore' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Restore from JSON File Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                }}
              >
                <Upload size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Restore from JSON Backup File
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Safely restore all tables with upsert</span>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '16px' }}>
              Select a previously exported `.json` database snapshot file. The system will restore missing categories, products, filters, badges, and CMS pages without dropping other data.
            </p>

            <form onSubmit={handleRestoreSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <div
                  onClick={() => restoreInputRef.current?.click()}
                  style={{
                    border: '2px dashed #475569',
                    borderRadius: '10px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: restoreFile ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                    borderColor: restoreFile ? '#6366f1' : '#334155',
                  }}
                >
                  <input
                    ref={restoreInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setRestoreFile(e.target.files[0]);
                        setRestoreError(null);
                        setRestoreResult(null);
                      }
                    }}
                  />
                  {restoreFile ? (
                    <div>
                      <FileCode size={32} color="#818cf8" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                        {restoreFile.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        {(restoreFile.size / 1024).toFixed(1)} KB — Ready to restore
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} color="#64748b" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#cbd5e1' }}>
                        Click to select backup JSON file
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                        Must be a valid Shiv Shakti backup file
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {restoreError && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontSize: '0.8rem',
                    marginBottom: '14px',
                  }}
                >
                  {restoreError}
                </div>
              )}

              <button
                type="submit"
                disabled={isRestoring || !restoreFile}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isRestoring || !restoreFile ? '#334155' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: isRestoring || !restoreFile ? '#94a3b8' : '#fff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: isRestoring || !restoreFile ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isRestoring ? (
                  <>
                    <RefreshCw size={17} className="spin" />
                    <span>Restoring Database Entities...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={17} />
                    <span>Upload & Restore Database</span>
                  </>
                )}
              </button>
            </form>

            {restoreResult && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Restore Finished Successfully!</span>
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  Restored {restoreResult.products} products, {restoreResult.categories} categories, {restoreResult.filters} filters, {restoreResult.badges} badges, and {restoreResult.pages} pages.
                </div>
              </div>
            )}
          </div>

          {/* Re-seed Master Baseline Catalog Card */}
          <div
            style={{
              background: '#0d1526',
              border: '1px solid #1e293b',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                }}
              >
                <HardDrive size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                  Re-seed Master Baseline Catalog
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fallback to default 992 baseline catalog</span>
              </div>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '16px' }}>
              If your database was wiped or emptied, you can click this button to automatically reload the complete baseline catalog directly from the server’s master seed files without running terminal scripts.
            </p>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '20px',
                fontSize: '0.78rem',
                color: '#fde68a',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                Existing products with matching names/SKUs will be preserved or refreshed with baseline specs.
              </div>
            </div>

            {masterSeedError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontSize: '0.8rem',
                  marginBottom: '14px',
                }}
              >
                {masterSeedError}
              </div>
            )}

            <button
              onClick={handleSeedMaster}
              disabled={isSeedingMaster}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                background: isSeedingMaster ? '#334155' : 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isSeedingMaster ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSeedingMaster ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  <span>Reloading Master Baseline Catalog...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={17} />
                  <span>Restore Master Baseline Catalog (992 SKUs)</span>
                </>
              )}
            </button>

            {masterSeedResult && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.82rem',
                }}
              >
                <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Baseline Restored Successfully!</span>
                </div>
                <div style={{ color: '#cbd5e1' }}>
                  Processed {masterSeedResult.total} items: {masterSeedResult.inserted} inserted, {masterSeedResult.updated} refreshed.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupRestorePage;
