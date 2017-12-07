export interface ResponseModel {
    code: number,
    message: string
}

export interface ErrorResponseModel extends ResponseModel {}