export interface IPengertian {
  jenisKata: string[]
  deskripsi: string
}

export interface ISuccess {
  ejaan: string[]
  kataTidakBaku?: string
  pengertian: IPengertian[]
}

export type IError = null

export interface IResult {
  status: number
  message: string
  data: ISuccess | IError
}
