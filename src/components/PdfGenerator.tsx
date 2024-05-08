import jsPDF from 'jspdf';
import 'jspdf-autotable';


// Define the PdfGenerator component
const PdfGenerator = ({consumeData,dataItem}:any) => {

    const id = (localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as string) : ""  );

  

    // Sample items data
    const itemsData = [
        {startDate: consumeData.startDate, itemNo: dataItem.itemNo,itemName: dataItem.itemName, qty: dataItem.qty, consumeQty: consumeData.consumeQty, planlot: consumeData.planlot, status: dataItem.status },
    ];

    // Create a new jsPDF instance
    const pdf = new jsPDF({
        orientation: "landscape",

      });

    // Set document properties
    pdf.setProperties({
        title: "Excess Part Consume Plan"
    })

    // Add images and text to the PDF
    const callImage = 'https://www.mybest.my/image/mybest/image/data/Brand%20Logo/Sony-.png';
    const imageUrl = 'https://www.mybest.my/image/mybest/image/data/Brand%20Logo/Sony-.png';
    pdf.addImage(imageUrl, 'JPEG', 10, 5, 40, 12);
    pdf.setFontSize(10);
    pdf.setFont('custom', 'bold');
    pdf.text('EXCESS PART CONSUME PLAN', 125, 12);

    // Line width in units (you can adjust this)
    pdf.setLineWidth(0.1);

    // Line color (RGB)
    pdf.setDrawColor(200, 200, 200);
    pdf.line(10, 18, 500, 18)
    pdf.text('Person In Charge', 13, 23)
    pdf.setFont('custom', 'normal');
    pdf.text(id.name, 13, 28)
    pdf.addImage(callImage, 'PNG', 13, 29, 3, 3);
    pdf.text(id.StaffID, 13, 32)
    pdf.setFont('Newsreader', 'bold')
    pdf.text('Excess ID      :', 230, 23)
    pdf.text('Excess Date   :', 230, 27)
    pdf.text('Request Date    :', 230, 31)
    pdf.setFont('Newsreader', 'normal')
    pdf.text(`${dataItem.excessID}`, 255, 23)
    pdf.text(`${dataItem.excessDate}`, 255, 27)
    pdf.text(`${consumeData.consumeDate}`, 255, 31)
    pdf.line(10, 34, 500, 34)
    pdf.setFont('Newsreader', 'bold')
    pdf.text('Location :', 230, 39)
    pdf.setFont('Newsreader', 'normal')
    pdf.text(`${dataItem.location}`, 230, 44)
    pdf.text('', 230, 48)

    // Generate the vendor-specific content

    pdf.text(`The item part with the item number [${dataItem.itemNo}] request approval from ordering and supply part team for comsumption in Plan Lot (${String(consumeData.planlot).replace(
        /^\*|\*$/g,
        ""
      )})`, 13, 60)
    pdf.setFont('Newsreader', 'normal')
    pdf.setFontSize(10);

    // Generate AutoTable for item details
    const itemDetailsRows = itemsData?.map((item, index) => [
        (index + 1).toString(),
        item.itemName.toString(),
        item.itemNo.toString(),
        item.consumeQty?.toString(),
        item.qty?.toString(),
        String(consumeData.planlot).replace(
            /^\*|\*$/g,
            ""
          ),
        item.startDate.toString(),

    ]);
    const itemDetailsHeaders = ['No', 'Item Name','Item Number', 'Quantity Consume', 'Remain Quantity', 'Plan Lot','Start Date'];
    const columnWidths = [15, 90, 30, 30, 23]; // Adjust column widths as needed
    // Define table styles
    const headerStyles = {
        fillColor: [240, 240, 240],
        textColor: [0],
        fontFamily: 'Newsreader',
        fontStyle: 'bold',
    };

    pdf.setFont('Newsreader');
    const itemDetailsYStart = 70;
     // @ts-ignore
    pdf.autoTable({
        head: [itemDetailsHeaders],
        body: itemDetailsRows,
        startY: itemDetailsYStart, // Adjust the Y position as needed
        headStyles: {
            fillColor: headerStyles.fillColor,
            textColor: headerStyles.textColor,
            fontStyle: headerStyles.fontStyle,
            fontSize: 10, // Adjust the font size as needed
            font: 'Newsreader', // Set the font family
            halign: 'left',
        },
        columnStyles: {
            0: { cellWidth: columnWidths[0] }, // Adjust column widths as needed
            1: { cellWidth: columnWidths[1] },
            2: { cellWidth: columnWidths[2] },
            3: { cellWidth: columnWidths[3] },
            4: { cellWidth: columnWidths[4] },
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: {
            fontSize: 10, // Adjust the font size for the body
            font: 'Newsreader', // Set the font family for the body
            cellPadding: { top: 1, right: 5, bottom: 1, left: 2 }, // Adjust cell padding
            textColor: [0, 0, 0], // Set text color for the body
            rowPageBreak: 'avoid', // Avoid row page breaks
        },
        margin: { top: 10, left: 13 },
    });

    // Add summary and page numbers
    const summaryYStart = pdf.internal.pageSize.getHeight() - 50;

    pdf.setFont('Newsreader', 'normal')
    pdf.text('', 13, summaryYStart + 20)
    pdf.text('______________________________', 13, summaryYStart + 24)
    pdf.setFont('Newsreader', 'bold')
    pdf.text('Part Supply', 13, summaryYStart + 28)

    pdf.setFont('Newsreader', 'normal')
    pdf.text('', 103, summaryYStart + 20)
    pdf.text('______________________________', 103, summaryYStart + 24)
    pdf.setFont('Newsreader', 'bold')
    pdf.text('Ordering', 103, summaryYStart + 28)

    

    // Save the PDF 
    pdf.save(`${consumeData.consumeDate}-${dataItem.itemNo}.pdf`);

    // pdf open in a new tab
    const pdfDataUri = pdf.output('datauristring');
    const newTab = window.open();
    newTab?.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);

}

export default PdfGenerator