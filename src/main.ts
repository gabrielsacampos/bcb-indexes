import {format, parse} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz';

import axios from 'axios';



export class BcbIndex{
	constructor(serie: number){
		this.serie = serie
	}
	serie: number;
	reponseFormat = 'json'

	formatUrl(startAt: string, endAt: string){
		const startDate = utcToZonedTime(new Date(startAt), 'UTC');
		const endDate = utcToZonedTime(new Date(endAt), 'UTC');
		const serie = this.serie;
		const url = new URL(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.${serie}/dados`)

		const dataInicial = format(startDate, 'dd/MM/yyyy');
		const dataFinal = format(endDate,'dd/MM/yyyy')

		url.searchParams.append('format', this.reponseFormat)
		url.searchParams.append('dataInicial', dataInicial);
		url.searchParams.append('dataFinal', dataFinal)

		return url.href
	};

	async rangeOfReadjustment(url: string){
		const {data} = await axios.get(url);
		return data.map((item) => {
			const date = new Date(item.data);
			const value = Number(item.valor);
			return {date, value}
		})
	}


	async calculate (value: number, startAt: string, endAt: string): Promise<any> {
		const url = this.formatUrl(startAt, endAt);
		const range = await this.rangeOfReadjustment(url);
		const values = range.map((item) => item.value);
		const result = values.reduce((acc: number, curr: number) => {
			return acc+=acc*(curr/100)
		}, value)

		return result;
	}
}






// // bcbIndexes.getPeriod(serie, value, start-at, end-at)
// // bcbIndexes.accumulate()
// // bcbIndexes.readjustment()
