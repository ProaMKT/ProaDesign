
import { StyleSheet } from '@react-pdf/renderer';

// Main colors from the image
const primaryColor = '#FFFFFF'; // White for text on dark backgrounds
const secondaryColor = '#333333'; // Dark grey for text
const accentColor = '#36A09C'; // Teal/Green
const lightGreyBg = '#F7F7F7'; // Background for content area
const darkGreyText = '#4A4A4A';
const mediumGreyText = '#757575';
// const priceBoxBg = '#E0F2F1'; // Lighter teal for price boxes, or use accentColor with opacity - Using accentColor directly

export const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: lightGreyBg, 
    fontFamily: 'Helvetica', 
    fontSize: 9,
    color: darkGreyText,
    paddingBottom: 100, 
  },
  leftBar: {
    width: 50, 
    backgroundColor: accentColor,
    height: '100%',
  },
  mainContent: {
    flexGrow: 1,
    padding: 20,
    paddingLeft: 10, 
  },
  headerSection: {
    marginBottom: 15,
    textAlign: 'left',
  },
  vehicleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: secondaryColor,
    fontFamily: 'Helvetica-Bold',
  },
  vehicleSubtitle: {
    fontSize: 14,
    color: accentColor,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    minHeight: 250, // Ensure enough height for pricing boxes and image
  },
  pricingSection: {
    width: '48%', 
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: secondaryColor,
    marginBottom: 8,
    textAlign: 'center',
  },
  pricingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingColumn: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pricingHeaderMonths: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: accentColor,
  },
  pricingHeaderSubtext: {
    fontSize: 9,
    color: mediumGreyText,
    marginBottom: 5,
  },
  priceBox: {
    backgroundColor: accentColor, 
    paddingVertical: 6, // Adjusted padding
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4, // Adjusted margin
    width: '100%',
    minHeight: 45, // Ensure boxes have some height
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  priceBoxKm: {
    fontSize: 8,
    color: primaryColor, 
    textAlign: 'center',
  },
  priceBoxPrice: {
    fontSize: 16, // Adjusted size
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: primaryColor, 
    textAlign: 'center',
    marginVertical: 1, // Adjusted margin
  },
  priceBoxVat: {
    fontSize: 7,
    color: primaryColor, 
    textAlign: 'center',
  },
  imageAndEcoSection: {
    width: '50%', 
    alignItems: 'center',
    position: 'relative', 
  },
  carImage: {
    width: '100%',
    height: 180, 
    marginBottom: 5,
  },
  ecoLabel: {
    position: 'absolute',
    left: 10,
    top: 120, 
    backgroundColor: '#4CAF50', 
    paddingHorizontal: 6,
    paddingVertical:3,
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    width: 55, 
  },
  ecoLabelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginRight: 4,
  },
  ecoLabelDetail: {
    backgroundColor: 'white',
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ecoLabelDetailText: {
    color: '#4CAF50',
    fontSize: 7,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  ecoLabelDetailTextSmall: {
    color: '#4CAF50',
    fontSize: 4,
    lineHeight: 1,
  },
  solicitarModelo: {
    marginTop: 10, 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    borderRadius: 15, 
    backgroundColor: '#FFFFFF', 
    alignSelf: 'flex-end', 
    marginRight: 10,
  },
  solicitarModeloText: {
    fontSize: 10,
    color: accentColor,
  },
  equipamientoSection: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
  },
  sectionTitleDarkBg: { 
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: darkGreyText,
    marginBottom: 8,
  },
  equipamientoListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  equipamientoColumn: {
    width: '48%',
  },
  equipamientoItem: {
    fontSize: 8.5,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  specsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    marginBottom: 15,
  },
  specItem: {
    width: '19%', 
    marginBottom: 8,
    alignItems: 'center', 
  },
  specLabel: {
    fontSize: 7,
    color: mediumGreyText,
    marginBottom: 2,
    textAlign: 'center',
  },
  specValue: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: darkGreyText,
    textAlign: 'center',
  },
  footerSection: {
    position: 'absolute',
    bottom: 0,
    left: 0, 
    right: 0, 
    height: 90, 
    backgroundColor: accentColor, 
    color: primaryColor, 
    paddingTop: 10,
    paddingBottom: 5,
    paddingHorizontal: 20, 
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40, 
    marginBottom: 8,
  },
  footerColumnCondiciones: {
    width: '55%',
  },
  footerColumnOpcional: {
    width: '35%',
  },
  footerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  footerText: {
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 40, 
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.3)',
    paddingTop: 5,
    marginTop: 5,
  },
  footerLogo: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
  },
  footerDisclaimer: {
    fontSize: 6.5,
    textAlign: 'right',
    width: '60%',
  },
});

