import "bootstrap/dist/css/bootstrap.css"
import { useEffect, useState } from "react"
import { UnauthenticatedLayout } from "layouts/UnauthenticatedLayout"
import { ErrorCode } from "helpers/errorcodes"
import { Link } from "react-router-dom"
import { AccountManagementContext } from "contexts/AccountManagementContext"

const ConfirmAccount = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [token, setToken] = useState("");
  const [isPasswordResetRequired, setIsPasswordResetRequired] = useState(false);
  const [title, setTitle] = useState("Confirming Account");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const { confirmAccount } = AccountManagementContext();
   
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const paramToken = params.get("token");
      const paramEmailAddress = params.get("emailAddress");

      if (paramToken === null || paramEmailAddress === null) {
        setErrorMessage("The link does not contain the required information in order to confirm your account.  Please try copying and pasting the link directly from the email you received.");
        return;
      }

      setEmailAddress(paramEmailAddress!);
      setToken(paramToken!);

      const asyncApiConfirmAccount = async (paramEmailAddress: string, paramToken: string) => {
        await apiConfirmAccount(paramEmailAddress, paramToken);
      }

      asyncApiConfirmAccount(paramEmailAddress!, paramToken!);
    }, []);

  const apiConfirmAccount = async (emailAddress: string, token: string): Promise<void> => {    
    await confirmAccount(emailAddress, token)
      .then(result => {
        // note, even if the email or token are wrong, this will display.  
        // I don't want to have an un-authenticated method that allows bots
        // to browse for valid accounts
        setTitle("Account Confirmed!");
        setMessage("Please click the button below to sign in and get started.")
        setIsConfirmed(true);        
      })
      .catch(error => {
        switch (error?.response?.data?.errorCode) {
          case ErrorCode.AccountAlreadyConfirmed:
            setMessage("Your account has already been confimed.  Click the button below to sign in and get started!");
            setIsConfirmed(true);
            return;

          case ErrorCode.AccountMagicUrlTokenExpired:
            setErrorMessage("Your account confirmation link has expired.  Please <a href='/forgotpassword'>request a new password</a> to generate a new link.");
            break;

          default:
            setErrorMessage(error?.response?.data?.message ?? JSON.stringify(error));
            break;   
        }

        setTitle("Account Confirmation Failed");      
      });
  }

  return (
    <UnauthenticatedLayout id='confirmaccount' title={title} message={message} errorMessage={errorMessage}>
      {!isConfirmed ? <></> :
        <form>
          <div>
            <div>
              { (isPasswordResetRequired) ?
                <Link to={`/setpassword?emailAddress=${encodeURIComponent(emailAddress)}&token=${token}&isAccountConfirmed=false`} className="styled-button">Create new password</Link>                
              :
                <Link to={`/signin?emailAddress=${encodeURIComponent(emailAddress)}`} className="styled-button">Sign in</Link>                
              }
            </div>
          </div>
        </form>
      }
    </UnauthenticatedLayout>  
  )
}

export default ConfirmAccount