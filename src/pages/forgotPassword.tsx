import { useResetPasswordMutation, useSendOTPMutation, useVerifyOTPMutation } from '@/utils/adminHook';
import {
    EuiButton,
    EuiFieldText,
    EuiFlexGroup,
    EuiFlexItem,
    EuiForm,
    EuiFormRow,
    EuiImage,
    EuiLoadingSpinner,
    EuiPageTemplate,
    EuiPanel,
    EuiProgress,
    EuiSpacer,
    EuiText,
    EuiTitle,
} from '@elastic/eui';
import { isAxiosError } from 'axios';
import { Fragment, useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otpMenu, setOtpMenu] = useState(false)
    const [userOtp, setUserOtp] = useState('')
    const [enablePasswordUpdate, setPasswordUpdate] = useState(false)
    const [userPassword, setUserPassword] = useState('')
    const { data: otpData, isError: isSendOtpError, error: sendOtpError, isLoading: sendOtpLoading, mutateAsync: sendOTP } = useSendOTPMutation()
    const { data: verifyOtpData, isLoading: verfiyOtpLoading,isError:isVerifyOtpError, error:verifyOtpError, mutateAsync: verifyOtp } = useVerifyOTPMutation()
    const { data: resetPasswordData, isLoading: resetPasswordLoading, mutateAsync: resetPassword } = useResetPasswordMutation()

    const handleForgotPassword = async () => {
        setOtpMenu(false)
        setPasswordUpdate(false)
        try {
            const response = await sendOTP({
                accountVerification: true,
                email
            })
            setOtpMenu(true)
            if (response.data.success) {
                setOtpMenu(true)
            }
        } catch (err: any) {
            if (isAxiosError(err)) {
                return
            }
        }
    };

    const onVerifyOtp = async () => {
        setPasswordUpdate(false)
        try {
            await verifyOtp({
                email,
                otp: userOtp
            })
            setOtpMenu(false)
            setPasswordUpdate(true)
        } catch (e) {
            console.log("failed on verfiying the otp")
        }
    }

    const onResetPassword = async () => {
        try {
            await resetPassword({
                email,
                password: userPassword
            })
        } catch (e) {
            console.log("error on reset password")
        }
    }

    return (
        <Fragment>
            <EuiPageTemplate
                panelled={true}
                bottomBorder={true}
                grow={true}
                restrictWidth={false}
            >

                <EuiPageTemplate.Header style={{ maxHeight: '150px', backgroundColor: 'black' }}>
                    <EuiFlexGroup
                        alignItems="center"
                        justifyContent="spaceBetween"
                        responsive={false}
                        css={`
                @media (max-width: 600px) {
                    flex-direction: column;
                    align-items: flex-start;
                }
            `}
                    >
                        <EuiFlexItem grow={false}>
                            <EuiImage src="/logo.png" alt="logo" style={{ height: 'auto', maxHeight: '50px' }} />
                        </EuiFlexItem>
                        <EuiFlexItem
                            grow={false}
                            style={{ margin: '0 auto' }}
                            css={`
                    @media (max-width: 600px) {
                        margin: 0;
                        text-align: center;
                        width: 100%;
                    }
                `}
                        >
                            <EuiTitle textTransform="uppercase">
                                <EuiText style={{ fontSize: '20px', color: '#909090' }}>
                                    <span style={{ color: 'orange' }}>Reset your</span> Password
                                </EuiText>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false} style={{ width: '50px' }} />
                    </EuiFlexGroup>
                </EuiPageTemplate.Header>


                <EuiPageTemplate.Section grow={false} bottomBorder={true}>
                    {!otpMenu && !enablePasswordUpdate && <div className="login-container">
                        <EuiPanel className="login-panel">
                            <EuiFlexGroup direction="column" alignItems="center">
                                <EuiFlexItem grow={false}>
                                    <EuiTitle size="m">
                                        <h2>Forgot Password</h2>
                                    </EuiTitle>
                                </EuiFlexItem>
                                {sendOtpLoading && <EuiLoadingSpinner size='l'/>}
                                {otpData?.data.success && (
                                    <EuiFormRow>
                                        <div style={{ color: 'green', textAlign: 'center' }}>{otpData.data.message}</div>
                                    </EuiFormRow>
                                )}
                                {isSendOtpError && (
                                    <EuiFormRow>
                                        <div style={{ color: 'red', textAlign: 'center' }}>{sendOtpError.response?.data.message || sendOtpError.message}</div>
                                    </EuiFormRow>
                                )}
                                <EuiSpacer size="s" />
                                <EuiFlexItem grow={false} style={{ width: '100%' }}>
                                    <EuiForm component="form">
                                        <EuiFormRow label="Email">
                                            <EuiFieldText
                                                name="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </EuiFormRow>
                                        <EuiSpacer size="m" />
                                        <EuiFlexGroup justifyContent="flexEnd">
                                            <EuiFlexItem grow={false}>
                                                <EuiButton type="button" fill onClick={handleForgotPassword}>
                                                    Send Reset OTP
                                                </EuiButton>
                                            </EuiFlexItem>
                                            <EuiFlexItem>
                                                <EuiButton href='/login'>
                                                    Go to login
                                                </EuiButton>
                                            </EuiFlexItem>
                                        </EuiFlexGroup>
                                    </EuiForm>
                                </EuiFlexItem>
                            </EuiFlexGroup>
                        </EuiPanel>
                    </div>}
                    {otpMenu && !enablePasswordUpdate &&
                        <div className="login-container">
                            <EuiPanel className="login-panel">
                                {verfiyOtpLoading &&  <EuiLoadingSpinner size='l'/>}
                                {verifyOtpData?.data.success && (
                                    <EuiFormRow>
                                        <div style={{ color: 'green', textAlign: 'center' }}>{verifyOtpData.data.message}</div>
                                    </EuiFormRow>
                                )}
                                {isVerifyOtpError && (
                                    <EuiFormRow>
                                        <div style={{ color: 'red', textAlign: 'center' }}>{verifyOtpError.response?.data.message || verifyOtpError.message}</div>
                                    </EuiFormRow>
                                )}
                                <EuiFormRow label={"Enter otp:"}>
                                    <EuiFieldText onChange={e => setUserOtp(e.target.value)} />
                                </EuiFormRow>
                                <EuiFormRow>
                                <EuiFlexGroup>
                                    <EuiButton color='success' onClick={onVerifyOtp}>Verify OTP</EuiButton>
                                    <EuiButton color='accent' onClick={handleForgotPassword}>Resend OTP</EuiButton>
                                </EuiFlexGroup>
                                </EuiFormRow>
                            </EuiPanel>
                        </div>}

                    {enablePasswordUpdate && !otpMenu &&
                        <div className="login-container">
                            <EuiPanel className="login-panel">
                                {resetPasswordLoading &&  <EuiLoadingSpinner size='l'/>}
                                <EuiFormRow label={"Enter New Password:"}>
                                    <EuiFieldText onChange={e => setUserPassword(e.target.value)} />
                                </EuiFormRow>
                                <EuiFormRow>
                                    <EuiButton onClick={onResetPassword}>Reset Password</EuiButton>
                                </EuiFormRow>
                            </EuiPanel>
                        </div>}
                </EuiPageTemplate.Section>

            </EuiPageTemplate>
        </Fragment>
    );
};

export default ForgotPassword;
