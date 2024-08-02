import { MainCategory, SkillSet, Subcategory, TechnologyItem } from "@/util/util";
import { EuiBadge, EuiBeacon, EuiButton, EuiButtonIcon, EuiModal, EuiModalBody, EuiModalFooter, EuiModalHeader, EuiProgress, EuiText } from "@elastic/eui";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import styles from '../styles/Skillset.module.css';
import { ClientRecord1, SkillSet1 } from "./clientApi";
import EditCustomSkillSet, { CustomTech } from "./EditCustomSkillSet";
import { useUpdateClientMutation } from "./hook";

type Technologies = {
    [mainCategory: string]: {
        [subCategory: string]: string[];
    };
};


export const technologies: Technologies = {
    'Development Technologies': {
        "Web": ['HTML5', 'CSS3', 'JavaScript', 'AngularJS'],
        "Mobile": ['Android', 'iOS', 'Xamarin'],
        '.NET': ['C#', 'ASP.NET', 'Entity Framework'],
        "J2EE": ['Java', 'Spring', 'Hibernate'],
        "LAMP": ['Linux', 'Apache', 'MySQL', 'PHP'],
    },
    'Data Management and Analytics': {
        "Database": ['Microsoft SQL Server', 'Oracle', 'SQLite', 'PL/SQL'],
        'Big Data': ['Hadoop', 'MongoDB'],
        "Analytics": ['Power BI', 'SSRS', 'Google Analytics'],
    },
    'Platforms and Systems': {
        "ERP": ['Microsoft Navison', 'SAP'],
        "CRM": ['Microsoft Dynamics CRM'],
        "CMS": ['Dot Net DNN', 'WordPress', 'Alfresco', 'Drupal', 'Joomla'],
        'Cloud Platforms': ['Azure', 'Amazon', 'AWS'],
    },
    'Architecture and Design': {
        "Architecture": ['Enterprise Architect', 'Rational Software Architect', 'No Magic', 'Modelio', 'Archi'],
        "UIDesigning": ['Infragistics', 'Telerik'],
    },
    'Business Solutions': {
        "eCommerce": ['Magento', 'VevoCart', 'Shopify'],
        'Enterprise Social': ['Microsoft Yammer'],
    },
    'Quality Assurance and Project Management': {
        "Testing": ['JMeter', 'JUnit', 'Mercury', 'Selenium', 'Regression Testing'],
        'Project Management': ['MS Project', 'SmartSheet'],
    },
};

interface SegregrateTechnologies {
    predefinedTechs: { [key: string]: number },
    customTechs: CustomTech[]
}

const segregateTechnologies = (skillSet: SkillSet): SegregrateTechnologies => {
    const technologyMap: { [key: string]: number } = {};
    const customTechs: CustomTech[] = []

    skillSet.predefinedTechData.forEach(mainCategory => {
        mainCategory.subcategories.forEach(subcategory => {
            subcategory.items.forEach(item => {
                if (technologyMap[item.techName]) {
                    technologyMap[item.techName] += item.quantity;
                } else {
                    technologyMap[item.techName] = item.quantity;
                }
            });
        });
    });

    if (skillSet.customTechsData) {
        skillSet.customTechsData.forEach(item => {
            const customTech: CustomTech = {
                hasError: false,
                isEditing: false,
                originalQuantity: `${item.quantity}`,
                originalTech: item.techName,
                quantity: `${item.quantity}`,
                tech: item.techName
            }
            customTechs.push(customTech)
        })
    }

    return {
        predefinedTechs: technologyMap,
        customTechs
    };
};

const combineToSkillSet = (segregated: SegregrateTechnologies): SkillSet => {
    const predefinedTechData: MainCategory[] = [];

    for (const [mainCategory, subcategories] of Object.entries(technologies)) {
        const category: MainCategory = {
            mainCategory,
            subcategories: []
        };

        for (const [subcategory, techNames] of Object.entries(subcategories)) {
            const subcat: Subcategory = {
                subcategory,
                items: []
            };

            techNames.forEach(techName => {
                if (segregated.predefinedTechs[techName]) {
                    subcat.items.push({
                        techName,
                        quantity: segregated.predefinedTechs[techName]
                    });
                }
            });

            if (subcat.items.length > 0) {
                category.subcategories.push(subcat);
            }
        }

        if (category.subcategories.length > 0) {
            predefinedTechData.push(category);
        }
    }

    const customTechsData: TechnologyItem[] = segregated.customTechs.map(customTech => ({
        techName: customTech.tech,
        quantity: parseInt(customTech.quantity, 10)
    }));

    return {
        predefinedTechData,
        customTechsData
    };
};



export interface EditSkillSetProps {
    isOpen: boolean
    handleCancel: (isOpen: boolean) => void
    updatbaleClient: ClientRecord1,
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
    const [updatableSkillSet,setUpdatableSkillSet]=useState<SkillSet1|undefined>(undefined)
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
            _id: "",
            predefinedTechData: [],
            customTechsData: []
        };
    
        const techs = segregateTechnologies(updatableSkillSet);
        setSelectedTechnologies(techs.predefinedTechs);
        setCustomTechs(techs.customTechs);
        setUpdatableSkillSet(updatableSkillSet);
    }, [skillSetId, updatbaleClient?.arrSkillsets]);


    const isItemSelectedUnderMainCategory = (selectedMainCategory: string): boolean => {
        for (const [mainCategory, subCategories] of Object.entries(technologies)) {
            if (mainCategory === selectedMainCategory) {
                for (const techList of Object.values(subCategories)) {
                    for (const tech of techList) {
                        if (selectedTechnologies[tech] > 0) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    
    const isItemSelectedUnderSubCategory = (selectedMainCategory: string, selectedSubCategory: string): boolean => {
        for (const [mainCategory, subCategories] of Object.entries(technologies)) {
            if (mainCategory === selectedMainCategory) {
                for (const [category, techList] of Object.entries(subCategories)) {
                    if (category === selectedSubCategory) {
                        for (const tech of techList) {
                            if (selectedTechnologies[tech] > 0) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    };
    const onSelectCustomTechs = (newCustomTechs: CustomTech[]) => {
        setCustomTechs(newCustomTechs)
    }

    const onUpdate = async () => {
        const segTechs: SegregrateTechnologies = {
            predefinedTechs: selectedTechnologies,
            customTechs
        }
       const {predefinedTechData,customTechsData}= combineToSkillSet(segTechs)
       if (!!updatableSkillSet){
        const updatedSkillSet = {...updatableSkillSet,predefinedTechData,customTechsData}
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

            <EuiModalBody>
                <div className={styles.pricingContainer}>
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
                </div>
                <EditCustomSkillSet customTechsOnReset={customTechs} onSelect={onSelectCustomTechs} />
            </EuiModalBody>
            <EuiModalFooter>
                <EuiButton onClick={onUpdate} size="s" color="success">Update</EuiButton>
                <EuiButton onClick={()=>handleCancel(false)} size="s" color="warning">Cancel</EuiButton>
            </EuiModalFooter>
        </EuiModal>}
    </Fragment>
}

export default EditSkillSet