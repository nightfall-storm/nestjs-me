// src/common/dto/response.wrapper.ts
export class ResponseWrapper<T> {
    success: boolean;
    data?: T;
    message?: string;

    constructor(success: boolean, data?: T, message?: string) {
        this.success = success;
        this.data = data;
        this.message = message;
    }
}
