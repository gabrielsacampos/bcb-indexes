# Simple lib to calculete value based on inflation indexes from BACEN - IBGE

## [in construction]

This library enables us to calculate the readjustment of values based on inflation indexes. I attempted to connect to various APIs from BCB, but some of them did not function properly. It's particularly challenging to find the URL for each index, as every index has its own series code, and these codes are listed on a website that is not easily accessible or somewhat hidden.

Series/indexes reference: [series-indexes](https://www3.bcb.gov.br/sgspub/localizarseries/localizarSeries.do?method=prepararTelaLocalizarSeries)

URL template to get data:

```txt
 https://api.bcb.gov.br/dados/serie/bcdata.sgs.{serie}/dados?formato=json
```

You can also set the params _&dataInicial=dd/MM/yyyy&dataFinal=dd/MM/yyyy_ to filter the result.

In this project, we need to use axios to make the request to API. If you do not have internet conection fow now, you can find mocks from two IPCA and IGPM indexes on ./mocks to play with new methods.

This lib use **jest** and the concept of _InMemoryRepository_ to mock the response of API and test the methods properly without interent connection.

How does it work?

```typescript
import { BcbIndex } from './main.js';

const ipca = new BcbIndex(433); // create a new instace using the number of index serie
// use serie number 189 for igpm index

const valueToUpdate = 1000;

//1 param: inicial value
//2 param: start month (you can also just use '2022-01')
//3 lastmonth (you can also just use '2022-12')
const result = await ipca.calculate(valueToUpdate, '2022-01-01', '2022-12-31');

console.log(result); // 1057.848419596078
```
