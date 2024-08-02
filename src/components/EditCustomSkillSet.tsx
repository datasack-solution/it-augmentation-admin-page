import { EuiButtonIcon, EuiFieldText, EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';
import { Fragment, FunctionComponent, useEffect, useState } from 'react';

export interface CustomTech {
    tech: string;
    quantity: string;
    isEditing: boolean;
    originalTech: string;
    originalQuantity: string;
    hasError: boolean;
}

export interface CustomeTechInputProps {
    onSelect: (customTechs: CustomTech[]) => void
    customTechsOnReset: CustomTech[]
}

const EditCustomSkillSet: FunctionComponent<CustomeTechInputProps> = ({
    onSelect,
    customTechsOnReset
}) => {
    const [customTechs, setCustomTechs] = useState<CustomTech[]>([]);

    useEffect(() => {
        setCustomTechs(customTechsOnReset)
    }, [customTechsOnReset])

    const handleTechChange = (index: number, value: string) => {
        const newCustomTechs = [...customTechs];
        newCustomTechs[index].tech = value;
        newCustomTechs[index].hasError = false;
        setCustomTechs(newCustomTechs);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const newCustomTechs = [...customTechs];
        newCustomTechs[index].quantity = value;
        newCustomTechs[index].hasError = false;
        setCustomTechs(newCustomTechs);
    };

    const toggleEdit = (index: number) => {
        const newCustomTechs = [...customTechs];
        newCustomTechs[index].isEditing = !newCustomTechs[index].isEditing;
        if (newCustomTechs[index].isEditing) {
            newCustomTechs[index].originalTech = newCustomTechs[index].tech;
            newCustomTechs[index].originalQuantity = newCustomTechs[index].quantity;
        }
        setCustomTechs(newCustomTechs);
    };

    const toggleDelete = (index: number) => {
        const newCustomTechs = customTechs.filter((_, idx) => idx !== index);
        setCustomTechs(newCustomTechs);
        onSelect(newCustomTechs)
    };

    const saveChanges = (index: number) => {
        const newCustomTechs = [...customTechs];
        if (newCustomTechs[index].tech.trim() === '') {
            newCustomTechs[index].hasError = true;
        } else if (newCustomTechs[index].quantity == '') {
            newCustomTechs[index].hasError = true
        } else {
            newCustomTechs[index].isEditing = false;
            newCustomTechs[index].hasError = false;
        }
        setCustomTechs(newCustomTechs);
        if (newCustomTechs[index].hasError == false) {
            const filteredTechData = customTechs.filter(tech => tech.tech !== '' && tech.quantity != '')
            onSelect(filteredTechData)
        }
    };

    const addCustomTech = () => {
        setCustomTechs([...customTechs, { tech: '', quantity: '', isEditing: true, originalTech: '', originalQuantity: '', hasError: false }]);
    };

    const cancelEdit = (index: number) => {
        const newCustomTechs = [...customTechs];
        if (newCustomTechs[index].originalTech === '' && newCustomTechs[index].originalQuantity === '') {
            newCustomTechs.splice(index, 1);
        } else {
            newCustomTechs[index].tech = newCustomTechs[index].originalTech;
            newCustomTechs[index].quantity = newCustomTechs[index].originalQuantity;
            newCustomTechs[index].isEditing = false;
            newCustomTechs[index].hasError = false;
        }
        setCustomTechs(newCustomTechs);
    };

    return (
        <div style={{ paddingBottom: '50px' }}>
           <p>Custom Techs: </p>
            <div className="customTechContainer">
                {customTechs.map((customTech, index) => (
                    <Fragment key={index}>
                        {customTech.hasError && (
                            <EuiText className='customError' color="danger" size="s">Enter a valid input!</EuiText>
                        )}
                        <EuiFlexGroup key={index} gutterSize="none" alignItems="center" style={{ paddingBottom: '5px' }} responsive={false} >
                            <EuiFlexItem grow={false} >
                                {customTech.isEditing ? (
                                    <EuiFieldText
                                    size={8}
                                        placeholder="Enter Technology"
                                        value={customTech.tech}
                                        onChange={(e) => handleTechChange(index, e.target.value)}
                                        aria-label="Enter custom tech"
                                        isInvalid={customTech.hasError && customTech.tech == ''}
                                        compressed
                                    />
                                ) : (
                                    <EuiFieldText
                                    size={8}
                                        placeholder="Enter Technology"
                                        value={customTech.tech}
                                        onChange={(e) => handleTechChange(index, e.target.value)}
                                        aria-label="Enter custom tech"
                                        disabled
                                        compressed
                                    />
                                )}
                            </EuiFlexItem>
                            <EuiFlexItem grow={false} style={{ padding: '0 5px' }}>
                                {customTech.isEditing ? (
                                    <EuiFieldText
                                    size={3}
                                        placeholder="Enter Quantity"
                                        value={customTech.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        aria-label="Enter quantity"
                                        type="number"
                                        isInvalid={customTech.hasError && customTech.quantity == ''}
                                        compressed
                                    />
                                ) : (
                                    <EuiFieldText
                                    size={3}
                                        placeholder="Enter Quantity"
                                        value={customTech.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        aria-label="Enter quantity"
                                        type="number"
                                        disabled
                                        compressed
                                    />
                                )}
                            </EuiFlexItem>

                            <EuiFlexItem grow={false} style={{ padding: '0 5px' }}>
                                {customTech.isEditing ? (
                                    <EuiFlexGroup gutterSize="s" responsive={false}>
                                        <EuiFlexItem grow={false}>
                                            <EuiButtonIcon
                                                color='success'
                                                iconType="check"
                                                onClick={() => saveChanges(index)}
                                                aria-label="Save"
                                            />
                                        </EuiFlexItem>
                                        <EuiFlexItem grow={false}>
                                            <EuiButtonIcon
                                                color='accent'
                                                iconType="cross"
                                                onClick={() => cancelEdit(index)}
                                                aria-label="Cancel"
                                            />
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                ) : (
                                    <EuiFlexGroup responsive={false}>
                                        <EuiButtonIcon
                                            color='success'
                                            iconType="pencil"
                                            onClick={() => toggleEdit(index)}
                                            aria-label="Edit"
                                        />
                                        <EuiButtonIcon
                                            color='danger'
                                            iconType="trash"
                                            onClick={() => toggleDelete(index)}
                                            aria-label="Delete"
                                        />
                                    </EuiFlexGroup>
                                )}
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </Fragment>
                ))}
            </div>
            <EuiSpacer size="m" />
            <div style={{ cursor: 'pointer',backgroundColor:"#F8F7F5", display: 'inline-flex', boxShadow: "rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px", padding: '5px', alignItems: 'center', borderRadius: '5%' }} onClick={addCustomTech}>
                <p style={{ color: 'black' }}>Add Tech</p>
                <EuiButtonIcon
                    iconType="plusInCircleFilled"

                    color='success'
                    aria-label="Add custom tech"
                ></EuiButtonIcon>
            </div>
            <style jsx>{`
        @media (min-width: 720px) {
          .customTechGroup {
            flex: 1 1 50%;
          }
        }
        .euiFieldText {
          width: 100%;
        }
      `}</style>
        </div>
    );
};

export default EditCustomSkillSet;
