import React from 'react';
import PhoneInput from 'react-phone-input-2';
import {CgSpinner} from 'react-icons/cg'
import OtpInput from 'otp-input-react'

const Card = ({inputContent, setInputContent, onSignup, loading, type, onOtpVerify}) => {

	return(
		<div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 shadow-lg my-28">
				<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white underline">OTP Verification</h5>
				<label htmlFor="phone" className="font-bold text-xl text-white text-center">Verify your phone Number</label>

				{ type ? (
					<PhoneInput 
						country={'pk'}
						value={inputContent}
						onChange={setInputContent}
					/>
				) : (
					<OtpInput 
						value={inputContent} 
						onChange={setInputContent} 
						autoFocus 
						OTPLength={6} 
						otpType="number" 
						disabled={false} 
						className="otp-container"
					/>
				) }

				
				
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 my-5">An OTP will be send to your mobile number via SMS. Use it to verify your identity</p>

				<button onClick={ type ? onSignup : onOtpVerify} className="inline-flex items-center justify-end px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
					{ loading && <CgSpinner size={20} className="mt-1 animate-spin"  /> }

					<span>{type ? 'Send code via SMS' : 'Verify OTP' }</span>
				</button>

		</div>
	)

}

export default Card