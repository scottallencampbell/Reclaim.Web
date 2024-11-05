import 'bootstrap/dist/css/bootstrap.css'
import TextInput from 'components/TextInput'
import { useEffect, useState } from 'react'
import { emailAddressRegex, passwordRegex, telephoneRegex } from 'helpers/constants'
import { UnauthenticatedLayout } from 'layouts/UnauthenticatedLayout'
import { v4 } from 'uuid'
import { Link, useNavigate } from 'react-router-dom'
import { InvestigatorContext } from 'contexts/InvestigatorContext'
import { GoogleLogin } from '@react-oauth/google'
import { ErrorCode } from 'api/schema'

const Register = () => {
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false)
  const [isPasswordAllowed] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [telephone, setTelephone] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [nonce] = useState(v4())

  const { register, registerGoogle } = InvestigatorContext()

  const navigate = useNavigate()

  useEffect(() => {
    // reenable this if you want investigators to create passwords upon registration, rather than after email confirmation
    // const params = new URLSearchParams(window.location.search);
    // let passwordParam = params.get("password");
    // setIsPasswordAllowed(passwordParam === "true");
  }, [])

  useEffect(() => {
    setIsSubmitButtonEnabled(
      firstName.length > 0 &&
        lastName.length > 0 &&
        emailAddress.length > 0 &&
        (!isPasswordAllowed || (password.length > 0 && password2.length > 0)) &&
        new RegExp(emailAddressRegex).test(emailAddress) &&
        new RegExp(telephoneRegex).test(telephone)
    )
  }, [
    isPasswordAllowed,
    firstName,
    lastName,
    emailAddress,
    telephone,
    password,
    password2,
  ])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    await attemptRegister(async () => {
      await register(firstName, lastName, emailAddress, telephone, password)
    })
  }

  const handleGoogleSubmit = async (credentialResponse: any) => {
    if (credentialResponse == null || credentialResponse.credential == null) {
      setErrorMessage(
        'An error occurred while attempting to sign in via Google: the remote system failed to return a valid credential token.'
      )
      return
    }

    await attemptRegister(async () => {
      await registerGoogle(credentialResponse.credential, nonce)
    })
  }

  const handleGoogleError = async () => {
    setErrorMessage('An error occurred while attempting to sign in via Google.')
  }

  const validate = () => {
    if (firstName.length === 0 || lastName.length === 0 || emailAddress.length === 0) {
      setErrorMessage(' ')
      return false
    }

    if (!new RegExp(emailAddressRegex).test(emailAddress)) {
      setErrorMessage('The email address you provided is not valid.')
      return false
    }

    if (isPasswordAllowed) {
      if (password.length === 0 || password2.length === 0) {
        setErrorMessage(' ')
        return false
      }

      if (password !== password2) {
        setErrorMessage('The passwords do not match.')
        return false
      }

      if (!new RegExp(passwordRegex).test(password)) {
        setErrorMessage(
          'The password does not meet the minimum complexity requirements.  Please make sure that your password is at least 8 characters and includes a lowercase letter, an uppercase letter, a number, and a symbol.'
        )
        return false
      }
    }

    return true
  }

  const attemptRegister = async (registerFunction: () => Promise<void>) => {
    await registerFunction()
      .then((result) => {
        navigate('/thankyou')
      })
      .catch((error) => {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setErrorMessage(
            'The request could not be completed, the backend API may not be configured correctly.'
          )
          return
        }

        const apiError = JSON.parse(error.response)

        switch (apiError?.errorCodeName) {
          case ErrorCode.AccountEmailAddressInvalid:
            setErrorMessage('The email address you provided is not valid.')
            break

          case ErrorCode.AccountPasswordDoesNotMeetMinimumComplexity:
            setErrorMessage(
              'The password does not meet the minimum complexity requirements.  Please make sure that your password is at least 8 characters and includes a lowercase letter, an uppercase letter, a number, and a symbol.'
            )
            break

          case ErrorCode.GoogleJwtBearerTokenInvalid:
            setErrorMessage(
              'Your account could not be validated by Google.  Please check that your Google account is valid and try again.'
            )
            break

          case ErrorCode.GoogleJwtNonceInvalid:
            setErrorMessage(
              'Your account could not be validated by Google, the nonce is invalid.  Please check that your Google account is valid and try again.'
            )
            break

          default:
            setErrorMessage(error.toString())
        }
      })
  }

  return (
    <UnauthenticatedLayout
      id="register"
      title="Register"
      message="Please enter your contact information below.  We'll send you an email confirming your account creation!"
      errorMessage={errorMessage}
      reversed={true}>
      <form
        className={errorMessage.length > 0 ? 'form-error' : ''}
        onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-6">
            <TextInput
              type="text"
              label="First name"
              name="first-name"
              value={firstName}
              required={true}
              onChange={(value: string) => setFirstName(value)}></TextInput>
          </div>
          <div className="col-lg-6">
            <TextInput
              type="text"
              label="Last name"
              name="last-name"
              value={lastName}
              required={true}
              onChange={(value: string) => setLastName(value)}></TextInput>
          </div>
        </div>
        <div className="mb-3">
          <TextInput
            type="text"
            label="Email address"
            name="email-address"
            value={emailAddress}
            required={true}
            onChange={(value: string) => setEmailAddress(value)}></TextInput>
        </div>
        <div className="mb-3">
          <TextInput
            type="telephone"
            label="Telephone"
            name="telephone"
            value={telephone}
            required={true}
            onChange={(value: string) => setTelephone(value)}></TextInput>
        </div>
        {!isPasswordAllowed ? (
          <></>
        ) : (
          <>
            <div className="mb-3">
              <TextInput
                type="password"
                label="Password"
                name="password"
                value={password}
                required={true}
                onChange={(value: string) => setPassword(value)}></TextInput>
            </div>
            <div className="mb-3">
              <TextInput
                type="password"
                label="Retype password"
                name="password2"
                value={password2}
                required={true}
                onChange={(value: string) => setPassword2(value)}></TextInput>
            </div>
          </>
        )}
        <div className="d-grid gap-2 mt-2">
          <button
            disabled={!isSubmitButtonEnabled}
            type="submit"
            className="styled-button">
            Register
          </button>
        </div>
        <div className="or-block">
          <span>OR</span>
        </div>
        <div id="social-login-buttons">
          <div id="google-login-button">
            <GoogleLogin
              nonce={nonce}
              onSuccess={(credentialResponse) => {
                handleGoogleSubmit(credentialResponse)
              }}
              onError={handleGoogleError}></GoogleLogin>
            <div id="google-login-override" className="styled-button">
              <span>Register using Google</span>
            </div>
          </div>
        </div>
        <div className="not-registered text-muted">
          <Link className="simple-link" to="/signin">
            Return to sign-in page
          </Link>
        </div>
      </form>
    </UnauthenticatedLayout>
  )
}

export default Register
