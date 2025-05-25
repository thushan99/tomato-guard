import RNHTMLtoPDF from "react-native-html-to-pdf"

export const downloadPDF = async (
  diseaseResult,
  fertilizerRecommendation,
  dosage,
  alertMessage
) => {
  const htmlContent = `
    <h1>Disease Report</h1>
    <p><strong>Disease:</strong> ${diseaseResult}</p>
    <p><strong>Fertilizer Recommendation:</strong> ${fertilizerRecommendation}</p>
    <p><strong>Dosage:</strong> ${dosage}</p>
    <p><strong>Alert:</strong> ${alertMessage}</p>
  `

  const options = {
    html: htmlContent,
    fileName: "DiseaseReport",
    directory: "Documents",
  }

  try {
    const pdf = await RNHTMLtoPDF.convert(options)
    console.log("PDF Generated", pdf)
    alert("PDF Downloaded to " + pdf.filePath)
  } catch (error) {
    console.error("Error generating PDF", error)
  }
}
