import { ClientRecord } from "@/util/util";
import ExcelJS from 'exceljs';

const convertToCSV = (objArray: Array<ClientRecord>) => {
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
    const csvData = new Blob([convertToCSV(data)], { type: 'text/csv' });
    const csvURL = URL.createObjectURL(csvData);
    const link = document.createElement('a');
    link.href = csvURL;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};




const convertToExcel = async (data: Array<ClientRecord>) => {
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
        'Skillset'
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
        if (clientRecord.skillsets) {
            clientRecord.skillsets.predefinedTechData.forEach(mainCat => {
                skillsetArray.push({ text: `${mainCat.mainCategory} --> `, color: 'FF0000' }); 
                mainCat.subcategories.forEach(subCat => {
                    skillsetArray.push({ text: ` ${subCat.subcategory} --> `, color: '000000' }); 
                    subCat.items.forEach((item, subItemIdx) => {
                        skillsetArray.push({ text: `${item.techName}`, color: 'FF9F06' }); 
                        skillsetArray.push({ text: ` (Qty:${item.quantity})`, color: 'FC6904' }); 

                        if (subItemIdx < subCat.items.length - 1) {
                            skillsetArray.push({ text: ' & ', color: '909090' });
                        }
                    });
                });
                skillsetArray.push({ text: ', ', color: '000000' });
            });

            if (clientRecord.skillsets.customTechsData) {
                clientRecord.skillsets.customTechsData.forEach(customTech => {
                    skillsetArray.push({ text: `Custom Tech: ${customTech.techName}`, color: 'FF9F06' });
                    skillsetArray.push({ text: ` (Qty:${customTech.quantity})`, color: 'FC6904' }); 

                });
            }
        }

        const row = [
            clientRecord.industry,
            clientRecord.name,
            clientRecord.email,
            clientRecord.phone,
            clientRecord.date,
            clientRecord.requirements && clientRecord.requirements.length>0 ? clientRecord.requirements:'     -     ',
            clientRecord.nda ? '     Yes     ':'     No     ',
            clientRecord.city && clientRecord.city.length>0 ? clientRecord.city :'     -     ',
            clientRecord.contactedChannel && clientRecord.contactedChannel.length>0 ? clientRecord.contactedChannel : '     -     ',
            clientRecord.responded && clientRecord.responded ? (clientRecord.responded ? '    Yes    ':'    No    ') : '     -     ',
            clientRecord.isInterested ? '     Yes     ' : '     No     ',
            clientRecord.remarks && clientRecord.remarks?.length>0 ? clientRecord.remarks:'     -     ',
        ];

        const dataRow = worksheet.addRow(row);

        // update max column widths based on content
        row.forEach((cellValue, index) => {
            let cellLength = String(cellValue).length;
            if (cellLength > maxColumnWidths[index]) {
                maxColumnWidths[index] = cellLength;
            }
        });

        const hasSkillSetsValue=clientRecord.skillsets && clientRecord.skillsets.predefinedTechData.length>0 && clientRecord.skillsets.customTechsData && clientRecord.skillsets.customTechsData.length>0
        if (hasSkillSetsValue) {
            //increase the height of the skillsets row
            const startRow = dataRow.number;
            const endRow = startRow + 2; 
            const startColumn = 13; 
            const endColumn = startColumn + 10; 

            worksheet.mergeCells(startRow, startColumn, endRow, endColumn);

            
            const skillsetCell = worksheet.getCell(startRow, startColumn);
            skillsetCell.value = {
                richText: skillsetArray.map(part => ({
                    text: part.text,
                    font: { bold: true, color: { argb: part.color } }
                }))
            };
            skillsetCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

            // adjust row height for merged rows
            for (let i = startRow; i <= endRow; i++) {
                worksheet.getRow(i).height = 30;
            }
        }
    });

    maxColumnWidths.forEach((width, index) => {
        let calcWidth=width+2
        if (headers.length-1==index){
            calcWidth+=10
        }   
        worksheet.getColumn(index + 1).width = calcWidth; 
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { type: 'application/octet-stream' });
};

export const downloadExcel = async (data: Array<ClientRecord>, fileName: string) => {
    const excelBlob = await convertToExcel(data);
    const excelURL = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = excelURL;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
