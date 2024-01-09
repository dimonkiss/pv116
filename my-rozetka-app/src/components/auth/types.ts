import {IUploadedFile} from "../../interfaces/forms";

export interface IRegisterForm {
    lastName: string,
    name: string,
    phone: string,
    password: string,
    password_confirmation: string,
    image: IUploadedFile|null
}

export interface IRegister {
    lastName: string,
    name: string,
    phone: string,
    password: string,
    password_confirmation: string,
    image: string | undefined
}
export interface ILoginForm {

    name: string,

    password: string,

}

export interface ILogin {

    name: string,

    password: string,

}