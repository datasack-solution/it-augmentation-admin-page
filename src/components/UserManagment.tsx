import { Admin } from "@/utils/adminApi"
import { useEmailSignUpMutation, useUpdateUserMutation } from "@/utils/adminHook"
import { EuiButton, EuiFieldText, EuiFlexGroup, EuiForm, EuiFormRow, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiProgress, EuiSelect, EuiSpacer } from "@elastic/eui"
import { useRouter } from "next/navigation"
import { FunctionComponent, useState } from "react"
import { useForm } from "react-hook-form"

export interface UserManagementProps {
    handleClose: () => void
    isEdit?: boolean,
    editUser?: Admin,
    currentUser?: Admin
}
const UserManagement: FunctionComponent<UserManagementProps> = ({
    editUser,
    isEdit,
    handleClose,
    currentUser
}) => {
    const { watch, setValue, register, handleSubmit } = useForm<Admin>({
        defaultValues: isEdit ? {
            ...editUser
        } : {
            email: "",
            password: "",
            role: 'user',
            userName: ""
        }
    })
    const { isError: isCreateUserError, error: createUserError, isLoading: isCreateUserLoading, mutateAsync: createUser } = useEmailSignUpMutation()
    const { isError: isUpdateUserError, error: updateUserError, isLoading: isUpdateUserLoading, mutateAsync: updateUser } = useUpdateUserMutation()
    const [warning, setWarning] = useState<{ user: Admin | undefined, isOpen: boolean }>({
        isOpen: false,
        user: undefined
    })
    const router = useRouter()
    const user = watch()


    const warningCumUpdate = async (admin: Admin) => {
        try {
            await updateUser(admin)
            localStorage.removeItem('token')
            router.push('/login')
            return
        } catch (e) {
            console.log("error on update user:", e)
        }
    }


    const onSubmit = async (admin: Admin) => {
        if (isEdit) {
            try {
                if (admin.role == 'admin' && currentUser?.email != admin.email) {
                    setWarning({
                        isOpen: true,
                        user: admin
                    })
                    return
                }
                await updateUser(admin)
                handleClose()
            } catch (e) {
                console.log("error on update user", e)
            }
        } else {
            try {
                await createUser(admin)
                handleClose()
            } catch (e) {
                console.log("error on create user", e)
            }

        }
    }
    return <>
        {isCreateUserError && <p style={{ color: 'red', textAlign: 'center' }}>{createUserError.response?.data.message || createUserError.message}</p>}
        {isUpdateUserError && <p style={{ color: 'red', textAlign: 'center' }}>{updateUserError.response?.data.message || updateUserError.message}</p>}
        {(isCreateUserLoading || isUpdateUserLoading) && <EuiProgress size="s" />}
        <EuiForm component="form" onSubmit={handleSubmit(onSubmit)}>
            <EuiFormRow label="Name">
                <EuiFieldText value={user.userName} placeholder="Enter Username" onChange={e => { setValue('userName', e.target.value) }} />
            </EuiFormRow>
            <EuiFormRow label="Email">
                <EuiFieldText type="email" value={user.email} disabled={isEdit} placeholder="Enter Email" onChange={e => { setValue('email', e.target.value) }} />
            </EuiFormRow>
            {!isEdit && <EuiFormRow label="Create Password">
                <EuiFieldText type="password" placeholder="Enter Password" value={user.password} onChange={e => { setValue('password', e.target.value) }} />
            </EuiFormRow>}
            <EuiFormRow label="Role">
                <EuiSelect value={user.role} onChange={e => setValue('role', e.target.value as "user" | "admin")} options={[
                    {
                        text: 'Admin',
                        value: 'admin',
                        disabled: !isEdit
                    }, {
                        text: "User",
                        value: 'user',
                        disabled: editUser?.role == 'admin' && isEdit
                    }
                ]}>
                </EuiSelect>
            </EuiFormRow>
            <EuiFormRow>
                <EuiFlexGroup>
                    <EuiButton size="s" color="success" type="submit">{isEdit ? 'Update User' : 'Add User'}</EuiButton>
                    <EuiButton size="s" color="warning" type="button" onClick={handleClose}>Go Back</EuiButton>
                </EuiFlexGroup>
            </EuiFormRow>
        </EuiForm>

        {warning.isOpen && <EuiModal onClose={() => setWarning({
            isOpen: false,
            user: undefined
        })}>
            <EuiModalHeader style={{ backgroundColor: 'black' }}>
            <strong style={{color:'white'}}><span style={{color:'orange'}}>Privilege Change</span> Warning</strong>
            </EuiModalHeader>
            <EuiModalBody>
                You are promoting this user (<b style={{color:'green'}}>{warning.user?.userName}</b>) as <b>admin</b>. Are you sure?
                <EuiSpacer size="s"/>
                <p>Once you changed the privilege, the page will redirect to login page.</p>
            </EuiModalBody>
            <EuiModalFooter>
                <EuiFlexGroup>
                    <EuiButton size="s" color="danger" onClick={()=>{
                        if (warning.user){
                            warningCumUpdate(warning.user)
                        }
                    }}>Continue</EuiButton>
                    <EuiButton size="s" color="warning" onClick={() => {
                        setWarning({
                            isOpen: false,
                            user: undefined
                        })
                    }}>Cancel</EuiButton>
                </EuiFlexGroup>
            </EuiModalFooter>
        </EuiModal>}
    </>
}

export default UserManagement