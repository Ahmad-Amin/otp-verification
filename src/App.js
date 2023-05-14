import React, { useState } from 'react';
import OtpInput from 'otp-input-react'
import {CgSpinner} from 'react-icons/cg'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css"
import {auth} from './firebase.config.js'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from 'react-hot-toast';


function App() {

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('')
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useState(null);


  const onCaptchVertify = () => {
    if(!window.recaptchaVerifier){
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignup()
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
        }
      }, auth);
    }
  }

  const onSignup = () => {
    setLoading(true);
    onCaptchVertify();

    const appVerifier = window.recaptchaVerifier
    const formatPhone = '+' + phone
    signInWithPhoneNumber(auth, formatPhone, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShowOtp(true);
      toast.success('Otp sended successfully!');


    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });

  }

  const onOtpVerify = () => {
    setLoading(true);
    window.confirmationResult.confirm(otp).then(async(res) => {
      console.log(res);
      setUser(res.user)
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      console.log(err);
    })
  }

  return (
    <section className="bg-emerald-500 flex items-center justify-center">
      <div>
        <Toaster toastOptions={{duration: 4000}} />
        <div id="recaptcha-container"></div>

        { user ? (
          <h2 className='text-center text-white font-medium text-3xl mb-6'>
            OTP verified Succesfully
          </h2>
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6"> Welcome To <br/> CODE A PROGRAM</h1>

            {showOtp ? (
              <>
                <label htmlFor="phone" className="font-bold text-xl text-white text-center">Enter your OTP</label>
                <OtpInput 
                  value={otp} 
                  onChange={setOtp} 
                  autoFocus 
                  OTPLength={6} 
                  otpType="number" 
                  disabled={false} 
                  secure 
                  className="otp-container"
                />
                <button onClick={onOtpVerify} className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                  { loading && <CgSpinner size={20} className="mt-1 animate-spin"  /> }
                  
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <label htmlFor="phone" className="font-bold text-xl text-white text-center">Verify your phone Number</label>
                <PhoneInput 
                  country={'pk'}
                  value={phone}
                  onChange={setPhone}
                />
                
                <button onClick={onSignup} className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded">
                  { loading && <CgSpinner size={20} className="mt-1 animate-spin"  /> }
                  
                  <span>Send code via SMS</span>
                </button>
              </>
            )

            }
          </div>
        )}

        

        

      </div>
    </section>  
  );
}

export default App;
