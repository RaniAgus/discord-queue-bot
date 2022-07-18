export interface BotBaseHandler<D, I> {
  data: D
  hasPermissions(interaction: I): boolean
  handle(interaction: I): Promise<void>
}
