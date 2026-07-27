import { test } from 'node:test';
import assert from 'node:assert/strict';
import { efiVarsFileName } from './config.js';

// The blank-display bug was caused by copying the OVMF CODE firmware into the
// writable vars pflash. These tests pin the correct VARS template per guest arch.

test('efiVarsFileName: x86_64 uses the i386 VARS template (not the CODE firmware)', () => {
  assert.equal(efiVarsFileName('x86_64'), 'edk2-i386-vars.fd');
});

test('efiVarsFileName: aarch64 uses the arm VARS template', () => {
  assert.equal(efiVarsFileName('aarch64'), 'edk2-arm-vars.fd');
});
