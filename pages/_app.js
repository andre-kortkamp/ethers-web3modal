import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

function MyApp({ Component, pageProps }) {

  const [account, setAccount] = useState(null)

  const getWeb3Modal = async () => { 
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: { 
            infuraId: "https://eth-goerli.g.alchemy.com/v2/Rr1a_D_b3QvBLANZNlcDovNfTkSUpqzo"
          },
        },
        walletlink: {
          package: CoinbaseWalletSDK, 
          options: {
            infuraId: "https://eth-goerli.g.alchemy.com/v2/Rr1a_D_b3QvBLANZNlcDovNfTkSUpqzo", 
          },
        },
      },
    })
    return web3Modal
  }

  const connect = async () => {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
    } catch (err) {
      console.log('error:', err)
    }
  }


  return (
    <div>
      <nav>
       {
          !account && (
            <div>
              <button onClick={connect}>Connect</button>
            </div>
          )
        }
        {
          account && <p>{account}</p>
        }
      </nav>

      <div>
        <Component {...pageProps} />
      </div>
    </div>  
  )
}

export default MyApp
