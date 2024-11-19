import React, { useState } from 'react';
import {
    EuiModalHeader,
    EuiModalBody,
    EuiModalFooter,
    EuiButton,
    EuiText,
    EuiComboBox,
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiButtonIcon,
    EuiComboBoxOptionOption,
    EuiFieldText,
    EuiIcon,
} from '@elastic/eui';
import { SkillSet, TechnologyItem, TransformedSkillsets } from '@/util/util';

export type Technologies = {
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

export const technologies: Technologies = {
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



// export const EditTechForm = ({ skillSet, onUpdate, handleCancel }: { 
//   skillSet: SkillSet; 
//   onUpdate: () => void; 
//   handleCancel: (status: boolean) => void; 
// }) => {
//   const [editedSkillSet, setEditedSkillSet] = useState<SkillSet>(skillSet);

//   const handleQuantityChange = (category: string, tech: string, delta: number) => {
//     setEditedSkillSet(prev => ({
//       ...prev,
//       skillset: prev.skillset.map(cat =>
//         cat.category === category
//           ? {
//               ...cat,
//               technologies: cat.technologies.map(item =>
//                 item.tech === tech
//                   ? { ...item, quantity: Math.max(0, item.quantity + delta) }
//                   : item
//               ),
//             }
//           : cat
//       ),
//     }));
//   };

// //   const getCategoryOptions = (category: keyof Technologies) => {
// //     const techList = technologies[category];
// //     const existingTechs = editedSkillSet.skillset.find(cat => cat.category === category)?.technologies || [];
// //     return techList.map(tech => {
// //       const techItem = existingTechs.find(t => t.tech === tech);
// //       const quantity = techItem?.quantity || 0;
// //       return {
// //         label: (
// //           <EuiFlexGroup alignItems="center" justifyContent="spaceBetween" gutterSize="s">
// //             <EuiFlexItem grow={false}>{tech}</EuiFlexItem>
// //             <EuiFlexItem grow={false}>
// //               <EuiButtonIcon
// //                 onClick={() => handleQuantityChange(category, tech, -1)}
// //                 iconType="minusInCircle"
// //                 color="danger"
// //                 size="s"
// //                 disabled={quantity <= 0}
// //               />
// //               <span style={{ margin: '0 8px' }}>{quantity}</span>
// //               <EuiButtonIcon
// //                 onClick={() => handleQuantityChange(category, tech, 1)}
// //                 iconType="plusInCircle"
// //                 color="success"
// //                 size="s"
// //               />
// //             </EuiFlexItem>
// //           </EuiFlexGroup>
// //         ),
// //         value: tech,
// //         quantity,
// //         beacon: quantity > 0,
// //       };
// //     });
// //   };

//   const getCategoryOptions = (category: keyof Technologies): Array<EuiComboBoxOptionOption<{ quantity: number; beacon: boolean }>> => {
//     const techList = technologies[category];
//     const existingTechs = editedSkillSet.skillset.find(cat => cat.category === category)?.technologies || [];

//     return techList.map(tech => {
//       const techItem = existingTechs.find(t => t.tech === tech);
//       const quantity = techItem?.quantity || 0;

//       return {
//         label: tech, // The text displayed in the dropdown
//         value: {
//             beacon:quantity>0,
//             quantity
//         }, // A unique identifier for the option
//         data: {
//           quantity,
//           beacon: quantity > 0,
//         }, // Custom data for additional logic
//       };
//     });
//   };

//   const renderCategoryDropdowns = () =>
//     Object.keys(technologies).map(category => {
//       const hasBeacon = editedSkillSet.skillset
//         .find(cat => cat.category === category)
//         ?.technologies.some(tech => tech.quantity > 0);

//       return (
//         <div key={category} style={{ marginBottom: '16px' }}>
//           <EuiComboBox
//             // prepend={
//             //   hasBeacon && <EuiBadge color="accent" iconType="dot">Active</EuiBadge>
//             // }
//             //getCategoryOptions(category as keyof Technologies)
//             placeholder={category}
//             options={getCategoryOptions(category as keyof Technologies)}
//             singleSelection={{ asPlainText: true }}
//             isClearable={false}
//           />
//         </div>
//       );
//     });

//   return (
//     <>
//       {/* <EuiModalHeader>
//         <EuiText size="m" style={{ fontWeight: 'bold' }}>
//           Edit <span style={{ color: 'orange' }}>SkillSet</span>
//         </EuiText>
//       </EuiModalHeader> */}

//       <EuiModalBody>{renderCategoryDropdowns()}</EuiModalBody>

//       {/* <EuiModalFooter>
//         <EuiButton onClick={onUpdate} size="s" color="success">
//           Update
//         </EuiButton>
//         <EuiButton onClick={() => handleCancel(false)} size="s" color="warning">
//           Cancel
//         </EuiButton>
//       </EuiModalFooter> */}
//     </>
//   );
// };


import {
    EuiBeacon,
} from '@elastic/eui';
import styles from '../styles/EditSkillSet.module.css'; // Replace with your actual CSS module file

// const EditSkillSetForm = ({ skillSet }: { skillSet: TransformedSkillsets[] }) => {
//   const [openCategory, setOpenCategory] = useState<string | null>(null);
//   const [techQuantities, setTechQuantities] = useState<Record<string, number>>(
//     () =>
//       skillSet.reduce((acc, category) => {
//         category.technologies.forEach(tech => {
//           acc[tech.tech] = tech.quantity;
//         });
//         return acc;
//       }, {} as Record<string, number>)
//   );

//   const toggleCategory = (category: string) => {
//     setOpenCategory(openCategory === category ? null : category);
//   };

//   const incrementQuantity = (tech: string) => {
//     setTechQuantities(prev => ({
//       ...prev,
//       [tech]: (prev[tech] || 0) + 1,
//     }));
//   };

//   const decrementQuantity = (tech: string) => {
//     setTechQuantities(prev => ({
//       ...prev,
//       [tech]: Math.max(0, (prev[tech] || 0) - 1),
//     }));
//   };

//   return (
//     <div className={styles.pricingContainer}>
//       {skillSet.map(({ category, technologies }) => (
//         <div key={category} className={styles.category}>
//           <div
//             className={`${styles.categoryHeader} ${
//               openCategory === category ? styles.active : ''
//             }`}
//             onClick={() => toggleCategory(category)}
//           >
//             <p style={{ fontWeight: 'bold', color: '#5C3C00' }}>{category}</p>
//             {technologies.some(tech => techQuantities[tech.tech] > 0) && (
//               <EuiBeacon size={7} style={{ marginLeft: '10px' }} />
//             )}
//             <EuiButtonIcon
//               aria-label={`toggle-${category}`}
//               iconType={openCategory === category ? 'arrowDown' : 'arrowRight'}
//               className={styles.downIcon}
//             />
//           </div>

//           {/* Technology List */}
//           {openCategory === category && (
//             <div className={styles.techList}>
//               {technologies.map(({ tech }) => (
//                 <div key={tech} className={styles.techItem}>
//                   <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
//                     {tech}
//                   </p>
//                   <div className={styles.quantityControls}>
//                     <EuiButtonIcon
//                       aria-label={`decrement-${tech}`}
//                       iconType="minus"
//                       size="s"
//                       onClick={() => decrementQuantity(tech)}
//                       disabled={techQuantities[tech] <= 0}
//                     />
//                     <EuiText className={styles.quantityDisplay}>
//                       {techQuantities[tech] || 0}
//                     </EuiText>
//                     <EuiButtonIcon
//                       aria-label={`increment-${tech}`}
//                       iconType="plus"
//                       size="s"
//                       onClick={() => incrementQuantity(tech)}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };



// const EditSkillSetForm = ({
//   skillSet,
// }: {
//   skillSet: TransformedSkillsets[];
// }) => {
//   const [openCategory, setOpenCategory] = useState<string | null>(null);
//   const [techQuantities, setTechQuantities] = useState(() => {
//     return skillSet.reduce((acc, { technologies }) => {
//       technologies.forEach(({ tech, quantity }) => {
//         acc[tech] = quantity;
//       });
//       return acc;
//     }, {} as Record<string, number>);
//   });

//   const toggleCategory = (category: string) => {
//     setOpenCategory(openCategory === category ? null : category);
//   };

//   const incrementQuantity = (tech: string) => {
//     setTechQuantities(prev => ({
//       ...prev,
//       [tech]: (prev[tech] || 0) + 1,
//     }));
//   };

//   const decrementQuantity = (tech: string) => {
//     setTechQuantities(prev => ({
//       ...prev,
//       [tech]: Math.max(0, (prev[tech] || 0) - 1),
//     }));
//   };


//   return (
//     <div className={styles.pricingContainer}>
//       {Object.entries(technologies).map(([category, techList]) => (
//         <div key={category} className={styles.category}>
//           {/* Category Header */}
//           <div
//             className={`${styles.categoryHeader} ${
//               openCategory === category ? styles.active : ''
//             }`}
//             onClick={() => toggleCategory(category)}
//           >
//             <p style={{ fontWeight: 'bold', color: '#5C3C00' }}>{category}</p>
//             {techList.some(
//               tech => techQuantities[tech] && techQuantities[tech] > 0
//             ) && <EuiBeacon size={7} style={{ marginLeft: '10px' }} />}
//             <EuiButtonIcon
//               aria-label={`toggle-${category}`}
//               iconType={openCategory === category ? 'arrowDown' : 'arrowRight'}
//               className={styles.downIcon}
//             />
//           </div>

//           {/* Technology List */}
//           {openCategory === category && (
//             <div className={styles.techList}>
//               {techList.map(tech => (
//                 <div key={tech} className={styles.techItem}>
//                   <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
//                     {tech}
//                   </p>
//                   <div className={styles.quantityControls}>
//                     <EuiButtonIcon
//                       aria-label={`decrement-${tech}`}
//                       iconType="minus"
//                       size="s"
//                       onClick={() => decrementQuantity(tech)}
//                       disabled={techQuantities[tech] <= 0}
//                     />
//                     <EuiText className={styles.quantityDisplay}>
//                       {techQuantities[tech] || 0}
//                     </EuiText>
//                     <EuiButtonIcon
//                       aria-label={`increment-${tech}`}
//                       iconType="plus"
//                       size="s"
//                       onClick={() => incrementQuantity(tech)}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };


const EditSkillSetForm = ({
    skillSet,
    onUpdate,
}: {
    skillSet: TransformedSkillsets[];
    onUpdate:(skillSet:TransformedSkillsets[])=>void
}) => {
    const [openCategory, setOpenCategory] = useState<string | null>(null);

    // Initialize quantities state based on skillSet
    const [techQuantities, setTechQuantities] = useState(() => {
        return skillSet.reduce((acc, { technologies }) => {
            technologies.forEach(({ tech, quantity }) => {
                acc[tech] = quantity;
            });
            return acc;
        }, {} as Record<string, number>);
    });

    // Custom technologies per category
    const [customTechnologies, setCustomTechnologies] = useState<{
        [category: string]: string[];
    }>({});

    const [newCustomTech, setNewCustomTech] = useState<string>('');

    const toggleCategory = (category: string) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const incrementQuantity = (tech: string) => {
        setTechQuantities(prev => ({
            ...prev,
            [tech]: (prev[tech] || 0) + 1,
        }));
    };

    const decrementQuantity = (tech: string) => {
        setTechQuantities(prev => ({
            ...prev,
            [tech]: Math.max(0, (prev[tech] || 0) - 1),
        }));
    };

    const removeCustomAddedTech = (category: string, tech: string) => {
        // Remove custom tech from quantities state
        setTechQuantities(prev => {
            const updatedQuantities = { ...prev };
            delete updatedQuantities[tech];  // Remove tech from quantities
            return updatedQuantities;
        });

        // remove the tech from the customTechnologies state for the specified category
        setCustomTechnologies(prev => {
            const updatedCustomTechnologies = { ...prev };

            // filter out the custom tech from the specified category's tech list
            updatedCustomTechnologies[category] = updatedCustomTechnologies[category].filter(item => item !== tech);

            return updatedCustomTechnologies;
        });
    };


    const addCustomTech = (category: string) => {
        if (!newCustomTech.trim()) return;

        setCustomTechnologies(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), newCustomTech.trim()],
        }));
        setTechQuantities(prev => ({
            ...prev,
            [newCustomTech.trim()]: 0,
        }));
        setNewCustomTech('');
    };


    const onUpdateConfirm = () => {
        // Prepare the updated skill set data
        const updatedSkillSets: TransformedSkillsets[] = Object.entries(technologies).map(([category, techList]) => {
            // For each category, we gather the technologies and their updated quantities
            const updatedTechnologies: TechnologyItem[] = techList.map(tech => {
                // Get the quantity from the selectedTechnologies state, or default to 0
                const quantity = techQuantities[tech] || 0;

                // Check if the tech exists in the customTechnologies list and append '(custom)' if it does
                // const techLabel = isCustomTech ? `${tech} (custom)` : tech;

                if (quantity>0){
                    return {
                        tech: tech,
                        quantity
                    };
                }
            }).filter(e=>!!e);

            const customTechs = customTechnologies[category]
            const custechs:TechnologyItem[] = customTechs?.map(t=>{
                return {
                    tech:t,
                    quantity:techQuantities[t]
                }
            })

            return {
                category,
                technologies: [...updatedTechnologies,...custechs||[]]
            };
        }).filter(e=>e.technologies.length>0);
        onUpdate(updatedSkillSets)
    }

    return (
        <>
            <EuiModalBody>
                <div className={styles.pricingContainer}>
                    {Object.entries(technologies).map(([category, techList]) => (
                        <div key={category} className={styles.category}>
                            {/* Category Header */}
                            <div
                                className={`${styles.categoryHeader} ${openCategory === category ? styles.active : ''
                                    }`}
                                onClick={() => toggleCategory(category)}
                            >
                                <p style={{ fontWeight: 'bold', color: '#5C3C00' }}>{category}</p>
                                {techList.some(
                                    tech => techQuantities[tech] && techQuantities[tech] > 0
                                ) && <EuiBeacon size={7} style={{ marginLeft: '10px' }} />}
                                {(customTechnologies[category]?.length > 0) && <EuiBeacon size={7} style={{ marginLeft: '10px' }} color='warning' />}
                                <EuiButtonIcon
                                    aria-label={`toggle-${category}`}
                                    iconType={openCategory === category ? 'arrowDown' : 'arrowRight'}
                                    className={styles.downIcon}
                                />
                            </div>

                            {/* Technology List */}
                            {openCategory === category && (
                                <div className={styles.techList}>
                                    {/* Default Techs */}
                                    {/* {techList.map(tech => (
                <div key={tech} className={styles.techItem}>
                  <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
                    {tech}
                  </p>
                  <div className={styles.quantityControls}>
                    <EuiButtonIcon
                      aria-label={`decrement-${tech}`}
                      iconType="minus"
                      size="s"
                      onClick={() => decrementQuantity(tech)}
                      disabled={techQuantities[tech] <= 0}
                    />
                    <EuiText className={styles.quantityDisplay}>
                      {techQuantities[tech] || 0}
                    </EuiText>
                    <EuiButtonIcon
                      aria-label={`increment-${tech}`}
                      iconType="plus"
                      size="s"
                      onClick={() => incrementQuantity(tech)}
                    />
                  </div>
                </div>
              ))} */}

                                    {[
                                        // Merge Default Techs and Custom Techs from Backend
                                        ...techList,
                                        ...(skillSet
                                            ?.find(item => item.category === category)
                                            ?.technologies.filter(
                                                tech => !techList.includes(tech.tech) // Avoid duplicates
                                            )
                                            .map(customTech => `${customTech.tech} (custom)`) || [])
                                    ].map(tech => {
                                        // Extract tech name and detect if it's custom
                                        const isCustom = tech.endsWith('(custom)');
                                        const techName = isCustom ? tech.replace(' (custom)', '') : tech;

                                        return (
                                            <div key={tech} className={styles.techItem}>
                                                <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
                                                    {tech}
                                                </p>
                                                <div className={styles.quantityControls}>
                                                    <EuiButtonIcon
                                                        aria-label={`decrement-${techName}`}
                                                        iconType="minus"
                                                        size="s"
                                                        onClick={() => decrementQuantity(techName)}
                                                        disabled={techQuantities[techName] <= 0}
                                                    />
                                                    <EuiText className={styles.quantityDisplay}>
                                                        {techQuantities[techName] || 0}
                                                    </EuiText>
                                                    <EuiButtonIcon
                                                        aria-label={`increment-${techName}`}
                                                        iconType="plus"
                                                        size="s"
                                                        onClick={() => incrementQuantity(techName)}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* custom Techs */}
                                    {customTechnologies[category]?.map(customTech => (
                                        <div key={customTech} className={styles.techItem}>
                                            <p style={{ fontWeight: 'normal', fontSize: '13px', color: '#5C3C00' }}>
                                                {customTech} <span style={{ fontStyle: 'italic' }}>(added)  <EuiIcon type='trash' cursor={'pointer'} color='danger' size='s' onClick={() => {
                                                    removeCustomAddedTech(category, customTech)
                                                }} /></span>
                                            </p>
                                            <div className={styles.quantityControls}>
                                                <EuiButtonIcon
                                                    aria-label={`decrement-${customTech}`}
                                                    iconType="minus"
                                                    size="s"
                                                    onClick={() => decrementQuantity(customTech)}
                                                    disabled={techQuantities[customTech] <= 0}
                                                />
                                                <EuiText className={styles.quantityDisplay}>
                                                    {techQuantities[customTech] || 0}
                                                </EuiText>
                                                <EuiButtonIcon
                                                    aria-label={`increment-${customTech}`}
                                                    iconType="plus"
                                                    size="s"
                                                    onClick={() => incrementQuantity(customTech)}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Custom Tech */}
                                    <div className={styles.addCustomTech}>
                                        <EuiFieldText
                                            placeholder="Add custom technology"
                                            value={newCustomTech}
                                            onChange={e => setNewCustomTech(e.target.value)}
                                            compressed
                                        />
                                        <EuiButton
                                            size="s"
                                            onClick={() => addCustomTech(category)}
                                            disabled={!newCustomTech.trim()}
                                        >
                                            Add
                                        </EuiButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={onUpdateConfirm} size="s" color="success">Update</EuiButton>
                {/* <EuiButton onClick={() => handleCancel(false)} size="s" color="warning">Cancel</EuiButton> */}
            </EuiModalFooter>
        </>
    );
};

// export default EditSkillSet;




export default EditSkillSetForm;
