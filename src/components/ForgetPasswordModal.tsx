"use client"
import { Admin } from "@/utils/adminApi"
import { useEmailSigninMutation, useResetPasswordMutation } from "@/utils/adminHook"
import { EuiButton, EuiButtonEmpty, EuiFieldText, EuiFlexGroup, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiPageTemplate, EuiProgress } from "@elastic/eui"
import { useRouter } from "next/navigation"
import { Fragment, FunctionComponent, useState } from "react"

export interface ForgetPasswordModalProps{
    user:Admin|undefined
}
const ForgetPasswordModal:FunctionComponent<ForgetPasswordModalProps> = ({
    user
}) => {
    const [oldPassword,setOldPassword]=useState('')
    const [newPassword,setNewPassword]=useState<{newPassword:string,confirmNewPassword:string}>({
        confirmNewPassword:'',
        newPassword:''
    })
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false)
    const {error:validatePasswordErr,isError:isValidatePasswordErr,isSuccess:isValidatePasswordSuccess,isLoading:isValidatePasswordLoading,mutateAsync:validatePassword,reset} = useEmailSigninMutation(true)
    const {data:resetPasswordData, error:resetPasswordErr,isError:isResetPasswordErr, isSuccess:isResetPasswordSuccess, isLoading:isResetPasswordLoading, mutateAsync:resetPasswordMutation, reset:resetPassswordReset} = useResetPasswordMutation()
    const [passswordMismatchErr,setPasswordMismatchErr]=useState<string|undefined>(undefined)
    const router = useRouter()

    const validateOldPassword = async () => {
        if (!!user){
            try{
                 await validatePassword({
                    email:user.email,
                    userName:user.userName,
                    password:oldPassword
                })
                return
            }catch(e){
                console.log("error on validating password:",e)
            }  
        }
    }

    const resetPassword = async () =>{
        setPasswordMismatchErr(undefined)
        if (newPassword.newPassword==newPassword.confirmNewPassword){
            await resetPasswordMutation({
                email:user?.email || '',
                password:newPassword.confirmNewPassword
            })
            setTimeout(() => {
                    localStorage.removeItem('token')
                    router.push('/login')
            }, 2000);
        }else{
            setPasswordMismatchErr('Password does not match!')
            return
        }
    }

    return <Fragment>
        <EuiButtonEmpty onClick={() => { setOpenChangePassword(true) }} style={{ marginLeft: '-10px',marginRight:'10px' }} iconType="pencil" iconSize="s" size="s">change password</EuiButtonEmpty>
        {openChangePassword && <EuiPageTemplate.Section>
            <EuiModal aria-labelledby={"Error"} style={{ width: 800 }} onClose={() => { setOpenChangePassword(false); reset() }}>
                    {isValidatePasswordLoading || isResetPasswordLoading && <EuiProgress size="s" color="green" />}
                <EuiModalHeader>
                    <EuiModalHeaderTitle >Change <span style={{color:'orange'}}>Password</span></EuiModalHeaderTitle>
                </EuiModalHeader>

                <EuiModalBody>
                    {isValidatePasswordErr && <p style={{color:'red'}}>{validatePasswordErr.response?.data.message}</p>}
                    {isResetPasswordErr && <p style={{color:'red'}}>{resetPasswordErr.response?.data.message}</p>}
                    {isResetPasswordSuccess && <p style={{color:'green'}}>{resetPasswordData.data.message}!</p>}
                    {!!passswordMismatchErr && <p style={{color:'red'}}>{passswordMismatchErr}</p>}

                    <EuiFormRow label={"Enter Old Password: "}>
                            <EuiFormRow isDisabled={true} >
                            <EuiFlexGroup >
                            <EuiFieldText onChange={e=>setOldPassword(e.target.value)} type="password" compressed></EuiFieldText>
                            <EuiButton disabled={isValidatePasswordSuccess} size="s" onClick={validateOldPassword}>Validate</EuiButton>
                            </EuiFlexGroup>
                            </EuiFormRow>
                    </EuiFormRow>
                    <EuiFormRow isDisabled={!isValidatePasswordSuccess} label={"Set New Password: "}>
                        <EuiFieldText onChange={e=>{setNewPassword({
                            newPassword:e.target.value,
                            confirmNewPassword:newPassword.confirmNewPassword
                        }); setPasswordMismatchErr(undefined)}} type="password" compressed></EuiFieldText>
                    </EuiFormRow>
                    <EuiFormRow isDisabled={!isValidatePasswordSuccess} label={"Confirm New Password: "}>
                        <EuiFieldText onChange={e=>{setNewPassword({
                            newPassword:newPassword.newPassword,
                            confirmNewPassword: e.target.value
                        }); setPasswordMismatchErr(undefined)}} type="password"  compressed></EuiFieldText>
                    </EuiFormRow>
                </EuiModalBody>

                <EuiModalFooter>
                    <EuiButton color="success" size="s" onClick={resetPassword} fill>
                        Change Password
                    </EuiButton>
                    <EuiButton color="primary" size="s" onClick={() => { setOpenChangePassword(false);reset();setPasswordMismatchErr(undefined) }} fill>
                        Close
                    </EuiButton>
                </EuiModalFooter>
            </EuiModal>
        </EuiPageTemplate.Section>}
</Fragment>
}

export default ForgetPasswordModal