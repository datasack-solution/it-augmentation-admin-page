import ClientTable from "@/components/ClientTable"
import { useAuthUser } from "@/utils/adminHook"
import { EuiBadge, EuiButtonIcon, EuiFlexGroup, EuiFlexItem, EuiImage, EuiPageTemplate, EuiSpacer, EuiText, EuiTitle } from "@elastic/eui"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { Fragment, FunctionComponent, useEffect, useState } from "react"
import { Cookies } from 'react-cookie'

const cookies = new Cookies();

const AdminHomePage: FunctionComponent = () => {
    const { data, mutateAsync: authAdmin } = useAuthUser()
    const [token,setToken]=useState<string|null>(null)
    const router = useRouter();
    const onSignOut = async () => {
        try{
            localStorage.removeItem('token')
            // await adminApi.signout(data?.data.user.email || '')
            router.push('/login')
        }catch(e){
            console.log("signout failed: ",e)
        }   
    }

    useEffect(() => {
        console.log("cookies token from client: ",cookies.get('token'))
        // if (!!isLoggedIn){
        //     router.push('/login')
        // }
        const validateSession = async (token:string) =>{
            try{
            //   const res=  await adminApi.validateSession()
            //   console.log("session cookie: ",res.data.name)
            await authAdmin(token)
            }catch(e){
                console.log("session not found: "+e)
                router.push('/login')
            }
        }
        const token = window.localStorage.getItem('token');
        setToken(token)
        if (token==null){
            router.push('/login')
        }
        if (token!=null){
            validateSession(token)
        }
    }, [router, authAdmin]);


    return (
        <Fragment>
            <Head>
                <title>Admin - Datasack Solutions</title>
                <meta title="title" content="Datasack Solutions Admin Page" />
                <meta name="description" content="Get the right talent at the right price. Find DataSack's IT Staff Augmentation Services in Dammam and Riyadh. Resolve skill shortages for project excellence." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

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
                                    <span style={{ color: 'orange' }}>Datasack Client</span> Records
                                </EuiText>
                            </EuiTitle>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false} style={{ width: '50px' }} />
                    </EuiFlexGroup>
                </EuiPageTemplate.Header>


                <EuiPageTemplate.Section grow={false} bottomBorder={true}>
                    <EuiFlexGroup>
                        <EuiFlexItem>
                            <p style={{ fontWeight: 'bold' }}>Admin: <span style={{ color: 'green' }}>{data?.data.user.userName},</span></p>
                            <EuiSpacer size="l" />
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <div onClick={() => {
                                // logout();
                                // router.push('/login')
                                onSignOut()
                            }}><EuiBadge style={{ cursor: 'pointer' }}><EuiButtonIcon aria-label="logout_button" iconType={'/logout.png'} ></EuiButtonIcon>Sign Out</EuiBadge></div>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer size="s" />
                    {token!=null && <ClientTable />}
                    {token==null && <>
            You are not authorized to access this content
            </>}
                </EuiPageTemplate.Section>

            </EuiPageTemplate>
          

        </Fragment>
    )
}

export default AdminHomePage