export class Identity {
  public role: string
  public emailAddress: string
  public avatarUrl: string
  public niceName: string
  public nonce: string | null
  public expiration: string

  constructor(
    _role: string,
    _emailAddress: string,
    _avatarUrl: string,
    _niceName: string,
    _nonce: string | null,
    _expiration: string
  ) {
    this.role = _role
    this.emailAddress = _emailAddress
    this.avatarUrl = _avatarUrl
    this.niceName = _niceName
    this.nonce = _nonce
    this.expiration = _expiration
  }

  static parse(json: string) {
    try {
      const data = JSON.parse(json)
      return new Identity(
        data.role,
        data.emailAddress,
        data.avatarUrl,
        data.niceName,
        data.nonce,
        data.expiration
      )
    } catch (e) {
      return null
    }
  }
}
