'use strict'

const IOST = require('iost')
const IP = 'http://13.52.105.102:30001'
// const IP = 'http://localhost:30001'
const Chart = require('chart.js')
// const CONTRACTID = 'Contract2dnoGhZP1xSScy2VXhA2B2iUyiGEZLQ8K262Z68QvYRU'
const CONTRACTID = 'ContractHrESsw2L5F5uRxFMfA6s1BNCQVMrDzz7rU2v1jTSLEoP'

const _ = require('lodash')

const rpc = new IOST.RPC(new IOST.HTTPProvider(IP))

let iwallet, iost, ctx, chartName, stepsChartButton, sleepChartButton, sunChartButton, sendDataButton, sendToiletButton, chartSelect, loadChart

const mainData = {
	steps: [],
	sun: [],
	sleep: [],
	height: [],
	weight: []
}

/**
 * 
 * @param {string} dataName 
 */

const createLabel = (dataName) => {
	switch(dataName){
	case 'sleep':
		return '睡眠時間'
	case 'steps':
		return '歩数'
	case 'sun':
		return '日浴時間'
	case 'height':
		return '身長'
	case 'weight':
		return '体重'
	case 'toilet':
		return 'トイレ'
	}
    
}

/**
 * 
 * @param {Date} d 
 */
const createDate = (d) => {

	const year = d.getFullYear()
	const month = d.getMonth()+1
	const date = d.getDate()

	return `${year}-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date}`
} 

const sendTx = (tx) => {
	return new Promise((resolve, reject) => {
		iost.signAndSend(tx)
			.on('pending', (res) => {
				console.log(res)
			})
			.on('success', (res) => {
				console.log(res)
				resolve(res)
			})
			.on('failed', (err) => {
				reject(err)
			})
	}) 
}

const sendMainTransaction = async () => {
	const form = document.forms['send-data-form']
	console.log(form)
	const height = form.elements[0].value
	const weight = form.elements[1].value
	const steps = form.elements[2].value
	const sleepHour = form.elements[3].value
	const sleepMinutes = form.elements[4].value
	const sunHour = form.elements[5].value
	const sunMinutes = form.elements[6].value
	const heartRate = form.elements[7].value

	const str = createDate(new Date())

	const data = {
		date: str,
		height: height,
		weight: weight,
		steps: steps,
		sleep: sleepHour * 60 + sleepMinutes,
		sun: sunHour * 60 + sunMinutes, 
		heartRate: heartRate
	}

	const tx = iost.callABI(
		CONTRACTID,
		'setData',
		[JSON.stringify(data)]
	)

	tx.setChainID(1023)

	await sendTx(tx)
		.then(() => {
			alert('トランザクションが成功しました')
		})
		.catch(err => {
			console.log(err)
		})
}

/**
 * 
 * @param {number} flag 
 */

const sendToiletTransaction = async (flag) => {
	const date = createDate(new Date())

	const data = {
		flag,
		date, 
		time: new Date()
	}
	const toiletData = JSON.stringify(data)

	console.log(toiletData)

	const tx = iost.callABI(
		CONTRACTID,
		'setToilet',
		[toiletData]
	)

	tx.setChainID(1023)

	await sendTx(tx)
		.then(() => {
			alert('トランザクションが成功しました')
		})
		.catch(err => {
			console.log(err)
		})
}


/**
 * 
 * @param {string} dataName 
 */

const createChart = async (dataName) => {
	if(!mainData[dataName]) return
	const data = {
		labels: mainData[dataName].map(s => s.date),
		datasets: [
			{
				label: createLabel(dataName),
				data: mainData[dataName].map(s => s[dataName]),
				borderColor: 'rgba(200,3,3,1)',
				backgroundColor: 'rgba(0,0,0,0)'
			}
		],
	}
	chartName = dataName
	new Chart(ctx, {
		type: 'line',
		data,
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
		}
	})
}

/**
 * 
 * @param {string} dataName 
 */

const updateChart = async (dataName) => {
	if(chartName === dataName) return
	createChart(dataName)
}

/**
 * 
 * @param {string} type 
 * toilet or mainData
 */
const fetchContractStorage = async (type) => {
	const res = await rpc.blockchain.getContractStorage(
		CONTRACTID,
		type,
		iwallet.account.name,
		true
	)
    
	if(res.data !=='null') return res.data
}

// 拡張機能からアカウントを読み込んで
// IOSTクラスのインスタンスを返す
const loadAccount = async () => {
	if (!window.IWalletJS) return
    
	try {
		iwallet = window.IWalletJS
		const account = await iwallet.enable()
		iost = iwallet.newIOST(IOST)
		iost.setRPC(rpc)
		iost.setAccount(account)
	} catch (err) {
		// インストールはしているけれどログインしていない状態
		if (err.type === 'locked') return alert('Iwalletにログインしてください')
		console.log(err)
	}
} 

// const minToHour = (data) => {
// 	let hour =0
// 	let min = 0
// 	let remainder = parseInt(data)
	
// 	while(remainder > 0){
// 		if(remainder > 60){
// 			remainder - 60
// 			hour ++
// 		} else {
// 			min = remainder / 100
// 			remainder = 0
// 		}
// 	}
// 	return hour + min
// }

const loadData = async () => {
	const r1 = await fetchContractStorage('toilet')
	const r2 = await fetchContractStorage('mainData')
	let m = []

	if(!r1 && !r2) return

	// if(r1) toilet = JSON.parse(JSON.parse(r1))
	if(r2) m = JSON.parse(r2)
    
	mainData.sleep = m.map(data => {
		return {
			sleep: data.sleep,
			date: data.date
		}
	})
    
	// mainData.toilet = m.map(data => {
	// 	return {
	// 		toilet: data.toilet,
	// 		date: data.date
	// 	}
	// })

	mainData.steps = m.map(data => {
		return {
			steps: data.steps,
			date: data.date
		}
	})

	mainData.sun = m.map(data => {
		return {
			sun: data.sun,
			date: data.date
		}
	})

	mainData.height = m.map(data => {
		return {
			height: data.height,
			date: data.date
		}
	})

	mainData.weight = m.map(data => {
		return {
			weight: data.weight,
			date: data.date
		}
	})
}

// ページを読み込んだ時に起動
const init = () => {
	let retry = 0
	ctx = document.getElementById('myChart')

	chartSelect = document.getElementById("graph-select")
	loadChart = document.getElementById('load-graph-button')
	loadChart.addEventListener('click', () => updateChart(chartSelect.value)) 

	sendDataButton = document.getElementById('send-data-button')
	sendDataButton.addEventListener('click',(e) => sendMainTransaction().catch(err => console.log(err)))

	const bigToiletButton = document.getElementById('toilet-big-input')
	bigToiletButton.addEventListener('click', () => sendToiletTransaction(0))

	const littleToiletButton = document.getElementById('toilet-little-input')
	littleToiletButton.addEventListener('click', () => sendToiletTransaction(1))

	const load = setInterval(async () => {
		if (retry === 100) {
			alert('IWalletをインストールしてください')
			window.location.reload()
		}
		if (!iwallet) {
			await loadAccount()
		} else {
			if(iost){
				clearInterval(load)
				await loadData()
				createChart('mainData', 'steps')
			}
		}
		retry++
	})
}


Window.onload = init()
