/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Share2, Download, Copy, Check, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { exportAppData, importAppData } from '../services/storage';

export default function SyncSection() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleExport = () => {
    const data = exportAppData();
    setExportString(data);
    setShowExportModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportClick = () => {
    if (!importString.trim()) {
      setError('Please paste the data code first.');
      return;
    }
    setConfirming(true);
  };

  const executeImport = () => {
    const success = importAppData(importString);
    if (success) {
      // Small delay to show success if needed, but reload is better
      window.location.reload();
    } else {
      setError('Invalid data format. Please check the code and try again.');
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Share2 size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Data Sync</h3>
            <p className="text-xs text-gray-500">Share data between devices</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 leading-relaxed">
            <p className="font-bold mb-1 text-gray-700">How it works:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Tap <strong>Export</strong> on the main device.</li>
              <li>Copy the generated code and send it to the other device.</li>
              <li>Tap <strong>Import</strong> on the other device and paste the code.</li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-2xl font-bold text-gray-700 active:scale-95 transition-transform"
            >
              <Share2 size={18} />
              Export
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center justify-center gap-2 bg-[#007AFF] py-3 rounded-2xl font-bold text-white active:scale-95 transition-transform"
            >
              <Download size={18} />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Export Data</h3>
                  <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Copy this code and send it to your other device.</p>
                <div className="relative">
                  <textarea
                    readOnly
                    value={exportString}
                    className="w-full h-40 bg-gray-50 border-none rounded-2xl p-4 text-[10px] font-mono text-gray-600 resize-none focus:ring-0"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute bottom-3 right-3 flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform"
                  >
                    {copied ? <Check size={14} className="text-blue-500" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Import Data</h3>
                  <button onClick={() => {
                    setShowImportModal(false);
                    setError('');
                    setImportString('');
                    setConfirming(false);
                  }} className="p-2 hover:bg-gray-100 rounded-full">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Paste the code you received from your other device.</p>
                
                <textarea
                  value={importString}
                  onChange={(e) => {
                    setImportString(e.target.value);
                    setError('');
                  }}
                  placeholder="Paste code here..."
                  className="w-full h-40 bg-gray-50 border-none rounded-2xl p-4 text-[10px] font-mono text-gray-600 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {error && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600 text-xs font-medium">
                    <AlertTriangle size={14} />
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <AlertTriangle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-tight">
                      <strong>Warning:</strong> Importing data will permanently delete all current records on this device.
                    </p>
                  </div>
                  
                  {!confirming ? (
                    <button
                      onClick={handleImportClick}
                      className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
                    >
                      Import Data
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={executeImport}
                        className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform"
                      >
                        Yes, Replace All Data
                      </button>
                      <button
                        onClick={() => setConfirming(false)}
                        className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-2xl active:scale-[0.98] transition-transform"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
