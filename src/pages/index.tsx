import ClientTable from "@/components/ClientTable"
import { EuiFlexGroup, EuiFlexItem, EuiImage, EuiPageTemplate, EuiText, EuiTitle } from "@elastic/eui"
import Head from "next/head"
import { Fragment, FunctionComponent } from "react"

const AdminHomePage: FunctionComponent = () => {
    return (
        <Fragment>
            <Head>
                <title>Admin - Datasack Solution</title>
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
                    <ClientTable />
                </EuiPageTemplate.Section>

            </EuiPageTemplate>
        </Fragment>
    )
}

export default AdminHomePage