
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';
import type { VehicleFormValues } from '@/components/PrintForgeForm';
import { pdfStyles as styles } from '@/lib/pdfStyles';

const pdfPricingTiers = [10000, 15000, 20000, 25000, 30000]; // PDF only shows these 5 tiers

interface VehiclePDFDocumentProps {
  data: VehicleFormValues;
}

export const VehiclePDFDocument: React.FC<VehiclePDFDocumentProps> = ({ data }) => {
  const allElementos = [
    data.elemento_destacado_1, data.elemento_destacado_2, data.elemento_destacado_3, data.elemento_destacado_4, data.elemento_destacado_5,
    data.elemento_destacado_6, data.elemento_destacado_7, data.elemento_destacado_8, data.elemento_destacado_9, data.elemento_destacado_10,
  ].filter(item => item && item.trim() !== '');

  const midPoint = Math.ceil(allElementos.length / 2);
  const elementosCol1 = allElementos.slice(0, midPoint);
  const elementosCol2 = allElementos.slice(midPoint);

  const getPrice = (tier: number, months: 36 | 48) => {
    const key = `price_${tier}_${months}` as keyof VehicleFormValues; // Type assertion
    const priceValue = data[key] as string | undefined; // Explicitly type priceValue
    return String(priceValue ? `${priceValue}€` : '-');
  };
  
  const formatDimension = (value?: string, unit: string = 'mm') => {
    return String(value ? `${value}${unit}` : '-');
  }

  const defaultImageUrl = "https://placehold.co/600x400/E8F0FE/333333.png?text=Veh%C3%ADculo";

  return (
    <Document title={`Ficha Vehículo - ${data.marca} ${data.modelo}`} author="Configurador Vehículos">
      <Page size="A4" style={styles.page}>
        <View style={styles.leftBar} fixed />

        <View style={styles.mainContent}>
          <View style={styles.headerSection}>
            <Text style={styles.vehicleTitle}>{String(`${data.marca || 'N/A'} ${data.modelo || 'N/A'}`).toUpperCase()}</Text>
            <Text style={styles.vehicleSubtitle}>{String(data.version || 'N/A')}</Text>
          </View>

          <View style={styles.topRow}>
            <View style={styles.pricingSection}>
              <Text style={styles.sectionTitle}>PRECIOS RENTING</Text>
              <View style={styles.pricingGrid}>
                <View style={styles.pricingColumn}>
                  <Text style={styles.pricingHeaderMonths}>{"36"}</Text>
                  <Text style={styles.pricingHeaderSubtext}>meses</Text>
                  {pdfPricingTiers.map(tier => (
                    <View key={`36-${tier}`} style={styles.priceBox}>
                      <Text style={styles.priceBoxKm}>{String(tier.toLocaleString('es-ES'))} km/año</Text>
                      <Text style={styles.priceBoxPrice}>{getPrice(tier, 36)}</Text>
                      <Text style={styles.priceBoxVat}>+IVA</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.pricingColumn}>
                  <Text style={styles.pricingHeaderMonths}>{"48"}</Text>
                  <Text style={styles.pricingHeaderSubtext}>meses</Text>
                  {pdfPricingTiers.map(tier => (
                    <View key={`48-${tier}`} style={styles.priceBox}>
                      <Text style={styles.priceBoxKm}>{String(tier.toLocaleString('es-ES'))} km/año</Text>
                      <Text style={styles.priceBoxPrice}>{getPrice(tier, 48)}</Text>
                      <Text style={styles.priceBoxVat}>+IVA</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.imageAndEcoSection}>
              <PdfImage style={styles.carImage} src={data.main_image_url || defaultImageUrl} />
              {data.label_ECO && (
                <View style={styles.ecoLabel}>
                  <Text style={styles.ecoLabelText}>ECO</Text>
                  <View style={styles.ecoLabelDetail}> 
                    <Text style={styles.ecoLabelDetailText}>{"0"}</Text>
                    <Text style={styles.ecoLabelDetailTextSmall}>EMISIONES</Text>
                  </View>
                </View>
              )}
              <View style={styles.solicitarModelo}>
                <Text style={styles.solicitarModeloText}>Solicitar este modelo</Text>
              </View>
            </View>
          </View>

          <View style={styles.equipamientoSection}>
            <Text style={styles.sectionTitleDarkBg}>EQUIPAMIENTO DESTACADO</Text>
            <View style={styles.equipamientoListContainer}>
              <View style={styles.equipamientoColumn}>
                {elementosCol1.map((item, index) => (
                  <Text key={`col1-${index}`} style={styles.equipamientoItem}>• {String(item)}</Text>
                ))}
              </View>
              <View style={styles.equipamientoColumn}>
                {elementosCol2.map((item, index) => (
                  <Text key={`col2-${index}`} style={styles.equipamientoItem}>• {String(item)}</Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.specsSection}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>POTENCIA</Text>
              <Text style={styles.specValue}>{String(data.potencia_kw || '-')} kW {String(data.potencia_cv || '-')} CV</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>TRANSMISIÓN</Text>
              <Text style={styles.specValue}>{String(data.transmision?.toUpperCase() || '-')}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>MOTORIZACIÓN</Text>
              <Text style={styles.specValue}>{String(data.motorizacion?.toUpperCase() || '-')}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>ANCHO</Text>
              <Text style={styles.specValue}>{formatDimension(data.dimensiones_ancho)}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>ALTO</Text>
              <Text style={styles.specValue}>{formatDimension(data.dimensiones_alto)}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>LARGO</Text>
              <Text style={styles.specValue}>{formatDimension(data.dimensiones_largo)}</Text>
            </View>
             <View style={styles.specItem}>
              <Text style={styles.specLabel}>CILINDRADA</Text>
              <Text style={styles.specValue}>{String(data.cilindrada || '-')}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>DEPÓSITO</Text>
              <Text style={styles.specValue}>{String(data.deposito_l ? `${data.deposito_l} L` : '-')}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>EMISIONES</Text>
              <Text style={styles.specValue}>{String(data.emisiones_gkm ? `${data.emisiones_gkm} g/km` : '-')}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>CONSUMO WLTP</Text>
              <Text style={styles.specValue}>{String(data.consumo_wltp_l100km ? `${data.consumo_wltp_l100km} l/100km` : '-')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerSection} fixed>
          <View style={styles.footerContent}>
            <View style={styles.footerColumnCondiciones}>
              <Text style={styles.footerTitle}>CONDICIONES</Text>
              {data.seguro_todo_riesgo && data.franquicia && <Text style={styles.footerText}>{String(`Seguro todo riesgo con franquicia de ${data.franquicia} €`)}</Text>}
              {!data.seguro_todo_riesgo && <Text style={styles.footerText}>Seguro no especificado</Text>}
              
              <Text style={styles.footerText}>{String(data.coche_sustitucion_1 ? 'Con vehículo de sustitución' : 'Sin vehículo de sustitución')}</Text>
              {data.neumaticos && <Text style={styles.footerText}>{String(`Nº de neumáticos: ${data.neumaticos}`)}</Text>}
            </View>
            <View style={styles.footerColumnOpcional}>
              <Text style={styles.footerTitle}>OPCIONAL</Text>
              {data.seguro_sin_franquicia && <Text style={styles.footerText}>{String(`Seguro todo riesgo sin franquicia ${data.precio_mes_sin_franquicia ? `+ ${data.precio_mes_sin_franquicia} €` : ''}`)}</Text>}
              {data.coche_sustitucion_2 && <Text style={styles.footerText}>{String(`Vehículo de sustitución ${data.precio_mes_sustitucion_2 ? `+ ${data.precio_mes_sustitucion_2} €` : ''}`)}</Text>}
            </View>
          </View>
          <View style={styles.footerBottom}>
            <Text style={styles.footerLogo}>proarenting.com</Text>
            <Text style={styles.footerDisclaimer}>*La fotografía del vehículo puede no coincidir con el modelo ofertado.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

