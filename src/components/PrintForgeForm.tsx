
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Car, Loader2, Settings2, DollarSign, Tag, FileText, Wrench, Fuel, ShieldCheck, CheckSquare, ListChecks, Image as ImageIcon, Download, RefreshCw } from "lucide-react";

const vehicleFormSchema = z.object({
  // Section 1: Vehicle Details
  marca: z.string().min(1, "La marca es obligatoria"),
  modelo: z.string().min(1, "El modelo es obligatorio"),
  version: z.string().min(1, "La versión es obligatoria"),

  // Section 1.5: Main Image
  main_image_url: z.string().url("Debe ser una URL válida").optional().default("https://placehold.co/600x400/E8F0FE/333333.png?text=Veh%C3%ADculo+Predeterminado"),

  // Section 2: Pricing
  price_10000_36: z.string().optional(),
  price_10000_48: z.string().optional(),
  price_15000_36: z.string().optional(),
  price_15000_48: z.string().optional(),
  price_20000_36: z.string().optional(),
  price_20000_48: z.string().optional(),
  price_25000_36: z.string().optional(),
  price_25000_48: z.string().optional(),
  price_30000_36: z.string().optional(),
  price_30000_48: z.string().optional(),
  price_35000_36: z.string().optional(), 
  price_35000_48: z.string().optional(), 
  price_40000_36: z.string().optional(), 
  price_40000_48: z.string().optional(), 
  
  entrada_36: z.string().optional(), 
  entrada_48: z.string().optional(), 
  moves_checkbox: z.boolean().default(false), 

  // Section 3: General Selection & Labels
  label_O: z.boolean().default(false), 
  label_ECO: z.boolean().default(false), 
  label_B: z.boolean().default(false),
  label_C: z.boolean().default(false),

  // Section 4: Featured Elements (now 10 individual fields)
  elemento_destacado_1: z.string().optional(),
  elemento_destacado_2: z.string().optional(),
  elemento_destacado_3: z.string().optional(),
  elemento_destacado_4: z.string().optional(),
  elemento_destacado_5: z.string().optional(),
  elemento_destacado_6: z.string().optional(),
  elemento_destacado_7: z.string().optional(),
  elemento_destacado_8: z.string().optional(),
  elemento_destacado_9: z.string().optional(),
  elemento_destacado_10: z.string().optional(),

  // Section 5: Technical Specifications
  motorizacion: z.string().optional().describe("Ej: DIÉSEL, GASOLINA, HÍBRIDO"), 
  transmision: z.string().optional().describe("Ej: AUTOMÁTICO, MANUAL"), 
  potencia_kw: z.string().optional(), 
  potencia_cv: z.string().optional(), 
  dimensiones_ancho: z.string().optional(), 
  dimensiones_alto: z.string().optional(), 
  dimensiones_largo: z.string().optional(), 
  cilindrada: z.string().optional(), 
  deposito_l: z.string().optional(), 
  emisiones_gkm: z.string().optional(), 
  consumo_wltp_l100km: z.string().optional(), 

  // Section 6: Insurance Options 1 (CONDICIONES)
  seguro_todo_riesgo: z.boolean().default(false).describe("Indica si es seguro todo riesgo con franquicia"),
  franquicia: z.string().optional().describe("Importe de la franquicia, ej: 300"), 
  coche_sustitucion_1: z.boolean().default(false).describe("Indica si tiene vehículo de sustitución"), 
  neumaticos: z.string().optional().describe("Número de neumáticos, ej: 4-8-12"), 

  // Section 7: Insurance Options 2 (OPCIONAL)
  seguro_sin_franquicia: z.boolean().default(false).describe("Indica si es seguro todo riesgo sin franquicia opcional"),
  precio_mes_sin_franquicia: z.string().optional().describe("Coste adicional mensual, ej: 25"), 
  coche_sustitucion_2: z.boolean().default(false).describe("Indica si el vehículo de sustitución opcional está activado"),
  precio_mes_sustitucion_2: z.string().optional().describe("Coste adicional mensual, ej: 20"), 
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const pdfPricingTiers = [10000, 15000, 20000, 25000, 30000];
const allPricingTiers = [10000, 15000, 20000, 25000, 30000, 35000, 40000];

const imageOptions = [
  { id: 'image1', url: 'https://placehold.co/600x400/E8F0FE/333333.png', alt: 'Vista frontal vehículo azul claro', dataAiHint: 'car front' },
  { id: 'image2', url: 'https://placehold.co/600x400/A06CD5/FFFFFF.png', alt: 'Vista lateral vehículo púrpura', dataAiHint: 'car side' },
  { id: 'image3', url: 'https://placehold.co/600x400/4681C4/FFFFFF.png', alt: 'Vista 3/4 vehículo azul oscuro', dataAiHint: 'car perspective' },
];

const defaultEquipamiento = [
  "Equipamiento exterior del Paquete M Sport",
  "Llantas de aleación ligera",
  "Faros led y luces traseras led",
  "Calefacción de los asientos delanteros",
  "Parking Assistant",
  "BMW Live Cockpit Plus con BMW Curved Display",
  "BMW Operating System 9 con navegación",
  "Climatizador",
  "Volante deportivo",
  "Carga inalámbrica para dispositivos móviles"
];


export function PrintForgeForm() {
  const { toast } = useToast();
  const [isDownloadLoading, startDownloadTransition] = useTransition();
  const [isPreviewLoading, startPreviewTransition] = useTransition();
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      marca: "BMW",
      modelo: "118D",
      version: "Pack M",
      main_image_url: imageOptions[0].url,
      moves_checkbox: false,
      label_O: false,
      label_ECO: true, 
      label_B: false,
      label_C: false,
      seguro_todo_riesgo: true, 
      franquicia: "300", 
      coche_sustitucion_1: false, 
      neumaticos: "4-8-12", 
      seguro_sin_franquicia: true, 
      precio_mes_sin_franquicia: "25", 
      coche_sustitucion_2: true, 
      precio_mes_sustitucion_2: "20", 
      elemento_destacado_1: defaultEquipamiento[0] || "",
      elemento_destacado_2: defaultEquipamiento[1] || "",
      elemento_destacado_3: defaultEquipamiento[2] || "",
      elemento_destacado_4: defaultEquipamiento[3] || "",
      elemento_destacado_5: defaultEquipamiento[4] || "",
      elemento_destacado_6: defaultEquipamiento[5] || "",
      elemento_destacado_7: defaultEquipamiento[6] || "",
      elemento_destacado_8: defaultEquipamiento[7] || "",
      elemento_destacado_9: defaultEquipamiento[8] || "",
      elemento_destacado_10: defaultEquipamiento[9] || "",
      potencia_kw: "110",
      potencia_cv: "150",
      transmision: "AUTOMÁTICO",
      motorizacion: "DIÉSEL",
      dimensiones_ancho: "1800",
      dimensiones_alto: "1459",
      dimensiones_largo: "4361",
      cilindrada: "4", 
      deposito_l: "49",
      emisiones_gkm: "124",
      consumo_wltp_l100km: "4,7",
      price_10000_36: "565", price_10000_48: "515",
      price_15000_36: "580", price_15000_48: "530",
      price_20000_36: "595", price_20000_48: "545",
      price_25000_36: "610", price_25000_48: "560",
      price_30000_36: "625", price_30000_48: "575",
      price_35000_36: "640", price_35000_48: "590",
      price_40000_36: "655", price_40000_48: "605",
    },
  });

  useEffect(() => {
    return () => {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl);
      }
    };
  }, [previewPdfUrl]);

  const handleDownloadPdf: SubmitHandler<VehicleFormValues> = (data) => {
    startDownloadTransition(async () => {
      toast({
        title: "Generando PDF...",
        description: "Por favor, espera mientras preparamos tu documento.",
      });
      try {
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let apiErrorMsg = `Error del servidor: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData && errorData.error && typeof errorData.error === 'string') {
              apiErrorMsg = errorData.error; 
            } else if (errorData && errorData.message && typeof errorData.message === 'string') {
              apiErrorMsg = errorData.message; 
            }
          } catch (e) {
            apiErrorMsg = `Error al procesar respuesta del servidor (${response.status}). Inténtalo de nuevo.`;
          }
          throw new Error(apiErrorMsg);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const marca = data.marca || "vehiculo";
        const modelo = data.modelo || "";
        a.download = `ficha_${marca.replace(/\s+/g, '_')}_${modelo.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        toast({
          title: "¡PDF Generado!",
          description: "Tu ficha de vehículo se ha descargado.",
        });
      } catch (error: any) {
        console.error("Error al generar PDF:", error);
        toast({
          title: "Error al Generar PDF",
          description: error.message || "No se pudo generar el PDF. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    });
  };

  const handleRefreshPreview = async () => {
    const data = form.getValues();
    startPreviewTransition(async () => {
      if (previewPdfUrl) {
        URL.revokeObjectURL(previewPdfUrl);
        setPreviewPdfUrl(null);
      }
      toast({
        title: "Actualizando previsualización...",
        description: "Generando nueva vista previa.",
      });
      try {
        const response = await fetch('/api/generate-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let apiErrorMsg = `Error del servidor: ${response.status}`;
          try {
            const errorData = await response.json();
             if (errorData && errorData.error && typeof errorData.error === 'string') {
              apiErrorMsg = errorData.error; 
            } else if (errorData && errorData.message && typeof errorData.message === 'string') {
              apiErrorMsg = errorData.message; 
            }
          } catch (e) {
             apiErrorMsg = `Error al procesar respuesta del servidor (${response.status}) para la previsualización.`;
          }
          throw new Error(apiErrorMsg);
        }

        const blob = await response.blob();
        const newUrl = URL.createObjectURL(blob);
        setPreviewPdfUrl(newUrl);
        toast({
          title: "¡Previsualización Actualizada!",
          description: "La vista previa se ha cargado.",
        });
      } catch (error: any) {
        console.error("Error al refrescar previsualización:", error);
        setPreviewPdfUrl(null); 
        toast({
          title: "Error al Actualizar Previsualización",
          description: error.message || "No se pudo generar la previsualización. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        });
      }
    });
  };
  
  const isLoading = isPreviewLoading || isDownloadLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <Card className="md:col-span-2 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Car className="h-7 w-7 text-primary" />
            Configura Tu Vehículo
          </CardTitle>
          <CardDescription>
            Completa los detalles a continuación para la configuración del vehículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDownloadPdf)} className="space-y-8">
              
              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><Tag className="h-5 w-5" />Detalles del Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField control={form.control} name="marca" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl><Input placeholder="ej., BMW" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="modelo" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl><Input placeholder="ej., 118D" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="version" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Versión/Paquete</FormLabel>
                        <FormControl><Input placeholder="ej., Pack M" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                   <CardTitle className="text-xl flex items-center gap-2"><ImageIcon className="h-5 w-5" />Imagen Principal del Vehículo</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="main_image_url"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Selecciona una imagen principal</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            {imageOptions.map((option) => (
                              <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value={option.url} id={option.id} />
                                </FormControl>
                                <FormLabel htmlFor={option.id} className="font-normal cursor-pointer">
                                  <div className="flex items-center gap-2">
                                    <Image 
                                      src={option.url.replace('600x400', '100x75')} 
                                      alt={option.alt} 
                                      width={60} 
                                      height={45} 
                                      className="rounded border"
                                      data-ai-hint={option.dataAiHint}
                                    />
                                    <span>{option.alt.substring(0,20)+(option.alt.length > 20 ? '...':'')}</span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                   <CardTitle className="text-xl flex items-center gap-2"><DollarSign className="h-5 w-5" />Precios de Renting</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 items-center mb-2">
                        <FormLabel className="font-semibold">Km/año</FormLabel>
                        <FormLabel className="font-semibold text-center">36 Meses (€)</FormLabel>
                        <FormLabel className="font-semibold text-center">48 Meses (€)</FormLabel>
                    </div>
                    {allPricingTiers.map(tier => (
                        <div key={tier} className="grid grid-cols-3 gap-x-4 gap-y-2 items-center">
                            <FormLabel>{tier.toLocaleString('es-ES')}</FormLabel>
                            <FormField control={form.control} name={`price_${tier}_36` as keyof VehicleFormValues} render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input type="number" placeholder="Precio" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name={`price_${tier}_48` as keyof VehicleFormValues} render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input type="number" placeholder="Precio" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    ))}
                    <p className="text-xs text-muted-foreground pt-2">Los precios para 35.000 y 40.000 km/año se pueden introducir.</p>
                     <FormField control={form.control} name="moves_checkbox" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">Plan Moves</FormLabel>
                        </FormItem>
                    )} />
                </CardContent>
              </Card>
              
              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><ListChecks className="h-5 w-5" />Etiquetas y Características Adicionales</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div>
                    <FormLabel className="mb-2 block">Etiquetas Ambientales</FormLabel>
                    <div className="flex flex-wrap gap-4">
                      <FormField control={form.control} name="label_ECO" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="font-normal">ECO</FormLabel>
                        </FormItem>
                      )} />
                      {(['O', 'B', 'C'] as const).map(label => (
                        <FormField key={label} control={form.control} name={`label_${label}` as keyof VehicleFormValues} render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">{label}</FormLabel>
                          </FormItem>
                        )} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2"><ListChecks className="h-5 w-5" />Equipamiento Destacado</CardTitle>
                    <CardDescription>Introduce hasta 10 elementos destacados. Se mostrarán en dos columnas.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <FormField
                            key={`elemento_destacado_${index + 1}`}
                            control={form.control}
                            name={`elemento_destacado_${index + 1}` as keyof VehicleFormValues}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Elemento {index + 1}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={`Elemento destacado ${index + 1}`} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </CardContent>
              </Card>


              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><Wrench className="h-5 w-5" />Especificaciones Técnicas</CardTitle>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="potencia_kw" render={({ field }) => (
                    <FormItem><FormLabel>Potencia (kW)</FormLabel><FormControl><Input type="text" placeholder="ej. 110" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="potencia_cv" render={({ field }) => (
                    <FormItem><FormLabel>Potencia (CV)</FormLabel><FormControl><Input type="text" placeholder="ej. 150" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="transmision" render={({ field }) => (
                    <FormItem><FormLabel>Transmisión</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona transmisión" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="AUTOMÁTICO">AUTOMÁTICO</SelectItem>
                          <SelectItem value="MANUAL">MANUAL</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="motorizacion" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motorización</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona tipo de motor" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="DIÉSEL">DIÉSEL</SelectItem>
                          <SelectItem value="GASOLINA">GASOLINA</SelectItem>
                          <SelectItem value="HÍBRIDO">HÍBRIDO</SelectItem>
                          <SelectItem value="ELÉCTRICO">ELÉCTRICO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dimensiones_ancho" render={({ field }) => (
                    <FormItem><FormLabel>Ancho (mm)</FormLabel><FormControl><Input type="text" placeholder="ej. 1800" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dimensiones_alto" render={({ field }) => (
                    <FormItem><FormLabel>Alto (mm)</FormLabel><FormControl><Input type="text" placeholder="ej. 1459" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="dimensiones_largo" render={({ field }) => (
                    <FormItem><FormLabel>Largo (mm)</FormLabel><FormControl><Input type="text" placeholder="ej. 4361" {...field} onChange={e => field.onChange(e.target.value.replace(/[^0-9]/g, ''))} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="cilindrada" render={({ field }) => ( 
                    <FormItem><FormLabel>Cilindrada / Nº Cilindros</FormLabel><FormControl><Input type="text" placeholder="ej. 4" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="deposito_l" render={({ field }) => (
                    <FormItem><FormLabel>Depósito (L)</FormLabel><FormControl><Input type="text" placeholder="ej. 49" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="emisiones_gkm" render={({ field }) => (
                    <FormItem><FormLabel>Emisiones (g/km)</FormLabel><FormControl><Input type="text" placeholder="ej. 124" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="consumo_wltp_l100km" render={({ field }) => (
                    <FormItem><FormLabel>Consumo WLTP (L/100km)</FormLabel><FormControl><Input type="text" placeholder="ej. 4,7" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
              
              <Card className="p-4 sm:p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Condiciones y Opcionales</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border rounded-md">
                      <h4 className="font-medium">Condiciones Base</h4>
                      <FormField control={form.control} name="seguro_todo_riesgo" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="font-normal">Seguro todo riesgo con franquicia</FormLabel><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="franquicia" render={({ field }) => (
                        <FormItem><FormLabel>Importe Franquicia (€)</FormLabel><FormControl><Input type="text" placeholder="ej. 300" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="coche_sustitucion_1" render={({ field }) => ( 
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                           <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                           <FormLabel className="font-normal">Incluye vehículo de sustitución</FormLabel>
                           <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="neumaticos" render={({ field }) => (
                        <FormItem><FormLabel>Nº de Neumáticos</FormLabel><FormControl><Input placeholder="ej. 4-8-12" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>

                    <div className="space-y-4 p-4 border rounded-md">
                      <h4 className="font-medium">Opcional Adicional</h4>
                       <FormField control={form.control} name="seguro_sin_franquicia" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel className="font-normal">Seguro todo riesgo sin franquicia (Opcional)</FormLabel><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="precio_mes_sin_franquicia" render={({ field }) => (
                        <FormItem><FormLabel>Coste Adicional / Mes (€)</FormLabel><FormControl><Input type="text" placeholder="ej. 25" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="coche_sustitucion_2" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                           <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                           <FormLabel className="font-normal">Vehículo de Sustitución (Opcional)</FormLabel><FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="precio_mes_sustitucion_2" render={({ field }) => (
                        <FormItem><FormLabel>Coste Adicional / Mes (€)</FormLabel><FormControl><Input type="text" placeholder="ej. 20" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6 md:col-span-1">
        <Card className="shadow-xl sticky top-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6 text-primary" />
              Previsualización del Diseño
            </CardTitle>
            <CardDescription>
              Actualiza para ver los cambios aplicados o descarga el documento final.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              type="button" 
              onClick={handleRefreshPreview} 
              disabled={isLoading} 
              className="w-full"
            >
              {isPreviewLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-5 w-5" />
              )}
              Actualizar Previsualización
            </Button>
            
            <div className="aspect-[1/1.414] w-full border rounded-md bg-muted/10 flex items-center justify-center overflow-hidden">
              {isPreviewLoading && (
                 <div className="text-center text-muted-foreground p-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-2" />
                    <p>Cargando previsualización...</p>
                 </div>
              )}
              {!isPreviewLoading && !previewPdfUrl && (
                <div className="text-center text-muted-foreground p-4">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p>La previsualización aparecerá aquí.</p>
                  <p className="text-xs">Rellena el formulario y haz clic en "Actualizar Previsualización".</p>
                </div>
              )}
              {!isPreviewLoading && previewPdfUrl && (
                <iframe
                  src={previewPdfUrl}
                  className="w-full h-full border-0"
                  title="Previsualización del PDF"
                />
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="button" 
              onClick={() => form.handleSubmit(handleDownloadPdf)()} 
              disabled={isLoading || !form.formState.isValid && Object.keys(form.formState.touchedFields).length > 0 } 
              className="w-full"
              size="lg"
            >
              {isDownloadLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Download className="mr-2 h-5 w-5" />
              )}
              Descargar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

