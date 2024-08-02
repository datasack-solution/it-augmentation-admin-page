import ExcelJS from 'exceljs';
import { ClientRecord1 } from './clientApi';

const convertToCSV = (objArray: Array<ClientRecord1>) => {
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
        'Skillsets'
    ];
    str += headers.join(',') + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        const clientRecord: ClientRecord1 = array[i];

        line += [
            clientRecord.industry,
            clientRecord.name,
            clientRecord.email,
            clientRecord.phone,
            clientRecord.date,
            clientRecord.requirements ? clientRecord.requirements : ' - ',
            clientRecord.nda ? 'Yes' : 'No',
            clientRecord.city ? clientRecord.city : ' - ',
            clientRecord.contactedChannel ? clientRecord.contactedChannel : ' - ',
            clientRecord.responded !== undefined ? (clientRecord.responded ? 'Yes' : 'No') : ' - ',
            clientRecord.isInterested !== undefined ? (clientRecord.isInterested ? 'Yes' : 'No') : ' - ',
            clientRecord.remarks ? clientRecord.remarks : ' - '
        ].join(',') + ',';

        const hasEmptySkillSet=clientRecord.arrSkillsets == undefined || clientRecord.arrSkillsets.length == 0 || (clientRecord.arrSkillsets.length==1 && clientRecord.arrSkillsets[0].predefinedTechData.length==0 && clientRecord.arrSkillsets[0].customTechsData?.length==0 )


        if (!hasEmptySkillSet && !!clientRecord.arrSkillsets) {
            const skillsetArray: string[] = [];

            clientRecord.arrSkillsets.forEach((skillSet,index) => {
                skillsetArray.push(`Record: ${index+1}`)
                skillSet.predefinedTechData.forEach(mainCat => {
                    let predefinedSkillSets = `${mainCat.mainCategory} > `;
                    mainCat.subcategories.forEach(subCat => {
                        predefinedSkillSets += `${subCat.subcategory} > `;
                        subCat.items.forEach((item, subItemIdx) => {
                            predefinedSkillSets += `${item.techName} (Qty: ${item.quantity})`;
                            if (subItemIdx < subCat.items.length - 1) {
                                predefinedSkillSets += ' & ';
                            }
                        });
                    });
                    skillsetArray.push(predefinedSkillSets);
                });

                if (skillSet.customTechsData) {
                    skillsetArray.push("Custom Tech: ")
                    skillSet.customTechsData.forEach(customTech => {
                        skillsetArray.push(`${customTech.techName} (Qty: ${customTech.quantity})`);
                    });
                }
            });

            line += '"' + JSON.stringify(skillsetArray) + '"';
        }

        str += line + '\r\n';
    }
    return str;
};




export const downloadCSV = (data: Array<ClientRecord1>, fileName: string) => {
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


function capitalize(word:string):string{
    const firstLetter = word.charAt(0)
    const remainingLetters = word.substring(1)
    const firstLetterCap = firstLetter.toUpperCase()
    return firstLetterCap + remainingLetters

}


const convertToExcel = async (data: Array<ClientRecord1>) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ClientRecords');

    const headers = [
        'Industry',
        'Name',
        'Email',
        'Phone',
        'Schedule',
        'Requirements',
        'NDA',
        'City',
        'Contacted Channel',
        'Responded',
        'Is Interested',
        'Remarks',
        'Skillsets'
    ];

    // add header row with styling
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '4F81BD' }
        };
    });

    // initialize an array to hold maximum widths for each column
    const maxColumnWidths = new Array(headers.length).fill(0);

    // add data rows
    data.forEach((clientRecord) => {
        const skillsetArray: Array<{ text: string, color: string }> = [];

        // check if clientRecord has skillsets
        if (clientRecord.arrSkillsets) {
            clientRecord.arrSkillsets.forEach((skillset,index) => {
                if (index==0){
                    skillsetArray.push({ text: `Record ${index+1} \r`, color: 'FFA500' }); 
                }else{
                    skillsetArray.push({ text: `\nRecord ${index+1} \r`, color: 'FFA500' }); 
                }
                skillset.predefinedTechData.forEach(mainCat => {
                    skillsetArray.push({ text: `${mainCat.mainCategory} \r`, color: 'FF0000' }); 
                    mainCat.subcategories.forEach((subCat, subCatIdx) => {
                        if (subCatIdx != 0) {
                            skillsetArray.push({ text: `\r`, color: '000000' });
                        }
                        skillsetArray.push({ text: `${subCat.subcategory} --> `, color: '2980B9' }); 
                        subCat.items.forEach((item, subItemIdx) => {
                            skillsetArray.push({ text: `${item.techName}`, color: 'BE44AD' });
                            skillsetArray.push({ text: ` (Qty:${item.quantity})`, color: '000000' });

                            if (subItemIdx < subCat.items.length - 1) {
                                skillsetArray.push({ text: ' & ', color: '909090' });
                            }
                        });
                    });
                    skillsetArray.push({ text: '\r\n', color: '000000' });
                });

                if (skillset.customTechsData) {
                    skillsetArray.push({ text: "Custom Tech:", color: 'FF0000' });
                    skillset.customTechsData.forEach(customTech => {
                        skillsetArray.push({ text: ` ${customTech.techName}`, color: 'BE44AD' });
                        skillsetArray.push({ text: ` (Qty:${customTech.quantity}), `, color: '000000' });
                    });
                }
                skillsetArray.push({ text: '\r\n', color: '000000' });
            });
        }

        const row = [
            capitalize(clientRecord.industry),
            capitalize(clientRecord.name),
            clientRecord.email,
            clientRecord.phone,
            clientRecord.date,
            clientRecord.requirements && clientRecord.requirements.length > 0 ? clientRecord.requirements : '     -     ',
            clientRecord.nda ? '     Yes     ' : '     No     ',
            clientRecord.city && clientRecord.city.length > 0 ? capitalize(clientRecord.city) : '     -     ',
            clientRecord.contactedChannel && clientRecord.contactedChannel.length > 0 ? clientRecord.contactedChannel : '     -     ',
            clientRecord.responded !== undefined ? (clientRecord.responded ? '    Yes    ' : '    No    ') : '     -     ',
            clientRecord.isInterested !== undefined ? (clientRecord.isInterested ? '    Yes    ' : '    No    ') : '     -     ',
            clientRecord.remarks && clientRecord.remarks?.length > 0 ? clientRecord.remarks : '     -     ',
        ];

        const dataRow = worksheet.addRow(row);

        const hasEmptySkillValue=clientRecord.arrSkillsets == undefined || clientRecord.arrSkillsets.length == 0 || (clientRecord.arrSkillsets.length==1 && clientRecord.arrSkillsets[0].predefinedTechData.length==0 && clientRecord.arrSkillsets[0].customTechsData?.length==0 )
        if (!hasEmptySkillValue) {
            dataRow.height = 150;
        }

        // update max column widths based on content
        row.forEach((cellValue, index) => {
            let cellLength = String(cellValue).length;
            if (cellLength > maxColumnWidths[index]) {
                maxColumnWidths[index] = cellLength;
            }
        });

        if (!hasEmptySkillValue) {
            const startRow = dataRow.number;
            const startColumn = 13;

            const skillsetCell = worksheet.getCell(startRow, startColumn);
            skillsetCell.value = {
                richText: skillsetArray.map(part => ({
                    text: part.text,
                    font: { bold: true, color: { argb: part.color } },
                }))
            };
            skillsetCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        }
    });

    maxColumnWidths.forEach((width, index) => {
        let calcWidth = 30;
        if (headers.length - 1 == index) {
            calcWidth = 60; // increase the width of the column of skillsets
        }
        worksheet.getColumn(index + 1).width = calcWidth;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/octet-stream' });
};
export const downloadExcel = async (data: Array<ClientRecord1>, fileName: string) => {
    const excelBlob = await convertToExcel(data);
    const excelURL = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = excelURL;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
