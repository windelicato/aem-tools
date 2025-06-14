import { runMaven } from './index';
import { MavenProject } from './project';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock dependencies
vi.mock('./project');
vi.mock('./module');
vi.mock('child_process');

const mockProject = {
  get: vi.fn(),
  getAll: vi.fn(),
  root: { absolutePath: '/root', profiles: ['default'] },
};

let config: import('../config').ResolvedConfig;

describe('runMaven', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (MavenProject.findProject as unknown as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(mockProject);
    mockProject.get.mockReset();
    mockProject.getAll.mockReset();
    config = {
      maven: {
        mavenInstallCommand: 'clean install',
        mavenArguments: '',
        skipTests: false,
        dryRun: false,
        defaultGoal: 'install',
        outputMode: 'terminal',
      },
      sdk: {
        sdkHome: '/root',
        instances: [
          { name: 'author', port: 4502, debugPort: 5005, debug: false },
          { name: 'publish', port: 4503, debugPort: 5006, debug: false },
        ],
        requiredJavaVersion: 11,
        passwordFile: 'aem-password',
        jvmOpts: '-Djava.awt.headless=true',
        jvmDebugBaseOpts: '-Djava.awt.headless=true -agentlib:jdwp=transport=dt_socket,server=y,suspend=n',
        quickstartPath: '',
        formsAddonPath: '',
      },
      scaffold: {
        scaffoldArgs: '',
        archetypePluginVersion: '3.3.1',
      },
    };
  });

  it('runs maven in dry run mode with explicit module', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { module: '/mod', dryRun: true });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[DRY RUN]'));
    logSpy.mockRestore();
  });

  it('runs maven in dry run mode with cwd module resolution', async () => {
    mockProject.get.mockReturnValue(undefined);
    mockProject.getAll.mockReturnValue([
      { absolutePath: '/root', profiles: ['profile1'] },
      { absolutePath: '/root/mod', profiles: ['profile2'] },
    ]);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { dryRun: true });
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[DRY RUN]'));
    logSpy.mockRestore();
  });

  it('prints error if no project found', async () => {
    (MavenProject.findProject as unknown as ReturnType<typeof vi.fn>) = vi.fn().mockResolvedValue(null);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await runMaven(config, { dryRun: true });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find a Maven project'));
    errorSpy.mockRestore();
  });

  it('prints error if no target module found', async () => {
    mockProject.get.mockReturnValue(undefined);
    mockProject.getAll.mockReturnValue([]);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await runMaven(config, { module: '/notfound', dryRun: true });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Could not determine target Maven module'));
    errorSpy.mockRestore();
  });

  it('runs maven with Windows-style paths', async () => {
    // Simulate a Windows path for cwd and module
    const winCwd = 'C:\\repo\\project';
    const winModule = 'C:\\repo\\project\\ui.apps';
    mockProject.get.mockReturnValue({ absolutePath: winModule, profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(
      {
        ...config,
        sdk: {
          ...config.sdk,
          sdkHome: winCwd,
        },
      },
      { module: winModule, dryRun: true },
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[DRY RUN]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('mvn'));
    expect(logSpy.mock.calls[0][0]).toMatch(/C:\\repo\\project\\ui\.apps/);
    logSpy.mockRestore();
  });

  it('runs maven with Windows-style paths and resolves module by cwd', async () => {
    const winCwd = 'C:\\repo\\project\\ui.apps';
    mockProject.get.mockReturnValue(undefined);
    mockProject.getAll.mockReturnValue([
      { absolutePath: 'C:\\repo\\project', profiles: ['profile1'] },
      { absolutePath: 'C:\\repo\\project\\ui.apps', profiles: ['profile2'] },
    ]);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(
      {
        ...config,
        sdk: {
          ...config.sdk,
          sdkHome: winCwd,
        },
      },
      { dryRun: true },
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[DRY RUN]'));
    expect(logSpy.mock.calls[0][0]).toMatch(/C:\\repo\\project\\ui\.apps/);
    logSpy.mockRestore();
  });

  it('runs maven with custom mavenInstallCommand and mavenArguments from config', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(
      {
        ...config,
        maven: {
          ...config.maven,
          mavenInstallCommand: 'verify',
          mavenArguments: '--debug',
        },
      },
      { module: '/mod', dryRun: true },
    );
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('mvn --debug verify'));
    logSpy.mockRestore();
  });

  it('adds -DskipTests when skipTests is true in opts', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { module: '/mod', dryRun: true, skipTests: true });
    expect(logSpy.mock.calls[0][0]).toContain('-DskipTests');
    logSpy.mockRestore();
  });

  it('adds -DskipTests when skipTests is true in config', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(
      {
        ...config,
        maven: {
          ...config.maven,
          skipTests: true,
        },
      },
      { module: '/mod', dryRun: true },
    );
    expect(logSpy.mock.calls[0][0]).toContain('-DskipTests');
    logSpy.mockRestore();
  });

  it('profile flag is set from opts.profile', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['profile1'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { module: '/mod', dryRun: true, profile: 'customProfile' });
    expect(logSpy.mock.calls[0][0]).toContain('-PcustomProfile');
    logSpy.mockRestore();
  });

  it('profile flag is set from module profiles if no opts.profile', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: ['autoInstallPackage'] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { module: '/mod', dryRun: true });
    expect(logSpy.mock.calls[0][0]).toContain('-PautoInstallPackage');
    logSpy.mockRestore();
  });

  it('does not set profile flag if no profile present', async () => {
    mockProject.get.mockReturnValue({ absolutePath: '/mod', profiles: [] });
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(config, { module: '/mod', dryRun: true });
    expect(logSpy.mock.calls[0][0]).not.toContain('-P');
    logSpy.mockRestore();
  });

  it('command includes correct directory for deeply nested cwd', async () => {
    const deepCwd = '/repo/project/ui.apps/deep/nested';
    mockProject.get.mockReturnValue(undefined);
    mockProject.getAll.mockReturnValue([
      { absolutePath: '/repo/project', profiles: ['profile1'] },
      { absolutePath: '/repo/project/ui.apps', profiles: ['profile2'] },
    ]);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await runMaven(
      {
        ...config,
        sdk: {
          ...config.sdk,
          sdkHome: deepCwd,
        },
      },
      { dryRun: true },
    );
    expect(logSpy.mock.calls[0][0]).toMatch(/ui\.apps/);
    logSpy.mockRestore();
  });
});
