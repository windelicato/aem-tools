# aem-tools-cli

AEM Development Tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/aem-tools-cli.svg)](https://npmjs.org/package/aem-tools-cli)
[![Downloads/week](https://img.shields.io/npm/dw/aem-tools-cli.svg)](https://npmjs.org/package/aem-tools-cli)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g aem-tools-cli
$ aem COMMAND
running command...
$ aem (--version)
aem-tools-cli/0.0.0 darwin-x64 node-v22.14.0
$ aem --help [COMMAND]
USAGE
  $ aem COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`aem hello PERSON`](#aem-hello-person)
- [`aem hello world`](#aem-hello-world)
- [`aem help [COMMAND]`](#aem-help-command)
- [`aem plugins`](#aem-plugins)
- [`aem plugins add PLUGIN`](#aem-plugins-add-plugin)
- [`aem plugins:inspect PLUGIN...`](#aem-pluginsinspect-plugin)
- [`aem plugins install PLUGIN`](#aem-plugins-install-plugin)
- [`aem plugins link PATH`](#aem-plugins-link-path)
- [`aem plugins remove [PLUGIN]`](#aem-plugins-remove-plugin)
- [`aem plugins reset`](#aem-plugins-reset)
- [`aem plugins uninstall [PLUGIN]`](#aem-plugins-uninstall-plugin)
- [`aem plugins unlink [PLUGIN]`](#aem-plugins-unlink-plugin)
- [`aem plugins update`](#aem-plugins-update)

## `aem hello PERSON`

Say hello

```
USAGE
  $ aem hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ aem hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/windelicato/aem-tools-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `aem hello world`

Say hello world

```
USAGE
  $ aem hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ aem hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/windelicato/aem-tools-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `aem help [COMMAND]`

Display help for aem.

```
USAGE
  $ aem help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for aem.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.28/src/commands/help.ts)_

## `aem plugins`

List installed plugins.

```
USAGE
  $ aem plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ aem plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/index.ts)_

## `aem plugins add PLUGIN`

Installs a plugin into aem.

```
USAGE
  $ aem plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into aem.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the AEM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AEM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ aem plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ aem plugins add myplugin

  Install a plugin from a github url.

    $ aem plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ aem plugins add someuser/someplugin
```

## `aem plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ aem plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ aem plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/inspect.ts)_

## `aem plugins install PLUGIN`

Installs a plugin into aem.

```
USAGE
  $ aem plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into aem.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the AEM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the AEM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ aem plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ aem plugins install myplugin

  Install a plugin from a github url.

    $ aem plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ aem plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/install.ts)_

## `aem plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ aem plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ aem plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/link.ts)_

## `aem plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ aem plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ aem plugins unlink
  $ aem plugins remove

EXAMPLES
  $ aem plugins remove myplugin
```

## `aem plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ aem plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/reset.ts)_

## `aem plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ aem plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ aem plugins unlink
  $ aem plugins remove

EXAMPLES
  $ aem plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/uninstall.ts)_

## `aem plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ aem plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ aem plugins unlink
  $ aem plugins remove

EXAMPLES
  $ aem plugins unlink myplugin
```

## `aem plugins update`

Update installed plugins.

```
USAGE
  $ aem plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.40/src/commands/plugins/update.ts)_

<!-- commandsstop -->
