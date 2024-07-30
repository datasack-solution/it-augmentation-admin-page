import { ClientRecord } from "@/util/util";

const convertToCSV1 = (objArray: Array<ClientRecord>) => {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    const headers = [
        'Industry',
        'Name',
        'Email',
        'Phone',
        'Date',
        'Requirements',
        'NDA',
        'City',
        'Contacted Channel',
        'Responded',
        'Is Interested',
        'Remarks',
        'Skillset'
    ];
    str += headers.join(',') + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        const clientRecord: ClientRecord = array[i];

        line += [
            clientRecord.industry,
            clientRecord.name,
            clientRecord.email,
            clientRecord.phone,
            clientRecord.date,
            clientRecord.requirements,
            clientRecord.nda,
            clientRecord.city,
            clientRecord.contactedChannel,
            clientRecord.responded,
            clientRecord.isInterested,
            clientRecord.remarks,
        ].join(',') + ',';

        if (clientRecord.skillsets) {
            const skillsetArray: string[] = [];

            clientRecord.skillsets.predefinedTechData.forEach(mainCat => {
                let predefinedSkillSets = ''
                predefinedSkillSets += `${mainCat.mainCategory} >`
                mainCat.subcategories.forEach(subCat => {
                    predefinedSkillSets += `${subCat.subcategory} > `
                    subCat.items.forEach((item, subItemIdx) => {
                        if (subCat.items.length - 1 == subItemIdx) {
                            predefinedSkillSets += `${item.techName} (Qty: ${item.quantity})`
                        } else {
                            predefinedSkillSets += `${item.techName} (Qty: ${item.quantity}) & `
                        }
                    });
                });
                predefinedSkillSets+=','
                skillsetArray.push(predefinedSkillSets);
                predefinedSkillSets = ''
            });

            if (clientRecord.skillsets.customTechsData) {
                clientRecord.skillsets.customTechsData.forEach(customTech => {
                    skillsetArray.push(`Custom Tech: ${customTech.techName} (Qty: ${customTech.quantity})`);
                });
            }

            line += skillsetArray.join(' ');
        }

        str += line + '\r\n';
    }
    return str;
};



export const downloadCSV = (data: Array<ClientRecord>, fileName: string) => {
    const csvData = new Blob([convertToCSV1(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};