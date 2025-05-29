import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private pdfMake: any;

  async loadPdfMake(): Promise<void> {
    if (!this.pdfMake) {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.vfs;
    }
  }

  async generatePDF(documentDefinition: any, fileName: string): Promise<void> {
    await this.loadPdfMake();
    this.pdfMake.createPdf(documentDefinition).download(fileName);
  }
}
