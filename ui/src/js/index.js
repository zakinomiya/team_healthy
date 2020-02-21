'use strict'

const IOST = require('iost')
// const IP = 'http://13.52.105.102:30001'
const IP = 'http://localhost:30001'
const Chart = require('chart.js')
const CONTRACTID = 'Contract2dnoGhZP1xSScy2VXhA2B2iUyiGEZLQ8K262Z68QvYRU'
const _ = require('lodash')

const rpc = new IOST.RPC(new IOST.HTTPProvider(IP))

let iwallet, iost, ctx, chartName, toilet, stepsChartButton, sleepChartButton, sunChartButton

const mainData = {
	steps: [],
	sun: [],
	sleep: [],
	height: 0,
	weight: 0
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
				borderColor: 'rgba(255,0,0,1)',
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
		iwallet.account.name
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

	mainData.height = _.maxBy(m, 'date').height
	mainData.weight = _.maxBy(m, 'date').weight
}

// ページを読み込んだ時に起動
const init = () => {
	let retry = 0
	ctx = document.getElementById('myChart')
	stepsChartButton = document.getElementById('steps-chart-button')
	stepsChartButton.addEventListener('click', () => updateChart('steps')) 
	sleepChartButton = document.getElementById('sleep-chart-button')
	sleepChartButton.addEventListener('click', () => updateChart('sleep'))
    
	sunChartButton = document.getElementById('sun-chart-button')
	sunChartButton.addEventListener('click', () => updateChart('sun')) 

	const load = setInterval(async () => {
		if (retry === 100) {
			alert('IWalletをインストールしてください')
			window.location.reload()
		}
		if (!iwallet) {
			await loadAccount()
		} else {
			clearInterval(load)
			await loadData()
			createChart('mainData', 'steps')
		}
		retry++
	})
}


Window.onload = init()
