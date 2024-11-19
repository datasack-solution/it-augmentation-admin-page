// "use client"
// import { ClientRecord } from "@/util/util";
// import { EuiBadge, EuiBasicTable, EuiBasicTableColumn, EuiButton, EuiButtonIcon, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiIcon, EuiModal, EuiModalBody, EuiModalHeader, EuiProgress, EuiSpacer, EuiText, EuiTitle } from "@elastic/eui";
// import { Fragment, FunctionComponent, useEffect, useState } from "react";
// import EditForm from "./ClientForm";
// import { useDeleteClientMutation, useGetClientRecords, useUpdateClientMutation } from "./hook";
// import { downloadCSV, downloadExcel } from "./export";
// import { Admin } from "@/utils/adminApi";


// // This client table is component is no longer needed, since we created a specific component that supports array of skillsets

// export interface ClientTableProps {
//     admin?: Admin
// }

// const ClientTable: FunctionComponent<ClientTableProps> = ({
//     admin
// }) => {
//     const [searchValue, setSearchValue] = useState('');
//     const [items, setItems] = useState<ClientRecord[]>([]);
//     const [sortField, setSortField] = useState<string | undefined>(undefined);
//     const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>(undefined);
//     const [editingClient, setEditingClient] = useState<ClientRecord | null>(null);
//     const [isClient, setIsClient] = useState(false)
//     const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);
//     const [isDeleteOpen, setDeleteOpen] = useState<{ client: ClientRecord | undefined, isOpen: boolean }>({
//         client: undefined,
//         isOpen: false
//     })
//     const { data: clientRecords, isLoading: isClientRecordsLoading } = useGetClientRecords(2000)
//     const { isLoading: isUpdateClientMutationLoading, error: UpdateClientMutationError, mutateAsync: UpdateClientMutation } = useUpdateClientMutation()
//     const { isLoading: isDeleteClientMutationLoading, error: DeleteClientMutationError, mutateAsync: DeleteClientMutation } = useDeleteClientMutation()


//     useEffect(() => {
//         setIsClient(true)
//         if (clientRecords) {
//             setItems(clientRecords)
//         }
//     }, [clientRecords])

//     const handleEdit = (client: ClientRecord) => {
//         console.log("client: ", client)
//         setEditingClient(client);
//     };

//     const handleSave = async (updatedClient: ClientRecord) => {
//         await UpdateClientMutation(updatedClient)
//         setEditingClient(null);
//     };

//     const handleCancel = () => {
//         setEditingClient(null);
//         setDeleteOpen({
//             client: undefined,
//             isOpen: false
//         })
//     };

//     const handleDelete = async (client: ClientRecord) => {
//         setDeleteOpen({
//             client,
//             isOpen: true,
//         })
//     };



//     const toggleDetails = (client: ClientRecord) => {
//         const isExpanded = expandedRowIds.includes(client.email);
//         const newExpandedRowIds = isExpanded
//             ? expandedRowIds.filter(id => id !== client.email)
//             : [...expandedRowIds, client.email];
//         setExpandedRowIds(newExpandedRowIds);
//     };

//     const getExpandedRowContent = (client: ClientRecord) => {
//         return (
//             <EuiFlexGroup>
//                 <EuiFlexItem>
//                     <div style={{ fontSize: '13px' }}>
//                         {client.skillsets?.predefinedTechData && client.skillsets.predefinedTechData.length > 0 && <Fragment>
//                             <strong style={{ color: 'green' }}>Predefined Skillsets:</strong>
//                             {client.skillsets?.predefinedTechData.map((category, index) => (
//                                 <div key={index} >
//                                     <strong style={{ color: 'darkred' }}>-- {category.mainCategory} --</strong>
//                                     {category.subcategories.map((subcategory, subIndex) => (
//                                         <div key={subIndex} >
//                                             <EuiFlexGroup >
//                                                 <EuiFlexItem grow={false}>
//                                                     <strong>{subIndex + 1}.{subcategory.subcategory}:&nbsp;</strong>
//                                                 </EuiFlexItem>
//                                                 {subcategory.items.map((item, itemIndex) => (
//                                                     <EuiFlexItem key={itemIndex} grow={false}>
//                                                         <p> {item.techName} ({item.quantity})</p>
//                                                     </EuiFlexItem>
//                                                 ))}
//                                             </EuiFlexGroup>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))}

//                         </Fragment>
//                         }
//                         {(client.skillsets?.customTechsData != null && client.skillsets?.customTechsData.length != 0) &&
//                             <EuiFlexGroup>
//                                 <strong style={{ color: 'green' }}>Custom Skillsets: &nbsp;</strong>
//                                 <EuiFlexGroup>
//                                     {client.skillsets.customTechsData.map((customTech, index) => (
//                                         <EuiFlexItem key={index} grow={false}>
//                                             <p>{customTech.techName} ({customTech.quantity})</p>
//                                         </EuiFlexItem>
//                                     ))}
//                                 </EuiFlexGroup>
//                             </EuiFlexGroup>}
//                     </div>
//                     {client.skillsets?.predefinedTechData.length == 0 && client.skillsets.customTechsData?.length == 0 && <div>
//                         Sorry, client did not choose any technologies.
//                     </div>}
//                 </EuiFlexItem>
//                 <EuiFlexItem>
//                     <div  style={{ fontSize: '13px' }}>
//                         <strong style={{ color: 'green' }}>Client Requirements:</strong>
//                         <div><p>{client.requirements}</p></div>
//                     </div>
//                 </EuiFlexItem>
//             </EuiFlexGroup>
//         );
//     };


//     const columns: Array<EuiBasicTableColumn<ClientRecord>> = [
//         {
//             field: 'name',
//             name: 'Name',
//             sortable: true,
//             style: {
//                 textTransform: 'capitalize'
//             },
//         },
//         {
//             field: 'email',
//             name: 'Email',
//             sortable: true,
//         },
//         {
//             field: 'phone',
//             name: 'Phone',
//             sortable: true,
//         },
//         {
//             field: 'industry',
//             name: 'Industry',
//             sortable: true,
//             style: {
//                 textTransform: 'capitalize'
//             }
//         },
//         {
//             name: 'Schedule',
//             sortable: (client: ClientRecord) => new Date(client.date).getTime(),
//             render: (client: ClientRecord) => {
//                 const date = new Date(client.date);
//                 const formattedDate = date.toLocaleString('en-US', {
//                     year: 'numeric',
//                     month: '2-digit',
//                     day: '2-digit',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true,
//                 });
//                 return <EuiText size="s">{formattedDate}</EuiText>
//             }
//         },
//         {
//             field: 'city',
//             sortable: true,
//             name: 'City',
//             style: {
//                 textTransform: 'capitalize'
//             },
//             render: (city: string) => (city && city.length > 0 ? city : '-'),
//         },
//         {
//             field: 'contactedChannel',
//             name: 'Contacted Channel',
//             sortable: true,
//             render: (channel: string) => (channel && channel.length > 0 ? channel : '-')
//         },
//         {
//             field: 'responded',
//             name: 'Responded',
//             sortable: true,
//             render: (responded: boolean) => (responded==undefined ? '-': (responded ? 'Yes':'No') ),
//         },
//         {
//             field: 'isInterested',
//             name: 'Interested',
//             sortable: true,
//             render: (isInterested: boolean) => (isInterested==undefined ? '-':  isInterested ? <EuiBadge color="success">Yes</EuiBadge> : <EuiBadge color="warning">No</EuiBadge>),
//         },
//         {
//             field: 'remarks',
//             name: 'Remarks',
//             sortable: false,
//             render: (remarks: string) => (remarks && remarks.length > 0 ? remarks : '-')
//         },

//         {
//             name: 'Actions',
//             actions: [
//                 {
//                     name: 'Edit',
//                     description: 'Edit this client',
//                     type: 'icon',
//                     icon: 'pencil',
//                     onClick: (client: ClientRecord) => handleEdit(client),
//                 },
//                 {
//                     name: 'Delete',
//                     description: 'Delete this client',
//                     type: 'icon',
//                     icon: 'trash',
//                     color: 'danger',
//                     onClick: (client: ClientRecord) => handleDelete(client),
//                 },
//             ],
//         },
//         {
//             isExpander: true,
//             name: "SkillSets",
//             mobileOptions: { header: false, align: 'right', truncateText: true, enlarge: false, textOnly: true },
//             render: (client: ClientRecord) => (
//                 <EuiButtonIcon
//                     onClick={() => toggleDetails(client)}
//                     aria-label={
//                         expandedRowIds.includes(client.email) ? 'Collapse' : 'Expand'
//                     }
//                     iconType={
//                         expandedRowIds.includes(client.email) ? 'arrowDown' : 'arrowRight'
//                     }
//                 />
//             ),
//         },
//     ];




//     const filteredItems = items.filter(client => {
//         return (
//             client.name.toLowerCase().includes(searchValue.toLowerCase()) ||
//             client.email.toLowerCase().includes(searchValue.toLowerCase())
//         );
//     });

//     const sortedItems = filteredItems.sort((a, b) => {
//         if (sortField) {
//             const aValue = a[sortField as keyof ClientRecord];
//             const bValue = b[sortField as keyof ClientRecord];

//             if (aValue === undefined && bValue === undefined) return 0;
//             if (aValue === undefined) return 1;
//             if (bValue === undefined) return -1;

//             if (sortDirection === 'asc') {
//                 return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
//             } else {
//                 return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
//             }
//         }
//         return 0;
//     });


//     const onSort = (criteria: { sort?: { field: keyof ClientRecord, direction: 'asc' | 'desc' } }) => {
//         if (!!criteria.sort) {
//             const { field, direction } = criteria.sort;
//             setSortField(field);
//             setSortDirection(direction);
//         }
//     };

//     const errorMessage = UpdateClientMutationError?.response?.data.message || DeleteClientMutationError?.response?.data.message || UpdateClientMutationError?.message || DeleteClientMutationError?.message

//     return (
//         <Fragment>
//             {isClient && <div>
//                 <EuiFlexGroup>
//                     <EuiFieldSearch
//                         placeholder="Search by name or email"
//                         value={searchValue}
//                         onChange={e => setSearchValue(e.target.value)}
//                         isClearable
//                     />
//                     <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => downloadCSV(items, `client_records_${new Date().toLocaleDateString()}`)}>
//                         <EuiIcon color="success" cursor='pointer' type='exportAction' aria-label="exportCsv" />
//                         <EuiText size="s">&nbsp;Export as .csv</EuiText>
//                     </div>

//                     <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => downloadExcel(items, `client_records_${new Date().toLocaleDateString()}`)}>
//                         <EuiIcon color="success" cursor='pointer' type='exportAction' aria-label="exportXlsx" />
//                         <EuiText size="s">&nbsp;Export as .xlsx</EuiText>
//                     </div>

//                 </EuiFlexGroup>
//                 <EuiSpacer size="s" />

//                 <EuiBasicTable
//                     error={errorMessage}
//                     loading={isClientRecordsLoading || isUpdateClientMutationLoading || isDeleteClientMutationLoading}
//                     items={sortedItems}
//                     columns={columns}
//                     itemId="email"
//                     itemIdToExpandedRowMap={expandedRowIds.reduce((acc, id) => {
//                         acc[id] = getExpandedRowContent(items.find(client => client.email === id) as ClientRecord);
//                         return acc;
//                     }, {} as Record<string, JSX.Element>)}
//                     onChange={onSort}
//                     onToggle={(item: any) => {
//                         const isExpanded = expandedRowIds.includes(item.email);
//                         const newExpandedRowIds = isExpanded
//                             ? expandedRowIds.filter(id => id !== item.email)
//                             : [...expandedRowIds, item.email];
//                         setExpandedRowIds(newExpandedRowIds);
//                     }}
//                     sorting={{
//                         sort: {
//                             field: sortField as keyof ClientRecord || 'name',
//                             direction: sortDirection || 'asc',
//                         },
//                     }}
//                     align="center"
//                 />

//                 {editingClient && (
//                     <EuiModal
//                         className="customModalCloseButton "
//                         aria-labelledby={"Edit Client Record"}
//                         onClose={() => handleCancel()}
//                         initialFocus="[name=popswitch]">
//                         <EuiModalHeader style={{ backgroundColor: '#000' }}>
//                             <EuiTitle size="s">
//                                 <EuiText style={{ color: '#909090' }}>Edit Client <span style={{ color: "orange" }}>Record</span></EuiText>
//                             </EuiTitle>
//                         </EuiModalHeader>

//                         <EuiModalBody>
//                             {isUpdateClientMutationLoading && <EuiProgress size="xs" color="primary" />}
//                             <EditForm
//                                 isAdmin={false} //dummy value, since we are using arr skills client table.
//                                 client={editingClient}
//                                 onSave={handleSave}
//                                 onCancel={handleCancel}
//                             />
//                         </EuiModalBody>
//                     </EuiModal>
//                 )}
//                 {isDeleteOpen.isOpen && <EuiModal
//                     aria-labelledby={"Delete Client Record"}
//                     onClose={handleCancel}
//                     color="danger"
//                     initialFocus="[name=popswitch]">
//                     <EuiModalHeader>
//                         <EuiText size="m" style={{ fontWeight: 'bold' }}>Confirm Delete:  <span style={{ color: 'green' }}> {isDeleteOpen.client?.name}</span>?</EuiText>
//                     </EuiModalHeader>

//                     <EuiModalBody>
//                         <EuiFlexGroup>
//                             <EuiButton color="danger" onClick={async () => {
//                                 if (!!isDeleteOpen.client) {
//                                     await DeleteClientMutation(isDeleteOpen.client.email)
//                                     setDeleteOpen({
//                                         client: undefined,
//                                         isOpen: false
//                                     })
//                                 }
//                             }}>Delete</EuiButton>
//                             <EuiButton onClick={handleCancel}>Cancel</EuiButton>
//                         </EuiFlexGroup>
//                     </EuiModalBody>
//                 </EuiModal>}
//             </div>}
//         </Fragment>
//     );
// };

// export default ClientTable;