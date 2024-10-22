import { LandingLayout } from "layouts/LandingLayout"
import { Link, useNavigate } from "react-router-dom"

const Index = () => {
 
  const navigate = useNavigate();

  return (
    <LandingLayout id="index" image="landing.jpg">  
    <div className="logo-container">
      <img className="logo" src="logo-white.png"></img>
      <Link className="styled-button signin-button" to={"/signin"} >Sign in</Link>      
    </div>
    <div className="container">
      <div className="content">
        <div className="title">Property insurance SIU<br/>And fraud recovery</div>
        <div className="subtitle">Contact us for a free AI-powered analysis of your claims database.</div>
        <div className="button-row">
          <Link className="styled-button" to={"/register"} >Register Now</Link>
        </div>        
      </div>
     </div>
    </LandingLayout>
  )
}

export default Index