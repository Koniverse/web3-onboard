import type { ConnectionInfo } from 'ethers/lib/utils'
import type EventEmitter from 'eventemitter3'
import type { TypedData as EIP712TypedData } from 'eip-712'
import type { ethers } from 'ethers'
export type { TypedData as EIP712TypedData } from 'eip-712'
import type { Signer, SignerResult } from '@polkadot/types/types';


/**
 * Types for request patching methods. Ethereum RPC request is mapped to
 * the implementation that will replace the original.
 * If a method is not supported set it to `null`
 * and the appropriate error will get called.
 */
export type RequestPatch = {
  eth_accounts?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
  }) => Promise<ProviderAccounts>)
      | null
  eth_getBalance?:
      | ((args: { baseRequest: EIP1193Provider['request'] }) => Promise<Balance>)
      | null
  eth_requestAccounts?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
  }) => Promise<ProviderAccounts>)
      | null
  eth_selectAccounts?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
  }) => Promise<ProviderAccounts>)
      | null
  eth_chainId?:
      | ((args: { baseRequest: EIP1193Provider['request'] }) => Promise<string>)
      | null
  eth_signTransaction?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EthSignTransactionRequest['params']
  }) => Promise<string>)
      | null
  eth_sendTransaction?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EthSignTransactionRequest['params']
  }) => Promise<string>)
      | null
  eth_sign?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EthSignMessageRequest['params']
  }) => Promise<string>)
      | null
  personal_sign?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: PersonalSignMessageRequest['params']
  }) => Promise<string>)
      | null
  eth_signTypedData?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EIP712Request['params']
  }) => Promise<string>)
      | null
  eth_signTypedData_v4?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EIP712Request_v4['params']
  }) => Promise<string>)
      | null
  wallet_switchEthereumChain?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EIP3326Request['params']
  }) => Promise<null>)
      | null
  wallet_addEthereumChain?:
      | ((args: {
    baseRequest: EIP1193Provider['request']
    params: EIP3085Request['params']
  }) => Promise<null>)
      | null
}
export interface AppMetadata {
  /* App name */
  name: string

  /* An SVG icon string or image url, with height set to 100%
    Note: `icon` is displayed on both mobile AND desktop. If `logo`
    below is provided then `icon` displays on mobile and `logo` on
    desktop.
  */
  icon?: string

  /* SVG logo (icon and text) string or image url, with width set to 100%
     Note: This will ONLY display on desktop. It is best used with wide
     format logos. Use `icon` for standard 40x40 icons.
  */
  logo?: string

  /* Description of app*/
  description?: string

  /* Url to a getting started guide for app */
  gettingStartedGuide?: string

  /* Url that points to more information about app */
  explore?: string

  /** When no injected wallets detected, recommend the user to install some*/
  recommendedInjectedWallets?: RecommendedInjectedWallets[]

  agreement?: TermsOfServiceAgreementOptions | null
}

export type TermsOfServiceAgreementOptions = {
  version: string
  termsUrl?: string
  privacyUrl?: string
}

export type RecommendedInjectedWallets = {
  name: string
  url: string
}

/**
 * A method that takes `WalletHelpers` and
 * returns an initialised `WalletModule` or array of `WalletModule`s.
 */
export type WalletInit = (
    helpers: WalletHelpers
) => WalletModule | WalletModule[] | null

export type WalletHelpers = {
  device: Device
}

export interface APIKey {
  apiKey: string
}

export type Device = {
  os: DeviceOS
  type: DeviceType
  browser: DeviceBrowser
}

export type Platform = DeviceOSName | DeviceBrowserName | DeviceType | 'all'

export type DeviceOS = {
  name: DeviceOSName
  version: string
}

export type DeviceBrowser = {
  name: DeviceBrowserName
  version: string
}

export type DeviceOSName =
    | 'Windows Phone'
    | 'Windows'
    | 'macOS'
    | 'iOS'
    | 'Android'
    | 'Linux'
    | 'Chrome OS'

export type DeviceBrowserName =
    | 'Android Browser'
    | 'Chrome'
    | 'Chromium'
    | 'Firefox'
    | 'Microsoft Edge'
    | 'Opera'
    | 'Safari'

export type DeviceType = 'desktop' | 'mobile' | 'tablet'

export interface WalletModule {
  // The label of the wallet
  label: string

  type : 'evm' | 'substrate'
  /**
   * Gets the icon of the wallet
   * @returns
   */
  getIcon: () => Promise<string>
  /**
   * @returns the wallet interface associated with the module
   */
  getInterface: (helpers: GetInterfaceHelpers) =>
      Promise<WalletInterface | WalletInterfaceSubstrate>

  signer ?: Signer | undefined

}

export type GetInterfaceHelpers = {
  chains: Chain[]
  appMetadata: AppMetadata | null
  BigNumber: typeof ethers.BigNumber
  EventEmitter: typeof EventEmitter
}

export type ChainId = string

export type DecimalChainId = number

export type RpcUrl = string

export type WalletInterface = {
  provider: EIP1193Provider
  instance?: unknown
}
export type WalletInterfaceSubstrate = {
  provider : SubstrateProvider,
  instance ?: unknown
}


export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export interface ProviderInfo {
  chainId: ChainId
}

export type AccountAddress = string

/**
 * An array of addresses
 */
export type ProviderAccounts = AccountAddress[]

export type ProviderEvent =
    | 'connect'
    | 'disconnect'
    | 'message'
    | 'chainChanged'
    | 'accountsChanged'

export interface SimpleEventEmitter {
  on(
      event: ProviderEvent,
      listener:
          | ConnectListener
          | DisconnectListener
          | MessageListener
          | ChainListener
          | AccountsListener
  ): void
  removeListener(
      event: ProviderEvent,
      listener:
          | ConnectListener
          | DisconnectListener
          | MessageListener
          | ChainListener
          | AccountsListener
  ): void
}

export type ConnectListener = (info: ProviderInfo) => void
export type DisconnectListener = (error: ProviderRpcError) => void
export type MessageListener = (message: ProviderMessage) => void
export type ChainListener = (chainId: ChainId) => void
export type AccountsListener = (accounts: ProviderAccounts) => void

/**
 * The hexadecimal representation of the users
 */
export type Balance = string

export interface TransactionObject {
  data?: string
  from: string
  gas?: string
  gasLimit?: string
  gasPrice?: string
  to: string
  chainId: number
  value?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: string
}

interface BaseRequest {
  params?: never
}

export interface EthAccountsRequest extends BaseRequest {
  method: 'eth_accounts'
}

export interface EthChainIdRequest extends BaseRequest {
  method: 'eth_chainId'
}

export interface EthSignTransactionRequest {
  method: 'eth_signTransaction'
  params: [TransactionObject]
}

type Address = string
type Message = string
export interface EthSignMessageRequest {
  method: 'eth_sign'
  params: [Address, Message]
}

//https://geth.ethereum.org/docs/rpc/ns-personal#personal_sign
export interface PersonalSignMessageRequest {
  method: 'personal_sign'
  params: [Message, Address]
}

// request -> signTypedData_v3`
export interface EIP712Request {
  method: 'eth_signTypedData'
  params: [Address, EIP712TypedData]
}

export interface EIP712Request_v4{
  method: 'eth_signTypedData_v4'
  params: [Address, EIP712TypedData]
}

export interface EthBalanceRequest {
  method: 'eth_getBalance'
  params: [string, (number | 'latest' | 'earliest' | 'pending')?]
}

export interface EIP1102Request extends BaseRequest {
  method: 'eth_requestAccounts'
}

export interface SelectAccountsRequest extends BaseRequest {
  method: 'eth_selectAccounts'
}

export interface EIP3085Request {
  method: 'wallet_addEthereumChain'
  params: AddChainParams[]
}

export interface EIP3326Request {
  method: 'wallet_switchEthereumChain'
  params: [{ chainId: ChainId }]
}

export type AddChainParams = {
  chainId: ChainId
  chainName?: string
  nativeCurrency: {
    name?: string
    symbol?: string
    decimals: number
  }
  rpcUrls: string[]
}

export const listMethodTypeMessage = [
  'Personal Sign',
  'ETH Sign',
  'Sign Typed Data',
  'Sign Typed Data v4'
]

export interface EIP1193Provider extends SimpleEventEmitter {
  on(event: 'connect', listener: ConnectListener): void
  on(event: 'disconnect', listener: DisconnectListener): void
  on(event: 'message', listener: MessageListener): void
  on(event: 'chainChanged', listener: ChainListener): void
  on(event: 'accountsChanged', listener: AccountsListener): void
  request(args: EthAccountsRequest): Promise<ProviderAccounts>
  request(args: EthBalanceRequest): Promise<Balance>
  request(args: EIP1102Request): Promise<ProviderAccounts>
  request(args: SelectAccountsRequest): Promise<ProviderAccounts>
  request(args: EIP3326Request): Promise<null>
  request(args: EIP3085Request): Promise<null>
  request(args: EthChainIdRequest): Promise<ChainId>
  request(args: EthSignTransactionRequest): Promise<string>
  request(args: EthSignMessageRequest): Promise<string>
  request(args: PersonalSignMessageRequest): Promise<string>
  request(args: EIP712Request): Promise<string>
  request(args: EIP712Request_v4): Promise<string>
  request(args: { method: string; params?: Array<unknown> }): Promise<unknown>
  disconnect?(): void
}

export interface SubstrateProvider {
  enable () : Promise<{
    signer : Signer,
    address : AccountAddress[] } | undefined>,
  signDummy( address : string, data : string ,
             wallet : Signer | string ) : Promise<SignerResult | undefined>
}

export enum ProviderRpcErrorCode {
  ACCOUNT_ACCESS_REJECTED = 4001,
  ACCOUNT_ACCESS_ALREADY_REQUESTED = -32002,
  UNAUTHORIZED = 4100,
  INVALID_PARAMS = -32602,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,
  CHAIN_NOT_ADDED = 4902,
  DOES_NOT_EXIST = -32601,
  UNRECOGNIZED_CHAIN_ID = -32603
}

export interface Chain {
  /**
   * String indicating chain namespace.
   * Defaults to 'evm' but will allow other chain namespaces in the future
   */
  namespace?: 'evm'
  /* Hex encoded string, eg '0x1' for Ethereum Mainnet */
  id : ChainId
  /**
   * Recommended to include. Used for network requests
   * (eg Alchemy or Infura end point).
   * PLEASE NOTE: Some wallets require an rpcUrl, label,
   * and token for actions such as adding a new chain.
   * It is recommended to include rpcUrl, label,
   * and token for full functionality.
   */
  rpcUrl?: string
  /* Recommended to include. Used for display, eg Ethereum Mainnet */
  label?: string
  /* Recommended to include. The native token symbol, eg ETH, BNB, MATIC */
  token?: TokenSymbol
  /**
   * An optional array of tokens (max of 5) to be available to the dapp in the
   * app state object per wallet within the wallet account and displayed
   * in Account Center (if enabled)
   */
  secondaryTokens?: SecondaryTokens[]
  /**
   * The color used to represent the chain and
   * will be used as a background for the icon
   */
  color?: string
  /* Svg string. The icon to represent the chain */
  icon?: string
  /* Related to ConnectionInfo from 'ethers/lib/utils' */
  providerConnectionInfo?: ConnectionInfo
  /* An optional public RPC used when adding a new chain config to the wallet */
  publicRpcUrl?: string
  /** An optional protected RPC URL - Defaults to Blocknative's private and
   * protected RPC to allow users to update the chain RPC within their wallet,
   * specifically for private RPCs that protect user transactions
   */
  protectedRpcUrl?: string
  /* Also used when adding a new config to the wallet */
  blockExplorerUrl?: string
}

export interface SecondaryTokens {
  /**
   * Required - The onchain address of the token associated
   * with the chain it is entered under
   */
  address: string
  /**
   * An optional svg or url string for the icon of the token.
   * If an svg is used ensure the height/width is set to 100%
   */
  icon?: string
}

export type ChainWithDecimalId = Omit<Chain, 'id'> & { id: DecimalChainId }

export type TokenSymbol = string // eg ETH

export interface CustomNetwork {
  networkId: number
  genesis: GenesisBlock
  hardforks: Hardfork[]
  bootstrapNodes: BootstrapNode[]
}

export interface GenesisBlock {
  hash: string
  timestamp: string | null
  gasLimit: number
  difficulty: number
  nonce: string
  extraData: string
  stateRoot: string
}
export interface Hardfork {
  name: string
  block: number | null
}

export interface BootstrapNode {
  ip: string
  port: number | string
  network?: string
  chainId?: number
  id: string
  location: string
  comment: string
}

export interface RPCResponse {
  id: number
  jsonrpc: string
  error?: { code: number; message: string }
  result?: any
}

