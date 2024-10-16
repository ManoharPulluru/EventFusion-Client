import React, { useContext, useState, useEffect } from "react";
import "./SignIn.css";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/AppContext";
import Cookies from "js-cookie";
import googlePng from "../../assets/google.png";
import page1 from "../../assets/page1.png";
import page2 from "../../assets/page2.png";
import page3 from "../../assets/page3.png";

const clientId = "311151984401-7sn1k89h66pse9jk45feppc85bk8k0s9.apps.googleusercontent.com";

const SignIn = () => {
  const navigate = useNavigate();
  const { triggerSetToken } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const images = [page1, page2, page3]; // Image array
  const content = ["Create Events", "Sync to Calendars", "Share with Friends"]; // Text array

  // Function to handle login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await userInfoResponse.json();
        // console.log(userInfo);
        setUserDetails(userInfo);

        // Set the token in context
        triggerSetToken(tokenResponse.access_token);

        // Store the token and Google ID in cookies/localStorage
        Cookies.set("authToken", tokenResponse.access_token, { expires: 7 });
        localStorage.setItem("googleID", userInfo.id);

        // POST user details to the server
        const response = await fetch("https://eventfusion-server.onrender.com/user/registerUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            given_name: userInfo.given_name,
            picture: userInfo.picture,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          // console.log(data.message);
          navigate("/landingPage");
        } else {
          console.error(data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  // Effect to check for existing authentication token and Google ID on page load
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    const googleID = localStorage.getItem("googleID");

    if (authToken && googleID) {
      console.log("Auth token and Google ID found. Redirecting to landing page...");
      triggerSetToken(authToken);
      navigate("/landingPage");
    }
  }, [navigate, triggerSetToken]);

  // Image slideshow logic
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Loop through images
    }, 4000); // Change every 4 seconds

    return () => clearInterval(imageInterval); // Cleanup interval on component unmount
  }, [images.length]);

  // Text slideshow logic
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prevText) => (prevText + 1) % content.length); // Loop through text
    }, 4000); // Change every 4 seconds

    return () => clearInterval(textInterval); // Cleanup interval on component unmount
  }, [content.length]);

  return (
    <div className="SigninMain">
      <div className="SigninRow1">
        <img src={Logo} alt="Logo" />
      </div>
      <div className="SigninRow2">
        <div className="SignInButtons">
          <GoogleOAuthProvider clientId={clientId}>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <img src={googlePng} alt="google" className="googlePng" />
              <div className="btn-holder">
                <button onClick={login} className="btn btn-5 hover-border-11">
                  <span>Sign In/Up With Google</span>
                </button>
              </div>
            </div>
          </GoogleOAuthProvider>
        </div>
        <div className="AboutAppButtons">
          <h1>{content[currentText]}</h1> {/* Render current text */}
          <img
            src={images[currentImage]}
            alt="Slideshow"
            className="slideshow-image"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
