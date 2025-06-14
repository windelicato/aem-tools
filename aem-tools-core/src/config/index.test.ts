import { configSchema, loadConfigAsync, loadConfigSync, mergeConfig, resolveSchema } from './index';
import fs from 'fs';
import path from 'path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

describe('config system', () => {
  beforeAll(() => {
    // Remove all AEM_ env vars to ensure test isolation for all tests
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('AEM_')) delete process.env[key];
    });
  });
  const tempConfigPath = path.join(__dirname, 'test.aemrc.json');
  const sampleConfig = {
    maven: { skipTests: true, mavenArguments: '-X' },
    scaffold: { scaffoldArgs: '--foo' },
    sdk: { sdkHome: '/tmp/sdk', requiredJavaVersion: 17 },
  };

  afterEach(() => {
    if (fs.existsSync(tempConfigPath)) fs.unlinkSync(tempConfigPath);
  });

  it('should resolve config with defaults when no file exists', () => {
    const config = loadConfigSync('nonexistent.aemrc.json');
    expect(config.maven).toHaveProperty('skipTests');
    expect(config.scaffold).toHaveProperty('scaffoldArgs');
    expect(config.sdk).toHaveProperty('sdkHome');
  });

  it('should resolve config from file (sync)', () => {
    fs.writeFileSync(tempConfigPath, JSON.stringify(sampleConfig));
    const config = loadConfigSync(tempConfigPath);
    expect(config.maven.skipTests).toBe(true);
    expect(config.maven.mavenArguments).toBe('-X');
    expect(config.scaffold.scaffoldArgs).toBe('--foo');
    expect(config.sdk.sdkHome).toBe('/tmp/sdk');
    expect(config.sdk.requiredJavaVersion).toBe(17);
  });

  it('should resolve config from file (async)', async () => {
    fs.writeFileSync(tempConfigPath, JSON.stringify(sampleConfig));
    const config = await loadConfigAsync(tempConfigPath);
    expect(config.maven.skipTests).toBe(true);
    expect(config.scaffold.scaffoldArgs).toBe('--foo');
    expect(config.sdk.sdkHome).toBe('/tmp/sdk');
    expect(config.sdk.requiredJavaVersion).toBe(17);
  });

  it('should merge configs deeply', () => {
    const base = {
      maven: { skipTests: false, mavenArguments: '' },
      scaffold: { scaffoldArgs: '' },
      sdk: { sdkHome: '/a', requiredJavaVersion: 11 },
    };
    const override = {
      maven: { skipTests: true, mavenArguments: '' },
      scaffold: { scaffoldArgs: '' },
      sdk: { sdkHome: '/a', requiredJavaVersion: 17 },
    };
    const merged = mergeConfig(base, override);
    expect(merged.maven.skipTests).toBe(true);
    expect(merged.maven.mavenArguments).toBe('');
    expect(merged.sdk.sdkHome).toBe('/a');
    expect(merged.sdk.requiredJavaVersion).toBe(17);
  });

  it('should expose configSchema for introspection', () => {
    expect(configSchema).toHaveProperty('maven');
    expect(configSchema).toHaveProperty('scaffold');
    expect(configSchema).toHaveProperty('sdk');
  });

  it('should resolve schema from arbitrary fileData', () => {
    const fileData = { maven: { skipTests: false }, scaffold: {}, sdk: {} };
    const resolved = resolveSchema(fileData);
    expect(resolved.maven.skipTests).toBe(false);
    expect(resolved.scaffold).toHaveProperty('scaffoldArgs');
    expect(resolved.sdk).toHaveProperty('sdkHome');
  });
});

describe('windows path compatibility', () => {
  const winConfigPath = 'C:\\tmp\\test.aemrc.json';
  const winSampleConfig = {
    maven: { skipTests: true, mavenArguments: '-X' },
    scaffold: { scaffoldArgs: '--foo' },
    sdk: { sdkHome: 'C:/tmp/sdk', requiredJavaVersion: 17 },
  };

  afterEach(() => {
    if (fs.existsSync(winConfigPath)) fs.unlinkSync(winConfigPath);
  });

  it('should resolve config from file (sync) with windows path', () => {
    fs.writeFileSync(winConfigPath, JSON.stringify(winSampleConfig));
    const config = loadConfigSync(winConfigPath);
    expect(config.maven.skipTests).toBe(true);
    expect(config.maven.mavenArguments).toBe('-X');
    expect(config.scaffold.scaffoldArgs).toBe('--foo');
    expect(config.sdk.sdkHome).toBe('C:/tmp/sdk');
    expect(config.sdk.requiredJavaVersion).toBe(17);
  });

  it('should resolve config from file (async) with windows path', async () => {
    fs.writeFileSync(winConfigPath, JSON.stringify(winSampleConfig));
    const config = await loadConfigAsync(winConfigPath);
    expect(config.maven.skipTests).toBe(true);
    expect(config.maven.mavenArguments).toBe('-X');
    expect(config.scaffold.scaffoldArgs).toBe('--foo');
    expect(config.sdk.sdkHome).toBe('C:/tmp/sdk');
    expect(config.sdk.requiredJavaVersion).toBe(17);
  });
});
