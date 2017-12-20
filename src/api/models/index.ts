export interface ResponseModel {
    status: number,
    message: string
}

export interface ErrorResponseModel extends ResponseModel {}