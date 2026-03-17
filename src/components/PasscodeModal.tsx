/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shield, Lock, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PasscodeModalProps {
  mode: 'set' | 'change' | 'remove';
  currentPasscode?: string;
  onSave: (passcode: string | null) => void;
  onClose: () => void;
}

export default function PasscodeModal({ mode, currentPasscode, onSave, onClose }: PasscodeModalProps) {
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>(mode === 'set' ? 'new' : 'current');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [oldPasscode, setOldPasscode] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    setError('');
    
    if (step === 'current') {
      if (oldPasscode === currentPasscode) {
        if (mode === 'remove') {
          onSave(null);
        } else {
          setStep('new');
        }
      } else {
        setError('Incorrect current passcode');
      }
    } else if (step === 'new') {
      if (passcode.length >= 4 && passcode.length <= 6) {
        setStep('confirm');
      } else {
        setError('Passcode must be 4-6 digits');
      }
    } else if (step === 'confirm') {
      if (passcode === confirmPasscode) {
        onSave(passcode);
      } else {
        setError('Passcodes do not match');
      }
    }
  };

  const renderInput = (value: string, onChange: (v: string) => void, label: string) => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
        <p className="text-sm text-gray-500">Enter a 4-6 digit numeric code</p>
      </div>
      
      <div className="flex justify-center gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
              i < value.length 
                ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold' 
                : 'border-gray-100 bg-gray-50'
            } ${i >= 6 ? 'hidden' : ''}`}
          >
            {i < value.length ? '•' : ''}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => {
          if (num === '') return <div key={i} />;
          if (num === 'del') return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(value.slice(0, -1))}
              className="h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 active:bg-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          );
          return (
            <button
              key={i}
              type="button"
              onClick={() => value.length < 6 && onChange(value + num)}
              className="h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-900 active:bg-gray-200 transition-colors"
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-md rounded-t-[32px] p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'set' ? 'Set Passcode' : mode === 'change' ? 'Change Passcode' : 'Remove Passcode'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="min-h-[400px]">
          {step === 'current' && renderInput(oldPasscode, setOldPasscode, 'Enter Current Passcode')}
          {step === 'new' && renderInput(passcode, setPasscode, 'Enter New Passcode')}
          {step === 'confirm' && renderInput(confirmPasscode, setConfirmPasscode, 'Confirm New Passcode')}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-blue-600 text-sm font-medium justify-center mt-4"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={
                (step === 'current' && oldPasscode.length < 4) ||
                (step === 'new' && passcode.length < 4) ||
                (step === 'confirm' && confirmPasscode.length < 4)
              }
              className="w-full bg-[#007AFF] text-white font-bold py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:bg-gray-300"
            >
              {step === 'confirm' ? 'Save Passcode' : mode === 'remove' && step === 'current' ? 'Remove' : 'Next'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
