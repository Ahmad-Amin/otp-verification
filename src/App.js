import React, { useState } from 'react';
import OtpInput from 'otp-input-react'
import {CgSpinner} from 'react-icons/cg'
import PhoneInput from 'react-phone-input-2';
import "react-phone-input-2/lib/style.css"
import {auth} from './firebase.config.js'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from 'react-hot-toast';
import "./App.css"

import Card from './components/card'


function App() {

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('')
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useState(null);
  const [correctOtp, setCorrectOtp] = useState(true)


  const onCaptchVertify = () => {
    if(!window.recaptchaVerifier){
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          onSignup()
        },
        'expired-callback': () => {
          
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
      toast.error('Incorrect OTP..!');
      console.log(err);
    })
  }

  return (
    <section className="flex items-center justify-center">
      <div>
        <Toaster toastOptions={{duration: 4000}} />
        <div id="recaptcha-container"></div>

        { user ? (
          <h2 className='text-center font-medium text-3xl mb-6'>
            OTP verified Succesfully
          </h2>
        ) : (
          <div className=" flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6"> Welcome To <br/> CODE A PROGRAM</h1>

            {showOtp ? (
                <Card 
                  inputContent={otp} 
                  setInputContent={setOtp} 
                  onSignup={onSignup} 
                  loading={loading}
                  type={false} 
                  onOtpVerify={onOtpVerify}
                />
            ) : (
              <Card 
                inputContent={phone} 
                setInputContent={setPhone} 
                onSignup={onSignup} 
                loading={loading}
                type={true} 
              />
            )
            }
          </div>
        )}
      </div>
    </section>  
  );
}

export default App;
