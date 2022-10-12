import { useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress } from '../configEth'
import abi from '../auctionContractabi.json'

export default function Home(props) {
	
	const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.g.alchemy.com/v2/Rr1a_D_b3QvBLANZNlcDovNfTkSUpqzo')
	const ERC20_ABI = abi;

	const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)

	const [currentBidder, setCurrentBidder] = useState(null);
	const [currentBid, setCurrentBid] = useState(null);
	const [currentTime, setCurrentTime] = useState(null);
	const [currentStart, setCurrentStart] = useState(null);
	const [currentEnd, setCurrentEnd] = useState(null);
	const [eventLogs, seteventLogs] = useState([]);
	const [btnHide, setBtnHide] = useState(false);

  	const start = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
		const data = await contract.start()
		await data.wait()
	}

	const bid = async () => {  
		const ethAmount = document.getElementById("ethAmount").value
		const fixedFee = "0.0025"  // 2500000000000000 WEI
		let res = parseFloat(ethAmount) + parseFloat(fixedFee)
		res = res.toString()
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
    	const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
		const data = await contract.bid({ value: ethers.utils.parseEther(res) })
		await data.wait()
	}

	const end = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
			console.log('contract: ', contract)
		try {
			const data = await contract.end()
			await data.wait()
		} catch (err) {
			console.log('Error: ', err)
		  }
		}
	}

	const withdraw = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
		const data = await contract.withdraw()
		await data.wait()
	}

  const getBidder = async () => {
		let val = await contract.highestBidder();
		setCurrentBidder(val);
	}

	const getBid = async () => {
		let val = await contract.highestBid();
		setCurrentBid(ethers.utils.formatEther(val));
	}

	const getTimer = async () => {
		let val = await contract.timerAuction();
		setCurrentTime(val/60);
	}

	const getStart = async () => {
		const val = await contract.started();
		setCurrentStart(val)
		
	}

	const getEnd = async () => {
		let val = await contract.ended();
		setCurrentEnd(val);
	}

	const listToEvent = () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
		contract.on("End", (winner, amount, event) => {
			let data = {
				winner,
				amount: amount.toString(),
				event
			}
			seteventLogs((oldState) => [...oldState, data])
		})
		setBtnHide()
	}

  return (
    <div className="App">

<div>
  <button onClick={start}>Começar Leilao</button>
</div>
<div>
    <input id="ethAmount" placeholder="Exemplo: 0.1" />
  <button onClick={bid}>Apostar</button>
</div>
<div>
  <button onClick={end}>Terminar Leilao</button>
</div>
<div>
  <button onClick={withdraw}>Retirar Fundos</button>
</div><br></br>




<div>
  <button onClick={getBidder}>Atual Campeão</button>
  <h1>{currentBidder}</h1>
</div>
<div>
  <button onClick={getBid}>Maior Aposta</button>
  <h1>{currentBid}</h1>
</div>
<div>
  <button onClick={getTimer}>Duração</button>
  <h1>{currentTime}</h1>
</div>
<div>
  <button onClick={getStart}>Inicio</button>
  <h1>{currentStart ? 'Iniciado' : 'Não iniciado'}</h1>
</div>
<div>
  <button onClick={getEnd}>Fim do Leilao</button>
  <h1>{currentEnd ? 'Terminou' : 'Não terminou'}</h1>
</div>

<div>
  <button
  style={{ display: btnHide ? "none" : null }}
  onClick={() => listToEvent()}
  >
	EVENTO DO BID
  </button>
  {eventLogs.reverse().map((event, index) => {
	return <div key={index}>
	
	<h1>VENCEDOR: </h1><p>{event.winner}</p>
	<h1>VALOR PAGO: </h1><p>{event.amount}</p>
	</div>
  })}
</div>

</div>
  )
}
