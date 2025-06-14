import {Command, Flags} from '@oclif/core'
import {loadConfigSync, runMaven} from 'aem-tools-core'

export default class Maven extends Command {
  static description = 'Run Maven commands in an AEM project.'
  static flags = {
    dryRun: Flags.boolean({description: 'Print the command instead of running it'}),
    module: Flags.string({char: 'm', description: 'Module name or path'}),
    profile: Flags.string({char: 'P', description: 'Maven profile to use'}),
    skipTests: Flags.boolean({description: 'Skip tests during Maven build'}),
  }

  async run() {
    const {flags} = await this.parse(Maven)
    const config = loadConfigSync()
    await runMaven(config, {
      dryRun: flags.dryRun,
      module: flags.module,
      profile: flags.profile,
      skipTests: flags.skipTests,
    })
  }
}
