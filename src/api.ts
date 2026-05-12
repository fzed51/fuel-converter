export interface ApiResponse {
  total_count: number
  results: Result[]
}

export interface Result {
  monnaie_source: string
  nom_monnaie_source: string
  pays_principal: string
  code_pays: string
  date: string
  taux: number
  monnaievigueur: number
}

export async function getChange(): Promise<number> {
    const refine = encodeURIComponent(`code_pays:"GB"`)
    const limit = 1
    const order_by = encodeURIComponent('date DESC')
    const url = `https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/dgfip-taux-de-change/records?limit=${limit}&order_by=${order_by}&refine=${refine}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Unable to load exchange rate')
    }

    const payload = (await response.json()) as ApiResponse
    if (!Array.isArray(payload.results)) {
        throw new Error('Invalid exchange rate payload')
    }

    const record = payload.results.shift()
    if (!record) {
        throw new Error('GBP exchange rate not found in payload')
    }
    if (typeof record.taux !== 'number' || !Number.isFinite(record.taux) || record.taux <= 0) {
        throw new Error('Invalid GBP exchange rate in payload')
    }
    return record.taux
}
