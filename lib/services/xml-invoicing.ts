
export interface SDIInvoiceData {
  invoiceNumber: string;
  date: string;
  seller: {
    name: string;
    taxId: string; // Codice Fiscale or Partita IVA
    address: string;
    city: string;
    zip: string;
    country: string;
  };
  buyer: {
    name: string;
    taxId: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    sdiCode?: string; // Codice Destinatario (7 chars)
    certifiedEmail?: string; // PEC
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    vatType?: string; // e.g., '00' for standard
  }[];
}

export class XMLInvoicingService {
  /**
   * Generates a Fattura Elettronica XML compliant with Italian SDI standards.
   */
  static generateSDIXML(data: SDIInvoiceData): string {
    const { invoiceNumber, date, seller, buyer, items } = data;
    
    // Default SDI Code to 0000000 if not provided (for private individuals or international)
    const sdiCode = buyer.sdiCode || '0000000';
    
    // Format date to YYYY-MM-DD
    const formattedDate = new Date(date).toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica versione="FPR12" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>${seller.taxId.substring(0, 11)}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${invoiceNumber.replace(/[^a-zA-Z0-9]/g, '')}</ProgressivoInvio>
      <FormatoTrasmissione>FPR12</FormatoTrasmissione>
      <CodiceDestinatario>${sdiCode}</CodiceDestinatario>
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${seller.taxId}</IdCodice>
        </IdFiscaleIVA>
        <Anagrafica>
          <Denominazione>${this.escapeXml(seller.name)}</Denominazione>
        </Anagrafica>
        <RegimeFiscale>RF01</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${this.escapeXml(seller.address)}</Indirizzo>
        <CAP>${seller.zip}</CAP>
        <Comune>${this.escapeXml(seller.city)}</Comune>
        <Nazione>${seller.country}</Nazione>
      </Sede>
    </CedentePrestatore>
    <CessionarioCommittente>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>${buyer.country}</IdPaese>
          <IdCodice>${buyer.taxId}</IdCodice>
        </IdFiscaleIVA>
        <Anagrafica>
          <Denominazione>${this.escapeXml(buyer.name)}</Denominazione>
        </Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${this.escapeXml(buyer.address)}</Indirizzo>
        <CAP>${buyer.zip}</CAP>
        <Comune>${this.escapeXml(buyer.city)}</Comune>
        <Nazione>${buyer.country}</Nazione>
      </Sede>
    </CessionarioCommittente>
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>${formattedDate}</Data>
        <Numero>${invoiceNumber}</Numero>
        <ImportoTotaleDocumento>${this.formatCurrency(this.calculateTotal(items))}</ImportoTotaleDocumento>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>
`;

    items.forEach((item, index) => {
      const taxableAmount = item.unitPrice * item.quantity;
      xml += `      <DettaglioLinee>
        <NumeroLinea>${index + 1}</NumeroLinea>
        <Descrizione>${this.escapeXml(item.description)}</Descrizione>
        <Quantita>${this.formatCurrency(item.quantity)}</Quantita>
        <PrezzoUnitario>${this.formatCurrency(item.unitPrice)}</PrezzoUnitario>
        <PrezzoTotale>${this.formatCurrency(taxableAmount)}</PrezzoTotale>
        <AliquotaIVA>${this.formatCurrency(item.vatRate * 100)}</AliquotaIVA>
      </DettaglioLinee>
`;
    });

    // Summary block for each VAT rate
    const vatRates = [...new Set(items.map(i => i.vatRate))];
    vatRates.forEach(rate => {
      const taxableAmount = items.filter(i => i.vatRate === rate).reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
      const vatAmount = taxableAmount * rate;
      xml += `      <DatiRiepilogo>
        <AliquotaIVA>${this.formatCurrency(rate * 100)}</AliquotaIVA>
        <ImponibileImporto>${this.formatCurrency(taxableAmount)}</ImponibileImporto>
        <Imposta>${this.formatCurrency(vatAmount)}</Imposta>
        <EsigibilitaIVA>I</EsigibilitaIVA>
      </DatiRiepilogo>
`;
    });

    xml += `    </DatiBeniServizi>
  </FatturaElettronicaBody>
</p:FatturaElettronica>`;

    return xml;
  }

  private static calculateTotal(items: SDIInvoiceData['items']): number {
    return items.reduce((sum, item) => sum + (item.unitPrice * item.quantity * (1 + item.vatRate)), 0);
  }

  private static formatCurrency(value: number): string {
    return value.toFixed(2);
  }

  private static escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&"']/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&apos;';
        default: return c;
      }
    });
  }

  /**
   * Generates a KSeF (Poland) compliant XML invoice.
   * This is a simplified version of the FA(2) schema.
   */
  static generateKSeFXML(data: SDIInvoiceData): string {
    const { invoiceNumber, date, seller, buyer, items } = data;
    const formattedDate = new Date(date).toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<Faktura xmlns="http://crd.gov.pl/wzor/2023/06/29/12648/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Naglowek>
    <KodFormularza kodSystemowy="FA (2)" wersjaSchemy="1-0E">FA</KodFormularza>
    <WariantFormularza>2</WariantFormularza>
    <DataWytworzeniaFa>${new Date().toISOString()}</DataWytworzeniaFa>
    <KodWaluty>PLN</KodWaluty>
  </Naglowek>
  <Podmiot1>
    <DaneIdentyfikacyjne>
      <NIP>${seller.taxId.replace(/\D/g, '')}</NIP>
      <Nazwa>${this.escapeXml(seller.name)}</Nazwa>
    </DaneIdentyfikacyjne>
    <Adres>
      <KodKraju>PL</KodKraju>
      <AdresL1>${this.escapeXml(seller.address)}</AdresL1>
      <Miejscowosc>${this.escapeXml(seller.city)}</Miejscowosc>
      <KodPocztowy>${seller.zip}</KodPocztowy>
    </Adres>
  </Podmiot1>
  <Podmiot2>
    <DaneIdentyfikacyjne>
      <NIP>${buyer.taxId.replace(/\D/g, '')}</NIP>
      <Nazwa>${this.escapeXml(buyer.name)}</Nazwa>
    </DaneIdentyfikacyjne>
    <Adres>
      <KodKraju>${buyer.country}</KodKraju>
      <AdresL1>${this.escapeXml(buyer.address)}</AdresL1>
      <Miejscowosc>${this.escapeXml(buyer.city)}</Miejscowosc>
      <KodPocztowy>${buyer.zip}</KodPocztowy>
    </Adres>
  </Podmiot2>
  <Fa>
    <KodWaluty>PLN</KodWaluty>
    <P_1>${formattedDate}</P_1>
    <P_2>${invoiceNumber}</P_2>
    <P_15>${this.formatCurrency(this.calculateTotal(items))}</P_15>
`;

    items.forEach((item, index) => {
      const lineNet = item.unitPrice * item.quantity;
      xml += `    <FaWiersz>
      <NrWierszaFa>${index + 1}</NrWierszaFa>
      <P_7>${this.escapeXml(item.description)}</P_7>
      <P_8B>${item.quantity}</P_8B>
      <P_9A>${this.formatCurrency(item.unitPrice)}</P_9A>
      <P_11>${this.formatCurrency(lineNet)}</P_11>
      <P_12>${item.vatRate * 100}</P_12>
    </FaWiersz>
`;
    });

    xml += `  </Fa>
</Faktura>`;

    return xml;
  }
}
