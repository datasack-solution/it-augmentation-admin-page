import ClientTableArrSkillSets from "@/components/ClientTableArrSkillSets"
import ForgetPasswordModal from "@/components/ForgetPasswordModal"
import UsersTable from "@/components/UserTable"
import { useAuthUser } from "@/utils/adminHook"
import { EuiBadge, EuiButton, EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiImage, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiModalHeaderTitle, EuiPageTemplate, EuiSpacer, EuiText, EuiTitle } from "@elastic/eui"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Fragment, FunctionComponent, useEffect, useState } from "react"

const AdminHomePage: FunctionComponent = () => {
    const { data, mutateAsync: authAdmin } = useAuthUser()
    const [token, setToken] = useState<string | null>(null)
    const router = useRouter();
    const onSignOut = async () => {
        try {
            localStorage.removeItem('token')
            router.push('/login')
        } catch (e) {
            console.log("signout failed: ", e)
        }
    }

    useEffect(() => {
        const validateSession = async (token: string) => {
            try {
                await authAdmin(token)
            } catch (e) {
                console.log("session not found: " + e)
                router.push('/login')
            }
        }
        const token = window.localStorage.getItem('token');
        setToken(token)
        if (token == null) {
            router.push('/login')
        }
        if (token != null) {
            validateSession(token)
        }
    }, [router, authAdmin]);

    const currentUser = data?.data.user

    return (
        <Fragment>
            <Head>
                <title>Admin - Datasack Solutions</title>
                <meta title="title" content="Datasack Solutions Admin Page" />
                <meta name="description" content="Get the right talent at the right price. Find DataSack's IT Staff Augmentation Services in Dammam and Riyadh. Resolve skill shortages for project excellence." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {token != null && <EuiPageTemplate
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
                                    <span style={{ color: 'orange' }}>Datasack Client</span> Records
                                </EuiText>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false} style={{ width: '50px' }} />
                    </EuiFlexGroup>
                </EuiPageTemplate.Header>



                <EuiPageTemplate.Section grow={false} bottomBorder={true}>
                    <EuiFlexGroup>
                        <EuiFlexItem >
                            
                            <div>
                            <p style={{ fontWeight: 'bold',fontSize:'12px'}}>Name: <span style={{ color: 'green', textTransform:'capitalize' }}>{currentUser?.userName},</span></p>
                            <p style={{ fontWeight: 'bold', fontSize:'12px'}}>Role: <span style={{ color: 'green', textTransform:'capitalize'}}>{currentUser?.role}</span></p>
                            <ForgetPasswordModal user={currentUser}/>
                           {currentUser?.role=='admin' && <UsersTable currentUser={currentUser}/>}
                            </div>
                            <EuiSpacer size="l" />
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <div onClick={onSignOut}><EuiBadge style={{ cursor: 'pointer' }}><EuiButtonIcon aria-label="logout_button" iconType={'/logout.png'} ></EuiButtonIcon>Sign Out</EuiBadge></div>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer size="s" />

                                <div className="w-full py-5">
                    <Link className="text-blue-500 font-semibold "  href={'/tracking'}>Go To Analytics <EuiIcon  type={'stats'}/><EuiIcon  type={'arrowRight'}/></Link>
                    </div>

                    <ClientTableArrSkillSets  currentUser={currentUser}/> 
                </EuiPageTemplate.Section>



            </EuiPageTemplate>}

            {token == null && <>
                <EuiModal aria-labelledby={"Error"} style={{ width: 800 }} onClose={() => { }}>
                    <EuiModalHeader>
                        <EuiModalHeaderTitle >Authorization Error <EuiIcon color="red" type='warning'/></EuiModalHeaderTitle>
                    </EuiModalHeader>

                    <EuiModalBody>
                        <EuiText>You are not authorized to access this content</EuiText>
                    </EuiModalBody>

                    <EuiModalFooter>
                        <EuiButton onClick={() => { }} fill>
                            Close
                        </EuiButton>
                    </EuiModalFooter>
                </EuiModal>
            </>}
        </Fragment>
    )
}

export default AdminHomePage