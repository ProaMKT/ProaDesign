
import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { VehiclePDFDocument } from '@/components/pdf/VehiclePDFDocument';
import type { VehicleFormValues } from '@/components/PrintForgeForm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VehicleFormValues;

    // Validate body if necessary, or rely on Zod schema from form
    // For now, assume data is valid as it comes from a Zod-validated form

    const pdfBuffer = await renderToBuffer(VehiclePDFDocument({ data: body }));

    const headers = new Headers();
    headers.append('Content-Type', 'application/pdf');
    const marca = body.marca || "vehiculo";
    const modelo = body.modelo || "";
    const filename = `ficha_${marca.replace(/\s+/g, '_')}_${modelo.replace(/\s+/g, '_')}.pdf`;
    headers.append('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(pdfBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Error generating PDF:', error);
    let errorMessage = 'Error desconocido al generar el PDF.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error al generar el PDF.', error: errorMessage }, { status: 500 });
  }
}
