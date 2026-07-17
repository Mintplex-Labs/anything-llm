import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMachineArgs, gpuDeviceArgs, isoDeviceArgs } from './vm.js';

// These tests lock in the Windows x64 (WHPX) behavior and, just as importantly,
// prove the macOS/Linux paths are unchanged (no VGA, no q35-only ide-cd bus).

test('buildMachineArgs: Windows x86_64 uses WHPX with a Haswell CPU, not host', () => {
  // -cpu host exposes APX/MPX on recent AMD CPUs, which WHPX rejects with
  // "Unexpected VP exit code 4".
  assert.deepEqual(
    buildMachineArgs('win32', 'x86_64'),
    ['-machine', 'q35', '-accel', 'whpx', '-cpu', 'Haswell'],
  );
});

test('buildMachineArgs: Windows aarch64 keeps host passthrough', () => {
  assert.deepEqual(
    buildMachineArgs('win32', 'aarch64'),
    ['-machine', 'virt,highmem=on', '-accel', 'whpx', '-cpu', 'host'],
  );
});

test('buildMachineArgs: macOS uses HVF with host for both guest arches', () => {
  assert.deepEqual(
    buildMachineArgs('darwin', 'aarch64'),
    ['-machine', 'virt,highmem=on', '-accel', 'hvf', '-cpu', 'host'],
  );
  assert.deepEqual(
    buildMachineArgs('darwin', 'x86_64'),
    ['-machine', 'q35', '-accel', 'hvf', '-cpu', 'host'],
  );
});

test('buildMachineArgs: Linux uses KVM with host', () => {
  assert.deepEqual(
    buildMachineArgs('linux', 'x86_64'),
    ['-machine', 'q35', '-accel', 'kvm', '-cpu', 'host'],
  );
});

test('gpuDeviceArgs: Windows uses standard VGA, other platforms use virtio-gpu', () => {
  assert.deepEqual(gpuDeviceArgs('win32'), ['-device', 'VGA']);
  assert.deepEqual(gpuDeviceArgs('darwin'), ['-device', 'virtio-gpu-pci']);
  assert.deepEqual(gpuDeviceArgs('linux'), ['-device', 'virtio-gpu-pci']);
});

test('isoDeviceArgs: attaches a bootable USB CD-ROM only on Windows', () => {
  const win = isoDeviceArgs('/tmp/debian.iso', 'win32');
  assert.ok(win.includes('usb-storage,drive=install-cdrom'));
  assert.ok(win.some((s) => s.includes('media=cdrom')));
  assert.ok(win.some((s) => s.includes('/tmp/debian.iso')));
});

test('isoDeviceArgs: no CD-ROM on macOS/Linux', () => {
  assert.deepEqual(isoDeviceArgs('/tmp/debian.iso', 'darwin'), []);
  assert.deepEqual(isoDeviceArgs('/tmp/debian.iso', 'linux'), []);
});

test('isoDeviceArgs: no CD-ROM when no ISO is provided', () => {
  assert.deepEqual(isoDeviceArgs(undefined, 'win32'), []);
});
