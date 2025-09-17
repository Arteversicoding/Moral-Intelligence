from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_ALIGN_VERTICAL
from datetime import datetime
import os
import tempfile
import json
from typing import Dict, Any

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to get category color
def get_category_color(category: str) -> str:
    colors = {
        'Sangat Baik': '2E7D32',
        'Baik': '43A047',
        'Cukup': 'FFA000',
        'Kurang': 'E53935',
        'Sangat Kurang': 'B71C1C'
    }
    return colors.get(category, '000000')

@app.post("/api/export-word")
async def export_word(data: Dict[str, Any]):
    try:
        # Create a new document
        doc = Document()
        
        # Add title
        title = doc.add_heading('LAPORAN HASIL TES KECERDASAN MORAL', level=1)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # Add date
        date_para = doc.add_paragraph()
        date_para.add_run(f"Tanggal: {datetime.now().strftime('%d %B %Y')}").bold = True
        
        # Add overall score
        doc.add_heading('Skor Keseluruhan', level=2)
        overall_score = data.get('overallScore', 0)
        score_category = data.get('scoreCategory', '')
        
        score_para = doc.add_paragraph()
        score_run = score_para.add_run(f"{overall_score} - {score_category}")
        score_run.bold = True
        score_run.font.size = Pt(14)
        score_run.font.color.rgb = RGBColor.from_string(get_category_color(score_category))
        
        # Add score interpretation
        doc.add_paragraph(data.get('scoreInterpretation', ''))
        
        # Add detailed results table
        doc.add_heading('Hasil Detail', level=2)
        
        # Create table
        table = doc.add_table(rows=1, cols=3)
        table.style = 'Table Grid'
        
        # Add headers
        hdr_cells = table.rows[0].cells
        hdr_cells[0].text = 'Aspek'
        hdr_cells[1].text = 'Skor'
        hdr_cells[2].text = 'Kategori'
        
        # Make headers bold
        for cell in hdr_cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.bold = True
        
        # Add data rows
        aspects = data.get('aspects', {})
        for aspect, score in aspects.items():
            row_cells = table.add_row().cells
            row_cells[0].text = aspect.capitalize()
            row_cells[1].text = str(round(score))
            row_cells[2].text = data['aspectCategories'].get(aspect, '')
            
            # Set color for category
            category = data['aspectCategories'].get(aspect, '')
            if category:
                color = get_category_color(category)
                for paragraph in row_cells[2].paragraphs:
                    for run in paragraph.runs:
                        run.font.color.rgb = RGBColor.from_string(color)
        
        # Save to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
            doc.save(tmp.name)
            tmp_path = tmp.name
        
        # Return the file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return FileResponse(
            tmp_path,
            filename=f"Hasil_Tes_{timestamp}.docx",
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
        
    except Exception as e:
        print(f"Error generating Word document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temporary file
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except:
                pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
