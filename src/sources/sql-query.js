import alasql from 'alasql'
import { asyncMemoize } from '../utils/caching';

async function fetchQuery (tableName) {
    try {
    if(tableName == 'large_data') {
        const resp = await alasql.promise('SELECT * FROM CSV("wholesale-trade-survey-mar-2022-quarter-csv.csv", {headers:false})')
        console.log(resp, 'response from alasql')
        return Promise.resolve(resp)
    }
    let response = await fetch(`https://api.github.com/repos/graphql-compose/graphql-compose-examples/contents/examples/northwind/data/csv/customers.csv`, {
        headers: {
            Accept: "application/vnd.github.v4+raw"
          }
    })
    response = await response.json()
    const incodedData = response.content.replace("\n", "");
    response = await alasql.promise("SELECT * FROM CSV(?, {headers: false, separator:','})", [atob(incodedData)])
    return Promise.resolve(response)
    } catch (error) {
        return Promise.reject(error)
    }
}

const [srFetchQuery, clearQueryData] = asyncMemoize(fetchQuery)

export { srFetchQuery, clearQueryData }