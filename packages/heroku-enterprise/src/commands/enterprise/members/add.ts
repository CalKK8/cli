import {color} from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import {cli} from 'cli-ux'

import {Accounts} from '../../../completions'

export default class Add extends Command {
  static description = 'add a member to an enterprise account'

  static examples = [
    '$ heroku enterprise:members:add member-email --enterprise-account=account-name --permissions=billing,create,manage,view',
  ]

  static aliases = ['enterprise:members-add']

  static args = [
    {name: 'email', required: true},
  ]

  static flags = {
    'enterprise-account': flags.string({
      completion: Accounts,
      char: 'e',
      description: 'enterprise account name',
      required: true
    }),
    permissions: flags.string({
      char: 'p',
      description: 'permissions to grant the member (comma-separated)',
      required: true}),
  }

  async run() {
    const {args, flags} = this.parse(Add)
    const enterpriseAccount = flags['enterprise-account']
    const member = args.email
    const permissions = flags.permissions.split(',')
    const formattedEmail = color.cyan(member)
    const formattedAccount = color.green(enterpriseAccount)

    const params = {body: {user: member, permissions}}
    cli.action.start(`Adding ${formattedEmail} to ${formattedAccount}`)
    await this.heroku.post(`/enterprise-accounts/${enterpriseAccount}/members`, params)
    cli.action.stop()
  }
}