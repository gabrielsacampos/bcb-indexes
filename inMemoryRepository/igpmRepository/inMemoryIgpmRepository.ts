import {format, parse} from 'date-fns'
import { igpmMock } from "./igpm.mock";



export class InMemoryIGPMRepository {
	items = igpmMock;
	fetch(url: string){
		const {inicialDateISO, endDateISO} = this.convertDateParamsToISO(url)
		return  this.filterByDate(inicialDateISO, endDateISO)
	}
	
	convertDateParamsToISO(urlString: string): {inicialDateISO: string, endDateISO: string}{
		const url = new URLSearchParams(urlString)
	
		const inicialDateBr = url.get('dataInicial')
		const inicialDateParsed = inicialDateBr? parse(inicialDateBr, 'dd/MM/yyyy', new Date()): 0;
		
		if(inicialDateParsed === 0){
			throw new Error(`Verify the url > 'dataInicial is requesting: ${inicialDateBr}'`)
		}

		const inicialDateISO = format(inicialDateParsed, 'yyyy-MM-dd')
		
		
		const endDateBr = url.get('dataFinal')
		const endDateParsed = endDateBr? parse(endDateBr, 'dd/MM/yyyy', new Date()): 0;
	
		if(endDateParsed === 0){
			throw new Error(`Verify the url > 'dataFinal is requesting: ${endDateBr}'`)
		}

		const endDateISO = format(endDateParsed, 'yyyy-MM-dd')

		return {inicialDateISO, endDateISO}
	}

	filterByDate(inicialDateISO: string, endDateISO: string){
		return this.items.filter(item => {
			const currentDate = parse( item.data, 'dd/MM/yyyy', new Date());
			return new Date(currentDate) >= new Date(inicialDateISO) && new Date(currentDate) <= new Date(endDateISO)
		})
	}
}
