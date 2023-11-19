import { BcbIndex } from './worker';
import axios from 'axios';
import {InMemoryIGPMRepository} from "../inMemoryRepository/igpmRepository/inMemoryIgpmRepository"
import {InMemoryIPCARepository} from "../inMemoryRepository/ipcaRepository/inMemoryIpcaRepository"

describe('', () => {
	const axiosIGPMMock = new InMemoryIGPMRepository();
	const axiosIPCAMock = new InMemoryIPCARepository()
	const igpm = new BcbIndex(189)
	const ipca = new BcbIndex(433)

	const valueToUpdate = 1000;
	const start_date = '2022-01-01';
	const end_date = '2022-12-31';
	
	const expectIGPMUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados?format=json&dataInicial=01%2F01%2F2022&dataFinal=31%2F12%2F2022'
	const expectIPCAUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?format=json&dataInicial=01%2F01%2F2022&dataFinal=31%2F12%2F2022';


	const expectRangeIGPMResult = [
		{ date: new Date('2022-01-01T03:00:00.000Z'), value: 1.82 },
		{ date: new Date('2022-01-02T03:00:00.000Z'), value: 1.83 },
		{ date: new Date('2022-01-03T03:00:00.000Z'), value: 1.74 },
		{ date: new Date('2022-01-04T03:00:00.000Z'), value: 1.41 },
		{ date: new Date('2022-01-05T03:00:00.000Z'), value: 0.52 },
		{ date: new Date('2022-01-06T03:00:00.000Z'), value: 0.59 },
		{ date: new Date('2022-01-07T03:00:00.000Z'), value: 0.21 },
		{ date: new Date('2022-01-08T03:00:00.000Z'), value: -0.7 },
		{ date: new Date('2022-01-09T03:00:00.000Z'), value: -0.95 },
		{ date: new Date('2022-01-10T03:00:00.000Z'), value: -0.97 },
		{ date: new Date('2022-01-11T03:00:00.000Z'), value: -0.56 },
		{ date: new Date('2022-01-12T03:00:00.000Z'), value: 0.45 }
	  ]

	const expectRangeIPCAResult = [
		{ date: new Date('2022-01-01T03:00:00.000Z'), value: 0.54 },
		{ date: new Date('2022-01-02T03:00:00.000Z'), value: 1.01 },
		{ date: new Date('2022-01-03T03:00:00.000Z'), value: 1.62 },
		{ date: new Date('2022-01-04T03:00:00.000Z'), value: 1.06 },
		{ date: new Date('2022-01-05T03:00:00.000Z'), value: 0.47 },
		{ date: new Date('2022-01-06T03:00:00.000Z'), value: 0.67 },
		{ date: new Date('2022-01-07T03:00:00.000Z'), value: -0.68 },
		{ date: new Date('2022-01-08T03:00:00.000Z'), value: -0.36 },
		{ date: new Date('2022-01-09T03:00:00.000Z'), value: -0.29 },
		{ date: new Date('2022-01-10T03:00:00.000Z'), value: 0.59 },
		{ date: new Date('2022-01-11T03:00:00.000Z'), value: 0.41 },
		{ date: new Date('2022-01-12T03:00:00.000Z'), value: 0.62 }
	  ]
	
	const expectIGPMValueresult = 1054.5842156975425
	const expectIPCAValueresult = 1057.848419596078

	it('IGPM > formatUrl return formated url ready to request', async () => {
		const resultUrl = igpm.formatUrl(start_date, end_date)
		expect(resultUrl).toBe(expectIGPMUrl)
	})	

	it('IGPM > rangeOfReadjustment return a range with readjustment from selected period following the ISO patter and props in english', async () => {
		const spy = jest.spyOn(axios, 'get');
		const responseMock = axiosIGPMMock.fetch(expectIGPMUrl)
		spy.mockResolvedValue({data: responseMock})

		const rangeResult = await igpm.rangeOfReadjustment(expectIGPMUrl);
		expect(rangeResult).toEqual(expectRangeIGPMResult)
	})

	it('IGPM > accumulate on period', async () => {
		const result = await igpm.calculate(valueToUpdate, "2022-01-01", "2022-12-31")
		const acceptedVariation = 0.05
		const max = expectIGPMValueresult + acceptedVariation;
		const min = expectIGPMValueresult - acceptedVariation;
		const match = result >= min || result <=max
		expect(match).toBe(true)
	})

	it('IPCA > formatUrl return formated url ready to request', async () => {
		const resultUrl = ipca.formatUrl(start_date, end_date)
		expect(resultUrl).toBe(expectIPCAUrl)
	})	

	it('IPCA > rangeOfReadjustment return a range with readjustment from selected period following the ISO patter and props in english', async () => {
		const spy = jest.spyOn(axios, 'get');
		const responseMock = axiosIPCAMock.fetch(expectIGPMUrl)
		spy.mockResolvedValue({data: responseMock})

		const rangeResult = await ipca.rangeOfReadjustment(expectIPCAUrl);
		expect(rangeResult).toEqual(expectRangeIPCAResult)
	})

	it('IPCA > accumulate on period', async () => {
		const result = await igpm.calculate(valueToUpdate, "2022-01-01", "2022-12-31")
		const acceptedVariation = 0.05
		const max = expectIPCAValueresult + acceptedVariation;
		const min = expectIPCAValueresult - acceptedVariation;
		const match = result >= min || result <=max
		expect(match).toBe(true)
	})
})

//Índice de correção no período	0,95067550
//Valor percentual correspondente	-4,932450 %
//Valor corrigido na data final	R$   950,68   ( REAL )
