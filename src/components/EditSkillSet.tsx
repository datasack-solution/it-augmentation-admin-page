import {  SkillSet, TransformedSkillsets, TechnologyItem, ClientRecord } from "@/util/util";
import { EuiBadge, EuiBeacon, EuiButton, EuiButtonIcon, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiProgress, EuiText } from "@elastic/eui";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import styles from '../styles/Skillset.module.css';
import EditCustomSkillSet, { CustomTech } from "./EditCustomSkillSet";
import { useUpdateClientMutation } from "./hook";
import EditSkillSetForm from "./EditTechForm";

// type Technologies = {
//     [mainCategory: string]: {
//         [subCategory: string]: string[];
//     };
// };


 type Technologies = {
    "Core Banking": string[];
    SAP: string[];
    "Integration / Middleware": string[];
    "Architecture": string[];
    "Business/Project Management": string[];
    "Data Governance": string[];
    "Database / Infrastructure": string[];
    "Payment Systems": string[];
    "Software Development": string[];
    "Testing/QA": string[];
    "Specialized Tools/Applications": string[]
};

 const technologies: Technologies = {
    "Core Banking": [
        "T24 Temenos Consultant",
        "T24 Techno Functional",
        "T24 Testing Consultant",
        "Finstra Techno Functional",
        "Portfolio Murex Consultant",
        "Murex Techno Functional Specialist",
        "Oracle Financial Services Analytical Applications",
    ],
    "SAP": [
        "SAP Consultant (SAP FI, SAP MM, etc.)",
        "SAP ABAP Developer",
        "SAP Basis Administrator",
        "SAP Solution Architect",
        "SAP HANA Consultant",
    ],
    "Integration / Middleware": [
        "Middleware Administrator",
        "ETL Consultant",
        "DevOps Engineer",
        "Exchange Admin",
        "Active Directory Admin",
        "Network Engineer",
        "Unified Communication Consultant",
    ],
    "Architecture": [
        "Solution Architect",
        "Enterprise Architect",
        "Infra Solution Architect",
        "SAP Solution Architect",
        "Data Architect",
    ],
    "Business/Project Management": [
        "Business Analyst IT",
        "Project Manager IT",
        "Head of Solution Development",
        "Head of Delivery and Quality Assurance",
    ],
    "Data Governance": [
        "Data Governance",
        "Data Quality",
        "Data Privacy",
    ],
    "Database / Infrastructure": [
        "SQL Database Administrator",
        "Database Developer",
    ],
    "Payment Systems": ["Payment System Engineer"],
    "Software Development": [
        "Senior Java Developer",
        "Senior IVR Developer",
        "Kony Developer",
        "SAP ABAP Developer",
    ],
    "Testing/QA": [
        "Manual Tester"
    ],
    "Specialized Tools/Applications": [
        "Adobe Campaign Expert",
        "Adobe Analytics Developer",
        "Experian Power Curve",
        "Newgen Consultant",
    ]
};



// export const technologies: Technologies = {
//     'Development Technologies': {
//         "Web": ['HTML5', 'CSS3', 'JavaScript', 'AngularJS'],
//         "Mobile": ['Android', 'iOS', 'Xamarin'],
//         '.NET': ['C#', 'ASP.NET', 'Entity Framework'],
//         "J2EE": ['Java', 'Spring', 'Hibernate'],
//         "LAMP": ['Linux', 'Apache', 'MySQL', 'PHP'],
//     },
//     'Data Management and Analytics': {
//         "Database": ['Microsoft SQL Server', 'Oracle', 'SQLite', 'PL/SQL'],
//         'Big Data': ['Hadoop', 'MongoDB'],
//         "Analytics": ['Power BI', 'SSRS', 'Google Analytics'],
//     },
//     'Platforms and Systems': {
//         "ERP": ['Microsoft Navison', 'SAP'],
//         "CRM": ['Microsoft Dynamics CRM'],
//         "CMS": ['Dot Net DNN', 'WordPress', 'Alfresco', 'Drupal', 'Joomla'],
//         'Cloud Platforms': ['Azure', 'Amazon', 'AWS'],
//     },
//     'Architecture and Design': {
//         "Architecture": ['Enterprise Architect', 'Rational Software Architect', 'No Magic', 'Modelio', 'Archi'],
//         "UIDesigning": ['Infragistics', 'Telerik'],
//     },
//     'Business Solutions': {
//         "eCommerce": ['Magento', 'VevoCart', 'Shopify'],
//         'Enterprise Social': ['Microsoft Yammer'],
//     },
//     'Quality Assurance and Project Management': {
//         "Testing": ['JMeter', 'JUnit', 'Mercury', 'Selenium', 'Regression Testing'],
//         'Project Management': ['MS Project', 'SmartSheet'],
//     },
// };

interface SegregrateTechnologies {
    skillsets: { [key: string]: number },
}

const segregateTechnologies = (skillSet: SkillSet): SegregrateTechnologies => {
    const technologyMap: { [key: string]: number } = {};

    skillSet.skillset.forEach(category => {
        category.technologies.forEach(item => {
          
                if (technologyMap[item.tech]) {
                    technologyMap[item.tech] += item.quantity;
                } else {
                    technologyMap[item.tech] = item.quantity;
                }
         
        });
    });

    // if (skillSet.customTechsData) {
    //     skillSet.customTechsData.forEach(item => {
    //         const customTech: CustomTech = {
    //             hasError: false,
    //             isEditing: false,
    //             originalQuantity: `${item.quantity}`,
    //             originalTech: item.techName,
    //             quantity: `${item.quantity}`,
    //             tech: item.techName
    //         }
    //         customTechs.push(customTech)
    //     })
    // }

    return {
        skillsets: technologyMap,
    };
};

// const combineToSkillSet = (segregated: SegregrateTechnologies): SkillSet => {
//     for (const [mainCategory, subcategories] of Object.entries(technologies)) {
//         const category: MainCategory = {
//             mainCategory,
//             subcategories: []
//         };

//         for (const [subcategory, techNames] of Object.entries(subcategories)) {
//             const subcat: Subcategory = {
//                 subcategory,
//                 items: []
//             };

//             techNames.forEach(techName => {
//                 if (segregated.predefinedTechs[techName]) {
//                     subcat.items.push({
//                         techName,
//                         quantity: segregated.predefinedTechs[techName]
//                     });
//                 }
//             });

//             if (subcat.items.length > 0) {
//                 category.subcategories.push(subcat);
//             }
//         }

//         if (category.subcategories.length > 0) {
//             predefinedTechData.push(category);
//         }
//     }

//     const customTechsData: TechnologyItem[] = segregated.customTechs.map(customTech => ({
//         techName: customTech.tech,
//         quantity: parseInt(customTech.quantity, 10)
//     }));

//     return {
//         predefinedTechData,
//         customTechsData
//     };
// };



export interface EditSkillSetProps {
    isOpen: boolean
    handleCancel: (isOpen: boolean) => void
    updatbaleClient: ClientRecord,
    skillSetId: string
}

const EditSkillSet: FunctionComponent<EditSkillSetProps> = ({
    isOpen,
    handleCancel,
    skillSetId,
    updatbaleClient
}) => {
    const [selectedTechnologies, setSelectedTechnologies] = useState<{ [key: string]: number }>({});
    const [customTechs, setCustomTechs] = useState<CustomTech[]>([])
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);
    const [updatableSkillSet,setUpdatableSkillSet]=useState<SkillSet|undefined>(undefined)
    const { isLoading: isUpdateClientMutationLoading, error: updateClientMutationError, mutateAsync: updateClientMutation } = useUpdateClientMutation()



    const toggleCategory = (category: string) => {
        setOpenCategory((prev) => (prev === category ? null : category));
        setOpenSubCategory(null);
    };
    const toggleSubCategory = (subcategory: string) => {
        setOpenSubCategory((prev) => (prev === subcategory ? null : subcategory));
    };

    const incrementQuantity = (tech: string) => {
        setSelectedTechnologies((prev) => ({
            ...prev,
            [tech]: (prev[tech] || 0) + 1,
        }));
    };

    const decrementQuantity = (tech: string) => {
        setSelectedTechnologies((prev) => ({
            ...prev,
            [tech]: Math.max((prev[tech] || 0) - 1, 0),
        }));
    };

    const handleClose = () => {
        handleCancel(false)
    }

    useEffect(() => {
        if (!updatbaleClient?.arrSkillsets) return;
    
        const updatableSkillSet = updatbaleClient.arrSkillsets.find(skill => skill._id === skillSetId) || {
           skillset:[]
        };
    
        // const techs = segregateTechnologies(updatableSkillSet);
        // setSelectedTechnologies(techs.skillsets);
        // setCustomTechs(techs.customTechs);
        setUpdatableSkillSet(updatableSkillSet);
    }, [skillSetId, updatbaleClient?.arrSkillsets]);


    // const isItemSelectedUnderMainCategory = (selectedMainCategory: string): boolean => {
    //     for (const [category] of Object.entries(technologies)) {
    //         if (mainCategory === selectedMainCategory) {
    //             for (const techList of Object.values(subCategories)) {
    //                 for (const tech of techList) {
    //                     if (selectedTechnologies[tech] > 0) {
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // };
    

    // const isItemSelectedUnderSubCategory = (selectedMainCategory: string, selectedSubCategory: string): boolean => {
    //     for (const [mainCategory, subCategories] of Object.entries(technologies)) {
    //         if (mainCategory === selectedMainCategory) {
    //             for (const [category, techList] of Object.entries(subCategories)) {
    //                 if (category === selectedSubCategory) {
    //                     for (const tech of techList) {
    //                         if (selectedTechnologies[tech] > 0) {
    //                             return true;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // };


    const onSelectCustomTechs = (newCustomTechs: CustomTech[]) => {
        setCustomTechs(newCustomTechs)
    }

    const onUpdate = async () => {
        const segTechs: SegregrateTechnologies = {
            skillsets: selectedTechnologies,
        }
    //    const {predefinedTechData,customTechsData}= combineToSkillSet(segTechs)
       if (!!updatableSkillSet){
        const updatedSkillSet = {...updatableSkillSet,segTechs}
        const updatedArrSkillSets = updatbaleClient.arrSkillsets?.map(skill=>{
            if (skill._id==updatableSkillSet._id){
                return updatedSkillSet
            }
            return skill
        })

        const updatedClient = updatbaleClient
        updatedClient.arrSkillsets=updatedArrSkillSets
        try{
            await updateClientMutation(updatedClient)
            handleCancel(false)
        }catch(e){
            console.log("error on updating client")
        }
    }
    }

    const onUpdateNew = async (updatedSkills:TransformedSkillsets[]) => {
        console.log("incoming updated skills:",updatedSkills)
        if (updatableSkillSet){
            const updatedArrSkillSets = updatbaleClient.arrSkillsets?.map(skill=>{
                if (skill._id==skillSetId){
                    return {
                        _id:skillSetId,
                        skillset:updatedSkills
                    }
                }
                return skill
            })
            const updatedClient = updatbaleClient
            const newUpdatedClient = {...updatedClient, arrSkillsets:updatedArrSkillSets}

            try{
                // console.log("arr skills:",updatedArrSkillSets)
                await updateClientMutation(newUpdatedClient)
                handleCancel(false)
            }catch(e){
                console.log("error on updating client")
            }
        }
    }

    return <Fragment>
        {isOpen && !!updatableSkillSet &&<EuiModal
            aria-labelledby={"Delete Client Record"}
            onClose={handleClose}
            color="danger"
            initialFocus="[name=popswitch]">
                {isUpdateClientMutationLoading && <EuiProgress />}
                {!!updateClientMutationError && <p style={{color:'red'}}>{updateClientMutationError.response?.data.message || updateClientMutationError.message}</p>}
            <EuiModalHeader>
                <EuiText size="m" style={{fontWeight:'bold'}}>Edit <span style={{color:'orange'}}>SkillSet</span></EuiText>
            </EuiModalHeader>

            <EditSkillSetForm skillSet={updatableSkillSet.skillset} onUpdate={(updatedSkills)=>{onUpdateNew(updatedSkills)}}/>

            {/* <EuiModalBody> */}
                {/* <div className={styles.pricingContainer}>
                    {Object.entries(technologies).map(([mainCategory, subCategories], idx) => (
                        <div key={idx} className={styles.mainCategory}>
                            <div
                                className={`${styles.categoryHeader} ${openCategory === mainCategory ? styles.active : ''}`}
                                onClick={() => toggleCategory(mainCategory)}
                            >

                                <p style={{ fontWeight: '500', maxWidth: '350px', textWrap: 'wrap' }}>{mainCategory} </p>
                                {isItemSelectedUnderMainCategory(mainCategory) && <EuiBeacon size={7} style={{ marginLeft: '10px' }} />}
                                <EuiButtonIcon
                                    aria-label={`toggle-${mainCategory}`}
                                    iconType={openCategory === mainCategory ? 'arrowDown' : 'arrowRight'}
                                    className={styles.downIcon}
                                />
                            </div>
                            {openCategory === mainCategory && (
                                <div className={styles.subCategory}>
                                    {Object.entries(subCategories).map(([category, techList], idx) => (
                                        <div key={idx} className={styles.subCategoryWrapper}>
                                            <div
                                                className={`${styles.subCategoryHeader} ${openSubCategory === category ? styles.active : ''
                                                    }`}
                                                onClick={() => toggleSubCategory(category)}
                                            >
                                                <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#5C3C00' }}>{category}</p>
                                                {isItemSelectedUnderSubCategory(mainCategory, category) && <EuiBeacon size={7} style={{ marginLeft: '10px' }} />}

                                                <EuiButtonIcon
                                                    aria-label={`toggle-${category}`}
                                                    iconType={openSubCategory === category ? 'arrowDown' : 'arrowRight'}
                                                    className={styles.downIcon}
                                                />
                                            </div>
                                            {openSubCategory === category && (
                                                <div className={styles.techList}>
                                                    {techList.map((tech, techIdx) => (
                                                        <div key={techIdx} className={styles.techItem}>
                                                            <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
                                                                {tech}
                                                            </p>
                                                            <div className={styles.quantityControls}>
                                                                <EuiButtonIcon
                                                                    aria-label={`decrement-${tech}`}
                                                                    iconType={'minus'}
                                                                    size="s"
                                                                    onClick={() => decrementQuantity(tech)}
                                                                />
                                                                <EuiText className={styles.quantityDisplay}>
                                                                    {selectedTechnologies[tech] || 0}
                                                                </EuiText>
                                                                <EuiButtonIcon
                                                                    aria-label={`increment-${tech}`}
                                                                    iconType={'plus'}
                                                                    onClick={() => incrementQuantity(tech)}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div> */}
                {/* <EditCustomSkillSet customTechsOnReset={customTechs} onSelect={onSelectCustomTechs} /> */}
            {/* </EuiModalBody> */}
            {/* <EuiModalFooter>
                <EuiButton onClick={onUpdate} size="s" color="success">Update</EuiButton>
                <EuiButton onClick={()=>handleCancel(false)} size="s" color="warning">Cancel</EuiButton>
            </EuiModalFooter> */}
        </EuiModal>}
    </Fragment>
}

export default EditSkillSet