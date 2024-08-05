import { Admin } from "@/utils/adminApi"
import { useDeleteAdminMutation, useGetUsers } from "@/utils/adminHook"
import { EuiBadge, EuiBasicTableColumn, EuiBeacon, EuiButton, EuiButtonEmpty, EuiButtonIcon, EuiFlexGroup, EuiHealth, EuiInMemoryTable, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiProgress, EuiSpacer } from "@elastic/eui"
import { Fragment, FunctionComponent, useState } from "react"
import UserManagement from "./UserManagment"
import { useRouter } from "next/navigation"

export interface UsersTableProps{
    currentUser:Admin|undefined
}
const UsersTable:FunctionComponent<UsersTableProps> = ({
    currentUser
}) => {
    const [isModalOpen, setModalOpen] = useState(false)
    const { data: userData, isLoading: getUsersLoading, error: getUsersError } = useGetUsers(2)
    const [editUser, setEditUser] = useState<{ user: Admin | undefined, isOpen: boolean, isEdit: boolean }>({
        user: undefined,
        isOpen: false,
        isEdit: false,
    })
    const { isLoading: isDeleteUserLoading, error: deleteUserError, mutateAsync: deleteUser } = useDeleteAdminMutation()
    const [deleteOpen, setDeleteOpen] = useState<{ user: Admin | undefined, isOpen: boolean }>({ user: undefined, isOpen: false })
    const router = useRouter()

    const onDeleteUser = async (user: Admin | undefined) => {
        try {
            if (user)
                if (user.email==currentUser?.email){
                    alert("you are deleting your account. are you sure want to delete?")
                    await deleteUser(user.email)
                    window.localStorage.removeItem('token')
                    router.push('/login')
                }
                await deleteUser(user?.email||'')
            setDeleteOpen({
                isOpen: false,
                user: undefined
            })
        } catch (e) {
            console.log("error on delete user:", e)
        }
    }


    const columns: EuiBasicTableColumn<Admin>[] = [
    {
        name: 'User Name',
        render:(user:Admin)=><>{(user.email==currentUser?.email) ? <Fragment>{user.userName}<EuiHealth textSize="xs" color="success"/> 
       </Fragment  > : user.userName}</>
    },
    {
        name: "Role",
        render:(user:Admin)=><>{user.role=='admin'? <EuiBadge color="success">Admin</EuiBadge> : <EuiBadge color="warning">User</EuiBadge>}</>
    },
    {
        field: 'email',
        name: "Email"
    },
    {
        name: "Edit User",
        actions: [
            {
                render: (user) => {
                    return <EuiButtonIcon size="xs" aria-labelledby="edit-user" color="primary" iconType="pencil" onClick={() => {
                        setEditUser({
                            user,
                            isOpen: true,
                            isEdit: true
                        });
                    }} />
                }
            },
            {
                render: (user) => {
                    return <EuiButtonIcon size="xs" aria-labelledby="delete-user" color="danger" iconType="trash" onClick={() => {
                        setDeleteOpen({
                            user,
                            isOpen: true
                        })
                    }} />
                }
            }
        ]
    }
    ]

    const currentUserAsAdminToDelete = (currentUser?.email==deleteOpen.user?.email) && (currentUser?.role=='admin' && deleteOpen.user?.role=='admin')

    return <Fragment>
        <EuiButtonEmpty style={{ marginLeft: '-10px' }} iconSize="s" size="s" iconType="gear" onClick={() => { setModalOpen(true) }} >user management</EuiButtonEmpty>

        {isModalOpen && <EuiModal onClose={() => {
            setModalOpen(false), setEditUser({
                isOpen: false,
                user: undefined,
                isEdit: false,
            })
        }}>
            <EuiModalHeader style={{ backgroundColor: 'black' }}>
                <strong><span style={{ color: 'orange' }}>User Management</span><span style={{ color: '#909090' }}> Portal</span></strong>
            </EuiModalHeader>
            <EuiModalBody>
                {!editUser.isOpen && <Fragment><EuiButtonIcon iconType="plus" aria-labelledby="add-user" onClick={() => {
                    setEditUser({
                        isOpen: true,
                        user: undefined,
                        isEdit: false
                    })
                }} />
                    <EuiInMemoryTable loading={getUsersLoading}
                        error={getUsersError?.response?.data.message || getUsersError?.message || deleteUserError?.response?.data.message || deleteUserError?.message}
                        pagination={{
                            pageSize: 5,
                            pageSizeOptions: [5]
                        }}
                        compressed items={userData?.users || []} columns={columns} /></Fragment>}

                {editUser.isOpen && <UserManagement editUser={editUser.user} isEdit={editUser.isEdit} currentUser={currentUser}
                    handleClose={() => {
                        setEditUser({
                            isOpen: false,
                            user: undefined,
                            isEdit: false
                        })
                    }} />}
            </EuiModalBody>
            <EuiModalFooter>
            </EuiModalFooter>
        </EuiModal>}


        {deleteOpen.isOpen && <EuiModal onClose={() => {
            setDeleteOpen({
                isOpen: false,
                user: undefined
            })
        }}>
            {isDeleteUserLoading && <EuiProgress />}
            <EuiModalHeader style={{ backgroundColor: 'black' }}>
                {!currentUserAsAdminToDelete &&<strong style={{ color: 'white' }}><span style={{ color: 'orange' }}>Confirm</span> Delete?</strong>}
           {currentUserAsAdminToDelete &&<strong style={{ color: 'white' }}><span style={{ color: 'orange' }}>Warning</span></strong> }
            </EuiModalHeader>
            <EuiModalBody>
                {currentUserAsAdminToDelete && 
                <p>You cannot <span style={{color:'red',fontWeight:'bold'}}>delete</span> your account, unless you transfer your <strong>admin privilege</strong> to other users.</p>}

                {currentUser?.email!==deleteOpen.user?.email&& !currentUserAsAdminToDelete && <p>Do you want to delete user <strong>{deleteOpen.user?.userName}</strong>?</p>}
                {currentUser?.email==deleteOpen.user?.email && !currentUserAsAdminToDelete && <>
                <p>You are deleting your account <strong>({deleteOpen.user?.userName})</strong>. Are you sure want <strong style={{color:'red'}}>to delete?</strong></p>
                <EuiSpacer size="s" />
                <p>Once Deleted, Page will redirect to login page.</p></>
                }
            </EuiModalBody>
            <EuiModalFooter>
                <EuiFlexGroup>
                    <EuiButton disabled={currentUserAsAdminToDelete} size="s" color="danger" onClick={() => { onDeleteUser(deleteOpen.user) }}>Delete</EuiButton>
                    <EuiButton size="s" color="warning" onClick={() => {
                        setDeleteOpen({
                            isOpen: false,
                            user: undefined
                        })
                    }}>Cancel</EuiButton>
                </EuiFlexGroup>
            </EuiModalFooter>
        </EuiModal>}
    </Fragment>
}

export default UsersTable