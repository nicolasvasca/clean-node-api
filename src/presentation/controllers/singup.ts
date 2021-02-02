import { HttpResponse, HttpRequest , Controller, EmailValidator } from '../protocols/protocols'
import { MissingParamError, InvalidParamError } from '../errors/errors'
import { badRequest, serverError } from '../helpers/http-helper'

export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    /* if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    } */
    try {
      const requiredFields = ['name','email' , 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const {email, password, passwordConfirmation} = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isvalid = this.emailValidator.isValid(email)
      if (!isvalid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
