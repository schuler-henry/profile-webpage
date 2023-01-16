/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import React, { Component } from 'react';
import styles from '../styles/DSGVO.module.css';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { I18n, withTranslation, WithTranslation } from 'next-i18next';
import withRouter, { WithRouterProps } from 'next/dist/client/with-router';
import { PWPLanguageProvider } from '../components/PWPLanguageProvider/PWPLanguageProvider';
import { PageLoadingScreen } from '../components/PageLoadingScreen/PageLoadingScreen';
import { PWPAuthContext } from '../components/PWPAuthProvider/PWPAuthProvider';

export interface DSGVOState {

}

export interface DSGVOProps extends WithTranslation, WithRouterProps {
  i18n: I18n;
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dsgvo'])),
    }
  }
}

/**
 * @class DSGVO Component Class
 * @component
 */
class DSGVO extends Component<DSGVOProps, DSGVOState> {
  constructor(props: DSGVOProps) {
    super(props)
    this.state = {
    }
  }

  static contextType = PWPAuthContext;

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  /**
   * Generates the JSX Output for the Client
   * @returns JSX Output
   */
  render() {
    const { router } = this.props
    if (this.context.user === undefined) {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:DSGVO')}</title>
              <meta name="description" content="DSGVO page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
              <PageLoadingScreen />
            </main>
          </div>
        </PWPLanguageProvider>
      )
    } else {
      return (
        <PWPLanguageProvider i18n={this.props.i18n} t={this.props.t}>
          <div>
            <Head>
              <title>{this.props.t('common:DSGVO')}</title>
              <meta name="description" content="DSGVO page." />
              <link rel="icon" href="/favicon.ico" />
            </Head>

            <header>
              <Header
                username={this.context.user?.username}
                hideLogin={this.context.user}
                hideLogout={!this.context.user}
                path={router.pathname}
                router={this.props.router}
              />
            </header>

            <div className='scrollBody'>
              <main className={styles.main}>
                <div className={styles.box}>
                  <h1 className={styles.adsimple}>Datenschutzerklärung</h1>
                  <h2 id="einleitung-ueberblick" className={styles.adsimple}>Einleitung und Überblick</h2>
                  <p>Wir haben diese Datenschutzerklärung (Fassung 16.01.2023-312394688) verfasst, um Ihnen gemäß der Vorgaben der <a className={styles.adsimple} href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&amp;from=DE&amp;tid=312394688#d1e2269-1-1" target="_blank" rel="noreferrer">Datenschutz-Grundverordnung (EU) 2016/679</a> und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten (kurz Daten) wir als Verantwortliche &#8211; und die von uns beauftragten Auftragsverarbeiter (z. B. Provider) &#8211; verarbeiten, zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten Sie haben. Die verwendeten Begriffe sind geschlechtsneutral zu verstehen.<br />
                    <strong className={styles.adsimple}>Kurz gesagt:</strong> Wir informieren Sie umfassend über Daten, die wir über Sie verarbeiten.</p>
                  <p>Datenschutzerklärungen klingen für gewöhnlich sehr technisch und verwenden juristische Fachbegriffe. Diese Datenschutzerklärung soll Ihnen hingegen die wichtigsten Dinge so einfach und transparent wie möglich beschreiben. Soweit es der Transparenz förderlich ist, werden technische <strong className={styles.adsimple}>Begriffe leserfreundlich erklärt</strong>, Links zu weiterführenden Informationen geboten und <strong className={styles.adsimple}>Grafiken</strong> zum Einsatz gebracht. Wir informieren damit in klarer und einfacher Sprache, dass wir im Rahmen unserer Geschäftstätigkeiten nur dann personenbezogene Daten verarbeiten, wenn eine entsprechende gesetzliche Grundlage gegeben ist. Das ist sicher nicht möglich, wenn man möglichst knappe, unklare und juristisch-technische Erklärungen abgibt, so wie sie im Internet oft Standard sind, wenn es um Datenschutz geht. Ich hoffe, Sie finden die folgenden Erläuterungen interessant und informativ und vielleicht ist die eine oder andere Information dabei, die Sie noch nicht kannten.<br />
                    Wenn trotzdem Fragen bleiben, möchten wir Sie bitten, sich an die unten bzw. im Impressum genannte verantwortliche Stelle zu wenden, den vorhandenen Links zu folgen und sich weitere Informationen auf Drittseiten anzusehen. Unsere Kontaktdaten finden Sie selbstverständlich auch im Impressum.</p>
                  <h2 id="anwendungsbereich" className={styles.adsimple}>Anwendungsbereich</h2>
                  <p>Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten. Mit personenbezogenen Daten meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum Beispiel Name, E-Mail-Adresse und postalische Anschrift einer Person. Die Verarbeitung personenbezogener Daten sorgt dafür, dass wir unsere Dienstleistungen und Produkte anbieten und abrechnen können, sei es online oder offline. Der Anwendungsbereich dieser Datenschutzerklärung umfasst:</p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple}>alle Onlineauftritte (Websites, Onlineshops), die wir betreiben</li>
                    <li className={styles.adsimple}>Social Media Auftritte und E-Mail-Kommunikation</li>
                    <li className={styles.adsimple}>mobile Apps für Smartphones und andere Geräte</li>
                  </ul>
                  <p>
                    <strong className={styles.adsimple}>Kurz gesagt:</strong> Die Datenschutzerklärung gilt für alle Bereiche, in denen personenbezogene Daten im Unternehmen über die genannten Kanäle strukturiert verarbeitet werden. Sollten wir außerhalb dieser Kanäle mit Ihnen in Rechtsbeziehungen eintreten, werden wir Sie gegebenenfalls gesondert informieren.</p>
                  <h2 id="rechtsgrundlagen" className={styles.adsimple}>Rechtsgrundlagen</h2>
                  <p>In der folgenden Datenschutzerklärung geben wir Ihnen transparente Informationen zu den rechtlichen Grundsätzen und Vorschriften, also den Rechtsgrundlagen der Datenschutz-Grundverordnung, die uns ermöglichen, personenbezogene Daten zu verarbeiten.<br />
                    Was das EU-Recht betrifft, beziehen wir uns auf die VERORDNUNG (EU) 2016/679 DES EUROPÄISCHEN PARLAMENTS UND DES RATES vom 27. April 2016. Diese Datenschutz-Grundverordnung der EU können Sie selbstverständlich online auf EUR-Lex, dem Zugang zum EU-Recht, unter <a className={styles.adsimple} href="https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679">https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=celex%3A32016R0679</a> nachlesen.</p>
                  <p>Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden Bedingungen zutrifft:</p>
                  <ol>
                    <li className={styles.adsimple}>
                      <strong className={styles.adsimple}>Einwilligung</strong> (Artikel 6 Absatz 1 lit. a DSGVO): Sie haben uns Ihre Einwilligung gegeben, Daten zu einem bestimmten Zweck zu verarbeiten. Ein Beispiel wäre die Speicherung Ihrer eingegebenen Daten eines Kontaktformulars.</li>
                    <li className={styles.adsimple}>
                      <strong className={styles.adsimple}>Vertrag</strong> (Artikel 6 Absatz 1 lit. b DSGVO): Um einen Vertrag oder vorvertragliche Verpflichtungen mit Ihnen zu erfüllen, verarbeiten wir Ihre Daten. Wenn wir zum Beispiel einen Kaufvertrag mit Ihnen abschließen, benötigen wir vorab personenbezogene Informationen.</li>
                    <li className={styles.adsimple}>
                      <strong className={styles.adsimple}>Rechtliche Verpflichtung</strong> (Artikel 6 Absatz 1 lit. c DSGVO): Wenn wir einer rechtlichen Verpflichtung unterliegen, verarbeiten wir Ihre Daten. Zum Beispiel sind wir gesetzlich verpflichtet Rechnungen für die Buchhaltung aufzuheben. Diese enthalten in der Regel personenbezogene Daten.</li>
                    <li className={styles.adsimple}>
                      <strong className={styles.adsimple}>Berechtigte Interessen</strong> (Artikel 6 Absatz 1 lit. f DSGVO): Im Falle berechtigter Interessen, die Ihre Grundrechte nicht einschränken, behalten wir uns die Verarbeitung personenbezogener Daten vor. Wir müssen zum Beispiel gewisse Daten verarbeiten, um unsere Website sicher und wirtschaftlich effizient betreiben zu können. Diese Verarbeitung ist somit ein berechtigtes Interesse.</li>
                  </ol>
                  <p>Weitere Bedingungen wie die Wahrnehmung von Aufnahmen im öffentlichen Interesse und Ausübung öffentlicher Gewalt sowie dem Schutz lebenswichtiger Interessen treten bei uns in der Regel nicht auf. Soweit eine solche Rechtsgrundlage doch einschlägig sein sollte, wird diese an der entsprechenden Stelle ausgewiesen.</p>
                  <p>Zusätzlich zu der EU-Verordnung gelten auch noch nationale Gesetze:</p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple}>In <strong className={styles.adsimple}>Österreich</strong> ist dies das Bundesgesetz zum Schutz natürlicher Personen bei der Verarbeitung personenbezogener Daten (<strong className={styles.adsimple}>Datenschutzgesetz</strong>), kurz <strong className={styles.adsimple}>DSG</strong>.</li>
                    <li className={styles.adsimple}>In <strong className={styles.adsimple}>Deutschland</strong> gilt das <strong className={styles.adsimple}>Bundesdatenschutzgesetz</strong>, kurz<strong className={styles.adsimple}> BDSG</strong>.</li>
                  </ul>
                  <p>Sofern weitere regionale oder nationale Gesetze zur Anwendung kommen, informieren wir Sie in den folgenden Abschnitten darüber.</p>
                  <h2 id="kontaktdaten-verantwortliche" className={styles.adsimple}>Kontaktdaten des Verantwortlichen</h2>
                  <p>Sollten Sie Fragen zum Datenschutz oder zur Verarbeitung personenbezogener Daten haben, finden Sie nachfolgend die Kontaktdaten der verantwortlichen Person bzw. Stelle:<br />
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Henry Schuler<br />
                      Kastellstraße 69/1, 88316 Isny, Deutschland</span>
                  </p>
                  <p>E-Mail: <a href="mailto:contact@henryschuler.de">contact@henryschuler.de</a>
                    <br />
                    Telefon: <a href="tel:+49 163 7292914">+49 163 7292914</a>
                    <br />
                    Impressum: <a href="https://www.henryschuler.de/impressum">https://www.henryschuler.de/impressum</a>
                  </p>
                  <h2 id="speicherdauer" className={styles.adsimple}>Speicherdauer</h2>
                  <p>Dass wir personenbezogene Daten nur so lange speichern, wie es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist, gilt als generelles Kriterium bei uns. Das bedeutet, dass wir personenbezogene Daten löschen, sobald der Grund für die Datenverarbeitung nicht mehr vorhanden ist. In einigen Fällen sind wir gesetzlich dazu verpflichtet, bestimmte Daten auch nach Wegfall des ursprüngliches Zwecks zu speichern, zum Beispiel zu Zwecken der Buchführung.</p>
                  <p>Sollten Sie die Löschung Ihrer Daten wünschen oder die Einwilligung zur Datenverarbeitung widerrufen, werden die Daten so rasch wie möglich und soweit keine Pflicht zur Speicherung besteht, gelöscht.</p>
                  <p>Über die konkrete Dauer der jeweiligen Datenverarbeitung informieren wir Sie weiter unten, sofern wir weitere Informationen dazu haben.</p>
                  <h2 id="rechte-dsgvo" className={styles.adsimple}>Rechte laut Datenschutz-Grundverordnung</h2>
                  <p>Gemäß Artikel 13, 14 DSGVO informieren wir Sie über die folgenden Rechte, die Ihnen zustehen, damit es zu einer fairen und transparenten Verarbeitung von Daten kommt:</p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple}>Sie haben laut Artikel 15 DSGVO ein Auskunftsrecht darüber, ob wir Daten von Ihnen verarbeiten. Sollte das zutreffen, haben Sie Recht darauf eine Kopie der Daten zu erhalten und die folgenden Informationen zu erfahren:
                      <ul className={styles.adsimple}>
                        <li className={styles.adsimple}>zu welchem Zweck wir die Verarbeitung durchführen;</li>
                        <li className={styles.adsimple}>die Kategorien, also die Arten von Daten, die verarbeitet werden;</li>
                        <li className={styles.adsimple}>wer diese Daten erhält und wenn die Daten an Drittländer übermittelt werden, wie die Sicherheit garantiert werden kann;</li>
                        <li className={styles.adsimple}>wie lange die Daten gespeichert werden;</li>
                        <li className={styles.adsimple}>das Bestehen des Rechts auf Berichtigung, Löschung oder Einschränkung der Verarbeitung und dem Widerspruchsrecht gegen die Verarbeitung;</li>
                        <li className={styles.adsimple}>dass Sie sich bei einer Aufsichtsbehörde beschweren können (Links zu diesen Behörden finden Sie weiter unten);</li>
                        <li className={styles.adsimple}>die Herkunft der Daten, wenn wir sie nicht bei Ihnen erhoben haben;</li>
                        <li className={styles.adsimple}>ob Profiling durchgeführt wird, ob also Daten automatisch ausgewertet werden, um zu einem persönlichen Profil von Ihnen zu gelangen.</li>
                      </ul>
                    </li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 16 DSGVO ein Recht auf Berichtigung der Daten, was bedeutet, dass wir Daten richtig stellen müssen, falls Sie Fehler finden.</li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 17 DSGVO das Recht auf Löschung („Recht auf Vergessenwerden“), was konkret bedeutet, dass Sie die Löschung Ihrer Daten verlangen dürfen.</li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 18 DSGVO das Recht auf Einschränkung der Verarbeitung, was bedeutet, dass wir die Daten nur mehr speichern dürfen aber nicht weiter verwenden.</li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 20 DSGVO das Recht auf Datenübertragbarkeit, was bedeutet, dass wir Ihnen auf Anfrage Ihre Daten in einem gängigen Format zur Verfügung stellen.</li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 21 DSGVO ein Widerspruchsrecht, welches nach Durchsetzung eine Änderung der Verarbeitung mit sich bringt.
                      <ul className={styles.adsimple}>
                        <li className={styles.adsimple}>Wenn die Verarbeitung Ihrer Daten auf Artikel 6 Abs. 1 lit. e (öffentliches Interesse, Ausübung öffentlicher Gewalt) oder Artikel 6 Abs. 1 lit. f (berechtigtes Interesse) basiert, können Sie gegen die Verarbeitung Widerspruch einlegen. Wir prüfen danach so rasch wie möglich, ob wir diesem Widerspruch rechtlich nachkommen können.</li>
                        <li className={styles.adsimple}>Werden Daten verwendet, um Direktwerbung zu betreiben, können Sie jederzeit gegen diese Art der Datenverarbeitung widersprechen. Wir dürfen Ihre Daten danach nicht mehr für Direktmarketing verwenden.</li>
                        <li className={styles.adsimple}>Werden Daten verwendet, um Profiling zu betreiben, können Sie jederzeit gegen diese Art der Datenverarbeitung widersprechen. Wir dürfen Ihre Daten danach nicht mehr für Profiling verwenden.</li>
                      </ul>
                    </li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 22 DSGVO unter Umständen das Recht, nicht einer ausschließlich auf einer automatisierten Verarbeitung (zum Beispiel Profiling) beruhenden Entscheidung unterworfen zu werden.</li>
                    <li className={styles.adsimple}>Sie haben laut Artikel 77 DSGVO das Recht auf Beschwerde. Das heißt, Sie können sich jederzeit bei der Datenschutzbehörde beschweren, wenn Sie der Meinung sind, dass die Datenverarbeitung von personenbezogenen Daten gegen die DSGVO verstößt.</li>
                  </ul>
                  <p>
                    <strong className={styles.adsimple}>Kurz gesagt:</strong> Sie haben Rechte &#8211; zögern Sie nicht, die oben gelistete verantwortliche Stelle bei uns zu kontaktieren!</p>
                  <p>Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche in sonst einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. Diese ist für Österreich die Datenschutzbehörde, deren Website Sie unter <a className={styles.adsimple} href="https://www.dsb.gv.at/?tid=312394688" target="_blank" rel="noreferrer">https://www.dsb.gv.at/</a> finden. In Deutschland gibt es für jedes Bundesland einen Datenschutzbeauftragten. Für nähere Informationen können Sie sich an die <a className={styles.adsimple} href="https://www.bfdi.bund.de/DE/Home/home_node.html" target="_blank" rel="noreferrer">Bundesbeauftragte für den Datenschutz und die Informationsfreiheit (BfDI)</a> wenden. Für unser Unternehmen ist die folgende lokale Datenschutzbehörde zuständig:</p>
                  <h2 id="baden-wuerttemberg-datenschutzbehoerde" className={styles.adsimple}>Baden-Württemberg Datenschutzbehörde</h2>
                  <p>
                    <strong className={styles.adsimple}>Landesbeauftragter für Datenschutz:</strong> Dr. Stefan Brink<br />
                    <strong className={styles.adsimple}>Adresse:</strong> Königstraße 10a, 70173 Stuttgart<br />
                    <strong className={styles.adsimple}>Telefonnr.:</strong> 07 11/61 55 41-0<br />
                    <strong className={styles.adsimple}>E-Mail-Adresse:</strong> poststelle@lfdi.bwl.de<br />
                    <strong className={styles.adsimple}>Website:</strong> <a className={styles.adsimple} href="https://www.baden-wuerttemberg.datenschutz.de/?tid=312394688" target="_blank" rel="noreferrer">https://www.baden-wuerttemberg.datenschutz.de/</a>
                  </p>
                  <h2 id="datenuebertragung-drittlaender" className={styles.adsimple}>Datenübertragung in Drittländer</h2>
                  <p>Wir übertragen oder verarbeiten Daten nur dann in Länder außerhalb der EU (Drittländer), wenn Sie dieser Verarbeitung zustimmen, dies gesetzlich vorgeschrieben ist oder vertraglich notwendig und in jedem Fall nur soweit dies generell erlaubt ist. Ihre Zustimmung ist in den meisten Fällen der wichtigste Grund, dass wir Daten in Drittländern verarbeiten lassen. Die Verarbeitung personenbezogener Daten in Drittländern wie den USA, wo viele Softwarehersteller Dienstleistungen anbieten und Ihre Serverstandorte haben, kann bedeuten, dass personenbezogene Daten auf unerwartete Weise verarbeitet und gespeichert werden.</p>
                  <p>Wir weisen ausdrücklich darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Die Datenverarbeitung durch US-Dienste (wie beispielsweise Google Analytics) kann dazu führen, dass gegebenenfalls Daten nicht anonymisiert verarbeitet und gespeichert werden. Ferner können gegebenenfalls US-amerikanische staatliche Behörden Zugriff auf einzelne Daten nehmen. Zudem kann es vorkommen, dass erhobene Daten mit Daten aus anderen Diensten desselben Anbieters, sofern Sie ein entsprechendes Nutzerkonto haben, verknüpft werden. Nach Möglichkeit versuchen wir Serverstandorte innerhalb der EU zu nutzen, sofern das angeboten wird.</p>
                  <p>Wir informieren Sie an den passenden Stellen dieser Datenschutzerklärung genauer über Datenübertragung in Drittländer, sofern diese zutrifft.</p>
                  <h2 id="sicherheit-datenverarbeitung" className={styles.adsimple}>Sicherheit der Datenverarbeitung</h2>
                  <p>Um personenbezogene Daten zu schützen, haben wir sowohl technische als auch organisatorische Maßnahmen umgesetzt. Wo es uns möglich ist, verschlüsseln oder pseudonymisieren wir personenbezogene Daten. Dadurch machen wir es im Rahmen unserer Möglichkeiten so schwer wie möglich, dass Dritte aus unseren Daten auf persönliche Informationen schließen können.</p>
                  <p>Art. 25 DSGVO spricht hier von &#8220;Datenschutz durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen&#8221; und meint damit, dass man sowohl bei Software (z. B. Formularen) also auch Hardware (z. B. Zugang zum Serverraum) immer an Sicherheit denkt und entsprechende Maßnahmen setzt. Im Folgenden gehen wir, falls erforderlich, noch auf konkrete Maßnahmen ein.</p>
                  <h2 id="tls-verschluesselung-https" className={styles.adsimple}>TLS-Verschlüsselung mit https</h2>
                  <p>TLS, Verschlüsselung und https klingen sehr technisch und sind es auch. Wir verwenden HTTPS (das Hypertext Transfer Protocol Secure steht für „sicheres Hypertext-Übertragungsprotokoll“), um Daten abhörsicher im Internet zu übertragen.<br />
                    Das bedeutet, dass die komplette Übertragung aller Daten von Ihrem Browser zu unserem Webserver abgesichert ist &#8211; niemand kann &#8220;mithören&#8221;.</p>
                  <p>Damit haben wir eine zusätzliche Sicherheitsschicht eingeführt und erfüllen den Datenschutz durch Technikgestaltung (<a className={styles.adsimple} href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&amp;from=DE&amp;tid=312394688" target="_blank" rel="noreferrer">Artikel 25 Absatz 1 DSGVO</a>). Durch den Einsatz von TLS (Transport Layer Security), einem Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet, können wir den Schutz vertraulicher Daten sicherstellen.<br />
                    Sie erkennen die Benutzung dieser Absicherung der Datenübertragung am kleinen Schlosssymbol <img role="img" src="https://www.adsimple.at/wp-content/uploads/2018/03/schlosssymbol-https.svg" alt="schlosssymbol missing" width="17" height="18" /> links oben im Browser, links von der Internetadresse (z. B. beispielseite.de) und der Verwendung des Schemas https (anstatt http) als Teil unserer Internetadresse.<br />
                    Wenn Sie mehr zum Thema Verschlüsselung wissen möchten, empfehlen wir die Google Suche nach &#8220;Hypertext Transfer Protocol Secure wiki&#8221; um gute Links zu weiterführenden Informationen zu erhalten.</p>
                  <h2 id="cookies" className={styles.adsimple}>Cookies</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Cookies Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: abhängig vom jeweiligen Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, der das Cookie setzt.<br />
                          &#x1f4d3; Verarbeitete Daten: Abhängig vom jeweils eingesetzten Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, der das Cookie setzt.<br />
                          &#x1f4c5; Speicherdauer: abhängig vom jeweiligen Cookie, kann von Stunden bis hin zu Jahren variieren<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit.f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was sind Cookies?</h3>
                  <p>Unsere Website verwendet HTTP-Cookies, um nutzerspezifische Daten zu speichern.<br />
                    Im Folgenden erklären wir, was Cookies sind und warum Sie genutzt werden, damit Sie die folgende Datenschutzerklärung besser verstehen.</p>
                  <p>Immer wenn Sie durch das Internet surfen, verwenden Sie einen Browser. Bekannte Browser sind beispielsweise Chrome, Safari, Firefox, Internet Explorer und Microsoft Edge. Die meisten Websites speichern kleine Text-Dateien in Ihrem Browser. Diese Dateien nennt man Cookies.</p>
                  <p>Eines ist nicht von der Hand zu weisen: Cookies sind echt nützliche Helferlein. Fast alle Websites verwenden Cookies. Genauer gesprochen sind es HTTP-Cookies, da es auch noch andere Cookies für andere Anwendungsbereiche gibt. HTTP-Cookies sind kleine Dateien, die von unserer Website auf Ihrem Computer gespeichert werden. Diese Cookie-Dateien werden automatisch im Cookie-Ordner, quasi dem &#8220;Hirn&#8221; Ihres Browsers, untergebracht. Ein Cookie besteht aus einem Namen und einem Wert. Bei der Definition eines Cookies müssen zusätzlich ein oder mehrere Attribute angegeben werden.</p>
                  <p>Cookies speichern gewisse Nutzerdaten von Ihnen, wie beispielsweise Sprache oder persönliche Seiteneinstellungen. Wenn Sie unsere Seite wieder aufrufen, übermittelt Ihr Browser die „userbezogenen“ Informationen an unsere Seite zurück. Dank der Cookies weiß unsere Website, wer Sie sind und bietet Ihnen die Einstellung, die Sie gewohnt sind. In einigen Browsern hat jedes Cookie eine eigene Datei, in anderen wie beispielsweise Firefox sind alle Cookies in einer einzigen Datei gespeichert.</p>
                  <p>Die folgende Grafik zeigt eine mögliche Interaktion zwischen einem Webbrowser wie z. B. Chrome und dem Webserver. Dabei fordert der Webbrowser eine Website an und erhält vom Server ein Cookie zurück, welches der Browser erneut verwendet, sobald eine andere Seite angefordert wird.</p>
                  <p>
                    <img role="img" src="https://www.adsimple.at/wp-content/uploads/2018/03/http-cookie-interaction.svg" alt="HTTP Cookie Interaktion zwischen Browser und Webserver" width="100%" className={styles.adsimpleImage} />
                  </p>
                  <p>Es gibt sowohl Erstanbieter Cookies als auch Drittanbieter-Cookies. Erstanbieter-Cookies werden direkt von unserer Seite erstellt, Drittanbieter-Cookies werden von Partner-Websites (z.B. Google Analytics) erstellt. Jedes Cookie ist individuell zu bewerten, da jedes Cookie andere Daten speichert. Auch die Ablaufzeit eines Cookies variiert von ein paar Minuten bis hin zu ein paar Jahren. Cookies sind keine Software-Programme und enthalten keine Viren, Trojaner oder andere „Schädlinge“. Cookies können auch nicht auf Informationen Ihres PCs zugreifen.</p>
                  <p>So können zum Beispiel Cookie-Daten aussehen:</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> _ga<br />
                    <strong className={styles.adsimple}>Wert:</strong> GA1.2.1326744211.152312394688-9<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Unterscheidung der Websitebesucher<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>Diese Mindestgrößen sollte ein Browser unterstützen können:</p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple}>Mindestens 4096 Bytes pro Cookie</li>
                    <li className={styles.adsimple}>Mindestens 50 Cookies pro Domain</li>
                    <li className={styles.adsimple}>Mindestens 3000 Cookies insgesamt</li>
                  </ul>
                  <h3 className={styles.adsimple}>Welche Arten von Cookies gibt es?</h3>
                  <p>Die Frage welche Cookies wir im Speziellen verwenden, hängt von den verwendeten Diensten ab und wird in den folgenden Abschnitten der Datenschutzerklärung geklärt. An dieser Stelle möchten wir kurz auf die verschiedenen Arten von HTTP-Cookies eingehen.</p>
                  <p>Man kann 4 Arten von Cookies unterscheiden:</p>
                  <p>
                    <strong className={styles.adsimple}>Unerlässliche Cookies<br />
                    </strong>Diese Cookies sind nötig, um grundlegende Funktionen der Website sicherzustellen. Zum Beispiel braucht es diese Cookies, wenn ein User ein Produkt in den Warenkorb legt, dann auf anderen Seiten weitersurft und später erst zur Kasse geht. Durch diese Cookies wird der Warenkorb nicht gelöscht, selbst wenn der User sein Browserfenster schließt.</p>
                  <p>
                    <strong className={styles.adsimple}>Zweckmäßige Cookies<br />
                    </strong>Diese Cookies sammeln Infos über das Userverhalten und ob der User etwaige Fehlermeldungen bekommt. Zudem werden mithilfe dieser Cookies auch die Ladezeit und das Verhalten der Website bei verschiedenen Browsern gemessen.</p>
                  <p>
                    <strong className={styles.adsimple}>Zielorientierte Cookies<br />
                    </strong>Diese Cookies sorgen für eine bessere Nutzerfreundlichkeit. Beispielsweise werden eingegebene Standorte, Schriftgrößen oder Formulardaten gespeichert.</p>
                  <p>
                    <strong className={styles.adsimple}>Werbe-Cookies<br />
                    </strong>Diese Cookies werden auch Targeting-Cookies genannt. Sie dienen dazu dem User individuell angepasste Werbung zu liefern. Das kann sehr praktisch, aber auch sehr nervig sein.</p>
                  <p>Üblicherweise werden Sie beim erstmaligen Besuch einer Website gefragt, welche dieser Cookiearten Sie zulassen möchten. Und natürlich wird diese Entscheidung auch in einem Cookie gespeichert.</p>
                  <p>Wenn Sie mehr über Cookies wissen möchten und technische Dokumentationen nicht scheuen, empfehlen wir <a className={styles.adsimple} href="https://datatracker.ietf.org/doc/html/rfc6265">https://datatracker.ietf.org/doc/html/rfc6265</a>, dem Request for Comments der Internet Engineering Task Force (IETF) namens &#8220;HTTP State Management Mechanism&#8221;.</p>
                  <h3 className={styles.adsimple}>Zweck der Verarbeitung über Cookies</h3>
                  <p>Der Zweck ist letztendlich abhängig vom jeweiligen Cookie. Mehr Details dazu finden Sie weiter unten bzw. beim Hersteller der Software, die das Cookie setzt.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden verarbeitet?</h3>
                  <p>Cookies sind kleine Gehilfen für eine viele verschiedene Aufgaben. Welche Daten in Cookies gespeichert werden, kann man leider nicht verallgemeinern, aber wir werden Sie im Rahmen der folgenden Datenschutzerklärung über die verarbeiteten bzw. gespeicherten Daten informieren.</p>
                  <h3 className={styles.adsimple}>Speicherdauer von Cookies</h3>
                  <p>Die Speicherdauer hängt vom jeweiligen Cookie ab und wird weiter unter präzisiert. Manche Cookies werden nach weniger als einer Stunde gelöscht, andere können mehrere Jahre auf einem Computer gespeichert bleiben.</p>
                  <p>Sie haben außerdem selbst Einfluss auf die Speicherdauer. Sie können über ihren Browser sämtliche Cookies jederzeit manuell löschen (siehe auch unten &#8220;Widerspruchsrecht&#8221;). Ferner werden Cookies, die auf einer Einwilligung beruhen, spätestens nach Widerruf Ihrer Einwilligung gelöscht, wobei die Rechtmäßigkeit der Speicherung bis dahin unberührt bleibt.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht &#8211; wie kann ich Cookies löschen?</h3>
                  <p>Wie und ob Sie Cookies verwenden wollen, entscheiden Sie selbst. Unabhängig von welchem Service oder welcher Website die Cookies stammen, haben Sie immer die Möglichkeit Cookies zu löschen, zu deaktivieren oder nur teilweise zuzulassen. Zum Beispiel können Sie Cookies von Drittanbietern blockieren, aber alle anderen Cookies zulassen.</p>
                  <p>Wenn Sie feststellen möchten, welche Cookies in Ihrem Browser gespeichert wurden, wenn Sie Cookie-Einstellungen ändern oder löschen wollen, können Sie dies in Ihren Browser-Einstellungen finden:</p>
                  <p>
                    <a className={styles.adsimple} href="https://support.google.com/chrome/answer/95647?tid=312394688" target="_blank" rel="noreferrer noreferrer">Chrome: Cookies in Chrome löschen, aktivieren und verwalten</a>
                  </p>
                  <p>
                    <a className={styles.adsimple} href="https://support.apple.com/de-at/guide/safari/sfri11471/mac?tid=312394688" target="_blank" rel="noreferrer noreferrer">Safari: Verwalten von Cookies und Websitedaten mit Safari</a>
                  </p>
                  <p>
                    <a className={styles.adsimple} href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen?tid=312394688" target="_blank" rel="noreferrer noreferrer">Firefox: Cookies löschen, um Daten zu entfernen, die Websites auf Ihrem Computer abgelegt haben</a>
                  </p>
                  <p>
                    <a className={styles.adsimple} href="https://support.microsoft.com/de-de/windows/l%C3%B6schen-und-verwalten-von-cookies-168dab11-0753-043d-7c16-ede5947fc64d?tid=312394688">Internet Explorer: Löschen und Verwalten von Cookies</a>
                  </p>
                  <p>
                    <a className={styles.adsimple} href="https://support.microsoft.com/de-de/microsoft-edge/cookies-in-microsoft-edge-l%C3%B6schen-63947406-40ac-c3b8-57b9-2a946a29ae09?tid=312394688">Microsoft Edge: Löschen und Verwalten von Cookies</a>
                  </p>
                  <p>Falls Sie grundsätzlich keine Cookies haben wollen, können Sie Ihren Browser so einrichten, dass er Sie immer informiert, wenn ein Cookie gesetzt werden soll. So können Sie bei jedem einzelnen Cookie entscheiden, ob Sie das Cookie erlauben oder nicht. Die Vorgangsweise ist je nach Browser verschieden. Am besten Sie suchen die Anleitung in Google mit dem Suchbegriff “Cookies löschen Chrome” oder &#8220;Cookies deaktivieren Chrome&#8221; im Falle eines Chrome Browsers.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Seit 2009 gibt es die sogenannten „Cookie-Richtlinien“. Darin ist festgehalten, dass das Speichern von Cookies eine <strong className={styles.adsimple}>Einwilligung</strong> (Artikel 6 Abs. 1 lit. a DSGVO) von Ihnen verlangt. Innerhalb der EU-Länder gibt es allerdings noch sehr unterschiedliche Reaktionen auf diese Richtlinien. In Österreich erfolgte aber die Umsetzung dieser Richtlinie in § 96 Abs. 3 des Telekommunikationsgesetzes (TKG). In Deutschland wurden die Cookie-Richtlinien nicht als nationales Recht umgesetzt. Stattdessen erfolgte die Umsetzung dieser Richtlinie weitgehend in § 15 Abs.3 des Telemediengesetzes (TMG).</p>
                  <p>Für unbedingt notwendige Cookies, auch soweit keine Einwilligung vorliegt, bestehen <strong className={styles.adsimple}>berechtigte Interessen</strong> (Artikel 6 Abs. 1 lit. f DSGVO), die in den meisten Fällen wirtschaftlicher Natur sind. Wir möchten den Besuchern der Website eine angenehme Benutzererfahrung bescheren und dafür sind bestimmte Cookies oft unbedingt notwendig.</p>
                  <p>Soweit nicht unbedingt erforderliche Cookies zum Einsatz kommen, geschieht dies nur im Falle Ihrer Einwilligung. Rechtsgrundlage ist insoweit Art. 6 Abs. 1 lit. a DSGVO.</p>
                  <p>In den folgenden Abschnitten werden Sie genauer über den Einsatz von Cookies informiert, sofern eingesetzte Software Cookies verwendet.</p>
                  <h2 id="registrierung" className={styles.adsimple}>Registrierung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Registrierung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: <span className={styles.adsimple} style={{ fontWeight: "400" }}>Alle Personen, die sich registrieren, ein Konto anlegen, sich anmelden und das Konto nutzen.<br />
                            &#x1f4d3; Verarbeitete Daten: E-Mail-Adresse, Name, Passwort und weitere Daten, die im Zuge der Registrierung, Anmeldung und Kontonutzung erhoben werden.<br />
                          </span>&#x1f91d; Zweck: <span className={styles.adsimple} style={{ fontWeight: "400" }}>Zurverfügungstellung unserer Dienstleistungen. Kommunikation mit Kunden in Zusammenhang mit den Dienstleistungen.</span>
                          <br />
                          &#x1f4c5; Speicherdauer: S<span className={styles.adsimple} style={{ fontWeight: "400" }}>olange das mit den Texten verbundene Firmenkonto besteht und danach i.d.R. 3 Jahre.<br />
                          </span>&#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO (Vertrag), Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Wenn Sie sich bei uns registrieren, kann es zur Verarbeitung personenbezogener Daten kommen, sofern Sie Daten mit Personenbezug eingeben bzw. Daten wie die IP-Adresse im Zuge der Verarbeitung erfasst werden. Was wir mit dem doch recht sperrigen Begriff “personenbezogene Daten” meinen, können Sie weiter unten nachlesen.</span>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bitte geben Sie nur solche Daten ein, die wir für die Registrierung benötigen und für die Sie die Freigabe eines Dritten haben, falls Sie die Registrierung im Namen eines Dritten durchführen. Verwenden Sie nach Möglichkeit ein sicheres Passwort, welches Sie sonst nirgends verwenden und eine E-Mail-Adresse, die Sie regelmäßig abrufen.</span>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Im Folgenden informieren wir Sie über die genaue Art der Datenverarbeitung, denn Sie sollen sich bei uns wohl fühlen!</span>
                  </p>
                  <h3 className={styles.adsimple}>Was ist eine Registrierung?</h3>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bei einer Registrierung nehmen wir bestimmte Daten von Ihnen entgegen und ermöglichen es Ihnen sich später bei uns einfach online anzumelden und Ihr Konto bei uns zu verwenden. Ein Konto bei uns hat den Vorteil, dass Sie nicht jedes Mal alles erneut eingeben müssen. Spart Zeit, Mühe und verhindert letztendlich Fehler bei der Erbringung unserer Dienstleistungen.</span>
                  </p>
                  <h3 className={styles.adsimple}>Warum verarbeiten wir personenbezogene Daten?</h3>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Kurz gesagt verarbeiten wir personenbezogene Daten, um die Erstellung und Nutzung eines Kontos bei uns zu ermöglichen.</span>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>
                      <br />
                    </span>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Würden wir das nicht tun, müssten Sie jedes Mal alle Daten eingeben, auf eine Freigabe von uns warten und alles noch einmal eingeben. Das fänden wir und viele, viele Kunden nicht so gut. Wie würden Sie das finden?</span>
                  </p>
                  <h3 className={styles.adsimple}>Welche Daten werden verarbeitet?</h3>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Alle Daten, die Sie im Zuge der Registrierung angegeben haben, bei der Anmeldung eingeben oder im Rahmen der Verwaltung Ihrer Daten im Konto eingeben.</span>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bei der Registrierung verarbeiten wir folgende Arten von Daten: </span>
                  </p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple} style={{ fontWeight: "400" }}>
                      <span className={styles.adsimple} style={{ fontWeight: "400" }}>Vorname</span>
                    </li>
                    <li className={styles.adsimple}>Nachname</li>
                    <li className={styles.adsimple} style={{ fontWeight: "400" }}>
                      <span className={styles.adsimple} style={{ fontWeight: "400" }}>E-Mail-Adresse</span>
                    </li>
                  </ul>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bei der Anmeldung verarbeiten wir die Daten, die Sie bei der Anmeldung eingeben wie zum Beispiel Benutzername und Passwort und im Hintergrund erfasste Daten wie Geräteinformationen und IP-Adressen.</span>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bei der Kontonutzung verarbeiten wir Daten, die Sie während der Kontonutzung eingeben und welche im Rahmen der Nutzung unserer Dienstleistungen erstellt werden.</span>
                  </p>
                  <h3 className={styles.adsimple}>Speicherdauer</h3>
                  <p>Wir speichern die eingegebenen Daten zumindest für die Zeit, solange das mit den Daten verknüpfte Konto bei uns besteht und verwendet wird, solange vertragliche Verpflichtungen zwischen uns bestehen und, wenn der Vertrag endet, bis die jeweiligen Ansprüche daraus verjährt sind. Darüber hinaus speichern wir Ihre Daten solange und soweit wir gesetzlichen Verpflichtungen zur Speicherung unterliegen. Danach bewahren wir zum Vertrag gehörige Buchungsbelege (Rechnungen, Vertragsurkunden, Kontoauszüge u.a.) sowie sonstige relevante Geschäftsunterlagen für die gesetzlich vorgeschriebene Dauer (i.d.R. einige Jahre) auf.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Sie haben sich registriert, Daten eingegeben und möchten die Verarbeitung widerrufen? Kein Problem. Wie Sie oben lesen können, bestehen die Rechte laut Datenschutz-Grundverordnung auch bei und nach der Registrierung, Anmeldung oder dem Konto bei uns. Kontaktieren Sie den weiter oben stehenden Verantwortlichen für Datenschutz, um Ihre Rechte wahrzunehmen. Sollten Sie bereits ein Konto bei uns haben, können Sie Ihre Daten und Texte ganz einfach im Konto einsehen bzw. verwalten.</span>
                  </p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Mit Durchführung des Registrierungsvorgangs treten Sie vorvertraglich an uns heran, um einen Nutzungsvertrag über unsere Plattform zu schließen (wenn auch nicht automatisch eine Zahlungspflicht entsteht). S</span>ie investieren Zeit, um Daten einzugeben und sich zu registrieren und wir bieten Ihnen unsere Dienstleistungen nach Anmeldung in unserem System und die Einsicht in Ihr Kundenkonto. Außerdem kommen wir unseren vertraglichen Verpflichtungen nach. Schließlich müssen wir registrierte Nutzer bei wichtigen Änderungen per E-Mail am Laufenden halten. Damit trifft Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen, Erfüllung eines Vertrags) zu.</p>
                  <p>Gegebenenfalls holen darüber hinaus auch Ihre Einwilligung ein, z.B. wenn Sie freiwillig mehr als die unbedingt notwendigen Daten angeben oder wir Ihnen Werbung senden dürfen. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) trifft somit zu.</p>
                  <p>Wir haben außerdem ein berechtigtes Interesse, zu wissen, mit wem wir es zu tun haben, um in bestimmten Fällen in Kontakt zu treten. Außerdem müssen wir wissen wer unsere Dienstleistungen in Anspruch nimmt und ob sie so verwendet werden, wie es unsere Nutzungsbedingungen vorgeben, es trifft also Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen) zu.</p>
                  <p>
                    <strong className={styles.adsimple}>Registrierung mit Pseudonymen</strong>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Bei der Registrierung können Pseudonyme verwendet werden, das heißt Sie müssen sich bei uns nicht mit Ihrem richtigen Namen registrieren. Damit ist sichergestellt, dass Ihr Name nicht von uns verarbeitet werden kann. </span>
                  </p>
                  {/* <p>
                    <strong className={styles.adsimple}>Speicherung der IP-Adresse</strong>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Im Zuge der Registrierung, Anmeldung und Kontonutzung speichern wir aus Sicherheitsgründen die IP-Adresse im Hintergrund, um die rechtmäßige Nutzung feststellen zu können.</span>
                  </p> */}
                  <p>
                    <strong className={styles.adsimple}>Öffentliche Profil</strong>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Die Nutzerprofile sind öffentlich sichtbar, d.h. man kann Teile des Profils auch ohne Angabe von Benutzername und Passwort im Internet sehen.</span>
                  </p>
                  {/* <p>
                    <strong className={styles.adsimple}>2-Faktor-Authentifizierung (2FA)</strong>
                  </p>
                  <p>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Eine Zwei-Faktor-Authentifizierung (2FA) bietet zusätzlich Sicherheit bei der Anmeldung, da sie verhindert, dass man sich z.B. ohne Smartphone anmeldet. Diese technische Maßnahme zur Absicherung Ihres Kontos schützt Sie also vor dem Verlust von Daten oder unzulässigen Zugriffen auch wenn Benutzername und Passwort bekannt wären. </span>
                    <span className={styles.adsimple} style={{ fontWeight: "400" }}>Welches 2FA zum Einsatz kommt, erfahren Sie bei der Registrierung, Anmeldung und im Konto selbst.</span>
                  </p> */}
                  <h2 id="webhosting-einleitung" className={styles.adsimple}>Webhosting Einleitung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Webhosting Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: professionelles Hosting der Website und Absicherung des Betriebs<br />
                          &#x1f4d3; Verarbeitete Daten: IP-Adresse, Zeitpunkt des Websitebesuchs, verwendeter Browser und weitere Daten. Mehr Details dazu finden Sie weiter unten bzw. beim jeweils eingesetzten Webhosting Provider.<br />
                          &#x1f4c5; Speicherdauer: abhängig vom jeweiligen Provider, aber in der Regel 2 Wochen<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit.f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was ist Webhosting?</h3>
                  <p>Wenn Sie heutzutage Websites besuchen, werden gewisse Informationen &#8211; auch personenbezogene Daten &#8211; automatisch erstellt und gespeichert, so auch auf dieser Website. Diese Daten sollten möglichst sparsam und nur mit Begründung verarbeitet werden. Mit Website meinen wir übrigens die Gesamtheit aller Webseiten auf einer Domain, d.h. alles von der Startseite (Homepage) bis hin zur aller letzten Unterseite (wie dieser hier). Mit Domain meinen wir zum Beispiel beispiel.de oder musterbeispiel.com.</p>
                  <p>Wenn Sie eine Website auf einem Computer, Tablet oder Smartphone ansehen möchten, verwenden Sie dafür ein Programm, das sich Webbrowser nennt. Sie kennen vermutlich einige Webbrowser beim Namen: Google Chrome, Microsoft Edge, Mozilla Firefox und Apple Safari. Wir sagen kurz Browser oder Webbrowser dazu.</p>
                  <p>Um die Website anzuzeigen, muss sich der Browser zu einem anderen Computer verbinden, wo der Code der Website gespeichert ist: dem Webserver. Der Betrieb eines Webservers ist eine komplizierte und aufwendige Aufgabe, weswegen dies in der Regel von professionellen Anbietern, den Providern, übernommen wird. Diese bieten Webhosting an und sorgen damit für eine verlässliche und fehlerfreie Speicherung der Daten von Websites. Eine ganze Menge Fachbegriffe, aber bitte bleiben Sie dran, es wird noch besser!</p>
                  <p>Bei der Verbindungsaufnahme des Browsers auf Ihrem Computer (Desktop, Laptop, Tablet oder Smartphone) und während der Datenübertragung zu und vom Webserver kann es zu einer Verarbeitung personenbezogener Daten kommen. Einerseits speichert Ihr Computer Daten, andererseits muss auch der Webserver Daten eine Zeit lang speichern, um einen ordentlichen Betrieb zu gewährleisten.</p>
                  <p>Ein Bild sagt mehr als tausend Worte, daher zeigt folgende Grafik zur Veranschaulichung das Zusammenspiel zwischen Browser, dem Internet und dem Hosting-Provider.</p>
                  <p>
                    <img role="img" src="https://www.adsimple.at/wp-content/uploads/2018/03/browser-und-webserver.svg" alt="Browser und Webserver" width="100%" className={styles.adsimpleImage} />
                  </p>
                  <h3 className={styles.adsimple}>Warum verarbeiten wir personenbezogene Daten?</h3>
                  <p>Die Zwecke der Datenverarbeitung sind:</p>
                  <ol>
                    <li className={styles.adsimple}>Professionelles Hosting der Website und Absicherung des Betriebs</li>
                    <li className={styles.adsimple}>zur Aufrechterhaltung der Betriebs- und IT-Sicherheit</li>
                    <li className={styles.adsimple}>Anonyme Auswertung des Zugriffsverhaltens zur Verbesserung unseres Angebots und ggf. zur Strafverfolgung bzw. Verfolgung von Ansprüchen</li>
                  </ol>
                  <h3 className={styles.adsimple}>Welche Daten werden verarbeitet?</h3>
                  <p>Auch während Sie unsere Website jetzt gerade besuchen, speichert unser Webserver, das ist der Computer auf dem diese Webseite gespeichert ist, in der Regel automatisch Daten wie</p>
                  <ul className={styles.adsimple}>
                    <li className={styles.adsimple}>die komplette Internetadresse (URL) der aufgerufenen Webseite</li>
                    <li className={styles.adsimple}>Browser und Browserversion (z. B. Chrome 87)</li>
                    <li className={styles.adsimple}>das verwendete Betriebssystem (z. B. Windows 10)</li>
                    <li className={styles.adsimple}>die Adresse (URL) der zuvor besuchten Seite (Referrer URL) (z. B. <a className={styles.adsimple} href="https://www.beispielquellsite.de/vondabinichgekommen/" target="_blank" rel="follow noreferrer">https://www.beispielquellsite.de/vondabinichgekommen/</a>)</li>
                    <li className={styles.adsimple}>den Hostnamen und die IP-Adresse des Geräts von welchem aus zugegriffen wird (z. B. COMPUTERNAME und 194.23.43.121)</li>
                    <li className={styles.adsimple}>Datum und Uhrzeit</li>
                    <li className={styles.adsimple}>in Dateien, den sogenannten Webserver-Logfiles</li>
                  </ul>
                  <h3 className={styles.adsimple}>Wie lange werden Daten gespeichert?</h3>
                  <p>In der Regel werden die oben genannten Daten zwei Wochen gespeichert und danach automatisch gelöscht. Wir geben diese Daten nicht weiter, können jedoch nicht ausschließen, dass diese Daten beim Vorliegen von rechtswidrigem Verhalten von Behörden eingesehen werden.</p>
                  <p>
                    <strong className={styles.adsimple}>Kurz gesagt:</strong> Ihr Besuch wird durch unseren Provider (Firma, die unsere Website auf speziellen Computern (Servern) laufen lässt), protokolliert, aber wir geben Ihre Daten nicht ohne Zustimmung weiter!</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Die Rechtmäßigkeit der Verarbeitung personenbezogener Daten im Rahmen des Webhosting ergibt sich aus Art. 6 Abs. 1 lit. f DSGVO (Wahrung der berechtigten Interessen), denn die Nutzung von professionellem Hosting bei einem Provider ist notwendig, um das Unternehmen im Internet sicher und nutzerfreundlich präsentieren und Angriffe und Forderungen hieraus gegebenenfalls verfolgen zu können.</p>
                  <p>Zwischen uns und dem Hosting-Provider besteht in der Regel ein Vertrag über die Auftragsverarbeitung gemäß Art. 28 f. DSGVO, der die Einhaltung von Datenschutz gewährleistet und Datensicherheit garantiert.</p>
                  <h2 id="messenger-kommunikation-einleitung" className={styles.adsimple}>Messenger &amp; Kommunikation Einleitung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Messenger &amp; Kommunikation Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Kontaktanfragen und die allgemeine Kommunikation zwischen uns und Ihnen<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Name, Adresse, E-Mailadresse, Telefonnummer, allgemeine Inhaltsdaten, gegebenenfalls IP-Adresse<br />
                          Mehr Details dazu finden Sie bei den jeweils eingesetzten Tools.<br />
                          &#x1f4c5; Speicherdauer: abhängig von den verwendeten Messenger- &amp; Kommunikationsfunktionen<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen), Art. 6 Abs. 1 S. 1 lit. b. DSGVO (vertragliche oder vorvertragliche Verpflichtungen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was sind Messenger- &amp; Kommunikationsfunktionen?</h3>
                  <p>Wir bieten auf unserer Website verschiedene Möglichkeiten (etwa Messenger- und Chatfunktionen, Online- bzw. Kontaktformulare, E-Mail, Telefon), um mit uns zu kommunizieren. Dabei werden auch Ihre Daten, soweit es für die Beantwortung Ihrer Anfrage und unseren darauffolgenden Maßnahmen nötig ist, verarbeitet und gespeichert.</p>
                  <p>Wir nutzen neben klassischen Kommunikationsmitteln wie E-Mail, Kontaktformularen oder Telefon auch Chats bzw. Messenger. Die derzeit am häufigsten verwendete Messenger-Funktion ist WhatsApp, aber es gibt natürlich speziell für Websites viele verschiedene Anbieter, die Messenger-Funktionen anbieten. Wenn Inhalte Ende zu Ende verschlüsselt sind, wird darauf in den einzelnen Datenschutztexten oder in der Datenschutzerklärung des jeweiligen Anbieters hingewiesen. Eine Ende-zu-Ende-Verschlüsselung bedeutet nichts anders, als dass Inhalte einer Nachricht selbst für den Anbieter nicht sichtbar sind. Allerdings können trotzdem Informationen zu Ihrem Gerät, Standorteinstellungen und andere technische Daten verarbeitet und gespeichert werden.</p>
                  <h3 className={styles.adsimple}>Warum nutzen wir Messenger- &amp; Kommunikationsfunktionen?</h3>
                  <p>Kommunikationsmöglichkeiten mit Ihnen sind für uns von großer Bedeutung. Schließlich wollen wir mit Ihnen sprechen und alle möglichen Fragen zu unserem Service bestmöglich beantworten. Eine gut funktionierende Kommunikation ist bei uns ein wichtiger Teil unserer Dienstleistung. Mit den praktischen Messenger- &amp; Kommunikationsfunktionen können Sie jederzeit jene wählen, die Ihnen am liebsten sind. In Ausnahmefällen kann es aber auch vorkommen, dass wir bestimmte Fragen über Chat bzw. Messenger nicht beantworten. Das ist der Fall, wenn es etwa um interne vertragliche Angelegenheiten geht. Hier empfehlen wir andere Kommunikationsmöglichkeiten wie E-Mail oder Telefon.</p>
                  <p>Wir gehen in der Regel davon aus, dass wir datenschutzrechtlich verantwortlich bleiben, auch wenn wir Dienste einer Social-Media-Plattform nutzen. Der Europäische Gerichtshof hat jedoch entschieden, dass in bestimmten Fällen der Betreiber der Social-Media-Plattform zusammen mit uns gemeinsam verantwortlich im Sinne des Art. 26 DSGVO sein kann. Soweit dies der Fall ist, weisen wir gesondert darauf hin und arbeiten auf Grundlage einer diesbezüglichen Vereinbarung. Das Wesentliche der Vereinbarung ist weiter unten bei der betroffenen Plattform wiedergegeben.</p>
                  <p>Bitte beachten Sie, dass bei der Nutzung unserer eingebauten Elemente auch Daten von Ihnen außerhalb der Europäischen Union verarbeitet werden können, da viele Anbieter, beispielsweise Facebook-Messenger oder WhatsApp amerikanische Unternehmen sind. Dadurch können Sie möglicherweise Ihre Rechte in Bezug auf Ihre personenbezogenen Daten nicht mehr so leicht einfordern bzw. durchsetzen.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden verarbeitet?</h3>
                  <p>Welche Daten genau gespeichert und verarbeitet werden, hängt vom jeweiligen Anbieter der Messenger- &amp; Kommunikationsfunktionen ab. Grundsätzlich handelt es sich um Daten wie etwa Name, Adresse, Telefonnummer, E-Mailadresse und Inhaltsdaten wie beispielsweise alle Informationen, die Sie in ein Kontaktformular eingeben. Meistens werden auch Informationen zu Ihrem Gerät und die IP-Adresse gespeichert. Daten, die über eine Messenger- &amp; Kommunikationsfunktion erhoben werden, werden auch auf den Servern der Anbieter gespeichert.</p>
                  <p>Wenn Sie genau wissen wollen, welche Daten bei den jeweiligen Anbietern gespeichert und verarbeitet werden und wie Sie der Datenverarbeitung widersprechen können, sollten Sie die jeweilige Datenschutzerklärung des Unternehmens sorgfältig durchlesen.</p>
                  <h3 className={styles.adsimple}>Wie lange werden Daten gespeichert?</h3>
                  <p>Wie lange die Daten verarbeitet und gespeichert werden, hängt in erster Linie von unseren verwendeten Tools ab. Weiter unten erfahren Sie mehr über die Datenverarbeitung der einzelnen Tools. In den Datenschutzerklärungen der Anbieter steht üblicherweise genau, welche Daten wie lange gespeichert und verarbeitet werden. Grundsätzlich werden personenbezogene Daten nur so lange verarbeitet, wie es für die Bereitstellung unserer Dienste nötig ist. Wenn Daten in Cookies gespeichert werden, variiert die Speicherdauer stark. Die Daten können gleich nach dem Verlassen einer Website wieder gelöscht werden, sie können aber auch über mehrere Jahre gespeichert bleiben. Daher sollten Sie sich jedes einzelnen Cookie im Detail ansehen, wenn Sie über die Datenspeicherung Genaueres wissen wollen. Meistens finden Sie in den Datenschutzerklärungen der einzelnen Anbieter auch aufschlussreiche Informationen über die einzelnen Cookies.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies bzw. Drittanbietern zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum Bespiel können Sie auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen. Für weitere Informationen verweisen wir auf den Abschnitt zur Einwilligung.</p>
                  <p>Da bei Messenger- &amp; Kommunikationsfunktionen Cookies zum Einsatz kommen können, empfehlen wir Ihnen auch unsere allgemeine Datenschutzerklärung über Cookies. Um zu erfahren, welche Daten von Ihnen genau gespeichert und verarbeitet werden, sollten Sie die Datenschutzerklärungen der jeweiligen Tools durchlesen.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Daten von Ihnen durch eingebundene Messenger- &amp; Kommunikationsfunktionen verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. a DSGVO)</strong>. Wir bearbeiten Ihre Anfrage und verwalten Ihre Daten im Rahmen vertraglicher oder vorvertraglicher Beziehungen, um unsere vorvertraglichen und vertraglichen Pflichten zu erfüllen bzw. Anfragen zu beantworten. Grundlage dafür ist <strong className={styles.adsimple}>Art. 6 Abs. 1 S. 1 lit. b. DSGVO</strong>. Grundsätzlich werden Ihre Daten bei Vorliegen einer Einwilligung auch auf Grundlage unseres berechtigten Interesses <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. f DSGVO)</strong> an einer schnellen und guten Kommunikation mit Ihnen oder anderen Kunden und Geschäftspartnern gespeichert und verarbeitet.</p>
                  <h2 id="social-media-einleitung" className={styles.adsimple}>Social Media Einleitung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Social Media Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Darstellung und Optimierung unserer Serviceleistung, Kontakt zu Besuchern, Interessenten u.a., Werbung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Telefonnummern, E-Mail-Adressen, Kontaktdaten, Daten zum Nutzerverhalten, Informationen zu Ihrem Gerät und Ihre IP-Adresse.<br />
                          Mehr Details dazu finden Sie beim jeweils eingesetzten Social-Media-Tool.<br />
                          &#x1f4c5; Speicherdauer: abhängig von den verwendeten Social-Media-Plattformen<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was ist Social Media?</h3>
                  <p>Zusätzlich zu unserer Website sind wir auch in diversen Social-Media-Plattformen aktiv. Dabei können Daten von Usern verarbeitet werden, damit wir gezielt User, die sich für uns interessieren, über die sozialen Netzwerke ansprechen können. Darüber hinaus können auch Elemente einer Social-Media-Plattform direkt in unsere Website eingebettet sein. Das ist etwa der Fall, wenn Sie einen sogenannten Social-Button auf unserer Website anklicken und direkt zu unserem Social-Media-Auftritt weitergeleitet werden. Als sogenannte Sozialen Medien oder Social Media werden Websites und Apps bezeichnet, über die angemeldete Mitglieder Inhalte produzieren, Inhalte offen oder in bestimmten Gruppen austauschen und sich mit anderen Mitgliedern vernetzen können.</p>
                  <h3 className={styles.adsimple}>Warum nutzen wir Social Media?</h3>
                  <p>Seit Jahren sind Social-Media-Plattformen der Ort, wo Menschen online kommunizieren und in Kontakt treten. Mit unseren Social-Media-Auftritten können wir unsere Produkte und Dienstleistungen Interessenten näherbringen. Die auf unserer Website eingebundenen Social-Media-Elemente helfen Ihnen, schnell und ohne Komplikationen zu unseren Social-Media-Inhalten wechseln können.</p>
                  <p>Die Daten, die durch Ihre Nutzung eines Social-Media-Kanals gespeichert und verarbeitet werden, haben in erster Linie den Zweck, Webanalysen durchführen zu können. Ziel dieser Analysen ist es, genauere und personenbezogene Marketing- und Werbestrategien entwickeln zu können. Abhängig von Ihrem Verhalten auf einer Social-Media-Plattform, können mit Hilfe der ausgewerteten Daten, passende Rückschlüsse auf Ihre Interessen getroffen werden und sogenannte Userprofile erstellt werden. So ist es den Plattformen auch möglich, Ihnen maßgeschneiderte Werbeanzeigen zu präsentieren. Meistens werden für diesen Zweck Cookies in Ihrem Browser gesetzt, die Daten zu Ihrem Nutzungsverhalten speichern.</p>
                  <p>Wir gehen in der Regel davon aus, dass wir datenschutzrechtlich verantwortlich bleiben, auch wenn wir Dienste einer Social-Media-Plattform nutzen. Der Europäische Gerichtshof hat jedoch entschieden, dass in bestimmten Fällen der Betreiber der Social-Media-Plattform zusammen mit uns gemeinsam verantwortlich im Sinne des Art. 26 DSGVO sein kann. Soweit dies der Fall ist, weisen wir gesondert darauf hin und arbeiten auf Grundlage einer diesbezüglichen Vereinbarung. Das Wesentliche der Vereinbarung ist dann weiter unten bei der betroffenen Plattform wiedergegeben.</p>
                  <p>Bitte beachten Sie, dass bei der Nutzung der Social-Media-Plattformen oder unserer eingebauten Elemente auch Daten von Ihnen außerhalb der Europäischen Union verarbeitet werden können, da viele Social-Media-Kanäle, beispielsweise Facebook oder Twitter, amerikanische Unternehmen sind. Dadurch können Sie möglicherweise Ihre Rechte in Bezug auf Ihre personenbezogenen Daten nicht mehr so leicht einfordern bzw. durchsetzen.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden verarbeitet?</h3>
                  <p>Welche Daten genau gespeichert und verarbeitet werden, hängt vom jeweiligen Anbieter der Social-Media-Plattform ab. Aber für gewöhnlich handelt es sich um Daten wie etwa Telefonnummern, E-Mailadressen, Daten, die Sie in ein Kontaktformular eingeben, Nutzerdaten wie zum Beispiel welche Buttons Sie klicken, wen Sie liken oder wem folgen, wann Sie welche Seiten besucht haben, Informationen zu Ihrem Gerät und Ihre IP-Adresse. Die meisten dieser Daten werden in Cookies gespeichert. Speziell wenn Sie selbst ein Profil bei dem besuchten Social-Media-Kanal haben und angemeldet sind, können Daten mit Ihrem Profil verknüpft werden.</p>
                  <p>Alle Daten, die über eine Social-Media-Plattform erhoben werden, werden auch auf den Servern der Anbieter gespeichert. Somit haben auch nur die Anbieter Zugang zu den Daten und können Ihnen die passenden Auskünfte geben bzw. Änderungen vornehmen.</p>
                  <p>Wenn Sie genau wissen wollen, welche Daten bei den Social-Media-Anbietern gespeichert und verarbeitet werden und wie sie der Datenverarbeitung widersprechen können, sollten Sie die jeweilige Datenschutzerklärung des Unternehmens sorgfältig durchlesen. Auch wenn Sie zur Datenspeicherung und Datenverarbeitung Fragen haben oder entsprechende Rechte geltend machen wollen, empfehlen wir Ihnen, sich direkt an den Anbieter wenden.</p>
                  <h3 className={styles.adsimple}>
                    <span className={styles.adsimple} data-sheets-value="{&quot;1&quot;:2,&quot;2&quot;:&quot;Wo und wie lange werden Daten gespeichert?&quot;}" data-sheets-userformat="{&quot;2&quot;:769,&quot;3&quot;:{&quot;1&quot;:0},&quot;11&quot;:4,&quot;12&quot;:0}">Dauer der Datenverarbeitung</span>
                  </h3>
                  <p>Über die Dauer der Datenverarbeitung informieren wir Sie weiter unten, sofern wir weitere Informationen dazu haben. Beispielsweise speichert die Social-Media-Plattform Facebook Daten, bis sie für den eigenen Zweck nicht mehr benötigt werden. Kundendaten, die mit den eigenen Userdaten abgeglichen werden, werden aber schon innerhalb von zwei Tagen gelöscht. Generell verarbeiten wir personenbezogene Daten nur so lange wie es für die Bereitstellung unserer Dienstleistungen und Produkte unbedingt notwendig ist. Wenn es, wie zum Beispiel im Fall von Buchhaltung, gesetzlich vorgeschrieben ist, kann diese Speicherdauer auch überschritten werden.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies bzw. Drittanbietern wie eingebettete Social-Media-Elemente zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum Bespiel können Sie auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen.</p>
                  <p>Da bei Social-Media-Tools Cookies zum Einsatz kommen können, empfehlen wir Ihnen auch unsere allgemeine Datenschutzerklärung über Cookies. Um zu erfahren, welche Daten von Ihnen genau gespeichert und verarbeitet werden, sollten Sie die Datenschutzerklärungen der jeweiligen Tools durchlesen.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Daten von Ihnen durch eingebundene Social-Media-Elemente verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. a DSGVO)</strong>. Grundsätzlich werden Ihre Daten bei Vorliegen einer Einwilligung auch auf Grundlage unseres berechtigten Interesses <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. f DSGVO)</strong> an einer schnellen und guten Kommunikation mit Ihnen oder anderen Kunden und Geschäftspartnern gespeichert und verarbeitet. Wir setzen die Tools gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben. Die meisten Social-Media-Plattformen setzen auch Cookies in Ihrem Browser, um Daten zu speichern. Darum empfehlen wir Ihnen, unseren Datenschutztext über Cookies genau durchzulesen und die Datenschutzerklärung oder die Cookie-Richtlinien des jeweiligen Dienstanbieters anzusehen.</p>
                  <p>Informationen zu speziellen Social-Media-Plattformen erfahren Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>
                  <h2 id="instagram-datenschutzerklaerung" className={styles.adsimple}>Instagram Datenschutzerklärung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Instagram Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Optimierung unserer Serviceleistung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Daten zum Nutzerverhalten, Informationen zu Ihrem Gerät und Ihre IP-Adresse.<br />
                          Mehr Details dazu finden Sie weiter unten in der Datenschutzerklärung.<br />
                          &#x1f4c5; Speicherdauer: bis Instagram die Daten für ihre Zwecke nicht mehr benötigt<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was ist Instagram?</h3>
                  <p>Wir haben auf unserer Webseite Funktionen von Instagram eingebaut. Instagram ist eine Social Media Plattform des Unternehmens Instagram LLC, 1601 Willow Rd, Menlo Park CA 94025, USA. Instagram ist seit 2012 ein Tochterunternehmen von Meta Platforms Inc. und gehört zu den Facebook-Produkten. Das Einbetten von Instagram-Inhalten auf unserer Webseite nennt man Embedding. Dadurch können wir Ihnen Inhalte wie Buttons, Fotos oder Videos von Instagram direkt auf unserer Webseite zeigen. Wenn Sie Webseiten unserer Webpräsenz aufrufen, die eine Instagram-Funktion integriert haben, werden Daten an Instagram übermittelt, gespeichert und verarbeitet. Instagram verwendet dieselben Systeme und Technologien wie Facebook. Ihre Daten werden somit über alle Facebook-Firmen hinweg verarbeitet.</p>
                  <p>Im Folgenden wollen wir Ihnen einen genaueren Einblick geben, warum Instagram Daten sammelt, um welche Daten es sich handelt und wie Sie die Datenverarbeitung weitgehend kontrollieren können. Da Instagram zu Meta Platforms Inc. gehört, beziehen wir unsere Informationen einerseits von den Instagram-Richtlinien, andererseits allerdings auch von den Meta-Datenschutzrichtlinien selbst.</p>
                  <p>Instagram ist eines der bekanntesten Social Media Netzwerken weltweit. Instagram kombiniert die Vorteile eines Blogs mit den Vorteilen von audiovisuellen Plattformen wie YouTube oder Vimeo. Sie können auf „Insta“ (wie viele der User die Plattform salopp nennen) Fotos und kurze Videos hochladen, mit verschiedenen Filtern bearbeiten und auch in anderen sozialen Netzwerken verbreiten. Und wenn Sie selbst nicht aktiv sein wollen, können Sie auch nur anderen interessante Users folgen.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir Instagram auf unserer Website?</h3>
                  <p>Instagram ist jene Social Media Plattform, die in den letzten Jahren so richtig durch die Decke ging. Und natürlich haben auch wir auf diesen Boom reagiert. Wir wollen, dass Sie sich auf unserer Webseite so wohl wie möglich fühlen. Darum ist für uns eine abwechslungsreiche Aufbereitung unserer Inhalte selbstverständlich. Durch die eingebetteten Instagram-Funktionen können wir unseren Content mit hilfreichen, lustigen oder spannenden Inhalten aus der Instagram-Welt bereichern. Da Instagram eine Tochtergesellschaft von Facebook ist, können uns die erhobenen Daten auch für personalisierte Werbung auf Facebook dienlich sein. So bekommen unsere Werbeanzeigen nur Menschen, die sich wirklich für unsere Produkte oder Dienstleistungen interessieren.</p>
                  <p>Instagram nützt die gesammelten Daten auch zu Messungs- und Analysezwecken. Wir bekommen zusammengefasste Statistiken und so mehr Einblick über Ihre Wünsche und Interessen. Wichtig ist zu erwähnen, dass diese Berichte Sie nicht persönlich identifizieren.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden von Instagram gespeichert?</h3>
                  <p>Wenn Sie auf eine unserer Seiten stoßen, die Instagram-Funktionen (wie Instagrambilder oder Plug-ins) eingebaut haben, setzt sich Ihr Browser automatisch mit den Servern von Instagram in Verbindung. Dabei werden Daten an Instagram versandt, gespeichert und verarbeitet. Und zwar unabhängig, ob Sie ein Instagram-Konto haben oder nicht. Dazu zählen Informationen über unserer Webseite, über Ihren Computer, über getätigte Käufe, über Werbeanzeigen, die Sie sehen und wie Sie unser Angebot nutzen. Weiters werden auch Datum und Uhrzeit Ihrer Interaktion mit Instagram gespeichert. Wenn Sie ein Instagram-Konto haben bzw. eingeloggt sind, speichert Instagram deutlich mehr Daten über Sie.</p>
                  <p>Facebook unterscheidet zwischen Kundendaten und Eventdaten. Wir gehen davon aus, dass dies bei Instagram genau so der Fall ist. Kundendaten sind zum Beispiel Name, Adresse, Telefonnummer und IP-Adresse. Diese Kundendaten werden erst an Instagram übermittelt werden, wenn Sie zuvor „gehasht“ wurden. Hashing meint, ein Datensatz wird in eine Zeichenkette verwandelt. Dadurch kann man die Kontaktdaten verschlüsseln. Zudem werden auch die oben genannten „Event-Daten“ übermittelt. Unter „Event-Daten“ versteht Facebook – und folglich auch Instagram – Daten über Ihr Userverhalten. Es kann auch vorkommen, dass Kontaktdaten mit Event-Daten kombiniert werden. Die erhobenen Kontaktdaten werden mit den Daten, die Instagram bereits von Ihnen hat, abgeglichen.</p>
                  <p>Über kleine Text-Dateien (Cookies), die meist in Ihrem Browser gesetzt werden, werden die gesammelten Daten an Facebook übermittelt. Je nach verwendeten Instagram-Funktionen und ob Sie selbst ein Instagram-Konto haben, werden unterschiedlich viele Daten gespeichert.</p>
                  <p>Wir gehen davon aus, dass bei Instagram die Datenverarbeitung gleich funktioniert wie bei Facebook. Das bedeutet: wenn Sie ein Instagram-Konto haben oder <a className={styles.adsimple} href="https://www.instagram.com/?tid=312394688" target="_blank" rel="noreferrer noreferrer">www.instagram.com</a> besucht haben, hat Instagram zumindest ein Cookie gesetzt. Wenn das der Fall ist, sendet Ihr Browser über das Cookie Infos an Instagram, sobald Sie mit einer Instagram-Funktion in Berührung kommen. Spätestens nach 90 Tagen (nach Abgleichung) werden diese Daten wieder gelöscht bzw. anonymisiert. Obwohl wir uns intensiv mit der Datenverarbeitung von Instagram beschäftigt haben, können wir nicht ganz genau sagen, welche Daten Instagram exakt sammelt und speichert.</p>
                  <p>Im Folgenden zeigen wir Ihnen Cookies, die in Ihrem Browser mindestens gesetzt werden, wenn Sie auf eine Instagram-Funktion (wie z.B. Button oder ein Insta-Bild) klicken. Bei unserem Test gehen wir davon aus, dass Sie kein Instagram-Konto haben. Wenn Sie bei Instagram eingeloggt sind, werden natürlich deutlich mehr Cookies in Ihrem Browser gesetzt.</p>
                  <p>Diese Cookies wurden bei unserem Test verwendet:</p>
                  <p>
                    <strong className={styles.adsimple}>Name: </strong>csrftoken<br />
                    <strong className={styles.adsimple}>Wert: </strong>&#8220;&#8221;<br />
                    <strong className={styles.adsimple}>Verwendungszweck: </strong>Dieses Cookie wird mit hoher Wahrscheinlichkeit aus Sicherheitsgründen gesetzt, um Fälschungen von Anfragen zu verhindern. Genauer konnten wir das allerdings nicht in Erfahrung bringen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach einem Jahr</p>
                  <p>
                    <strong className={styles.adsimple}>Name: </strong>mid<br />
                    <strong className={styles.adsimple}>Wert: </strong>&#8220;&#8221;<br />
                    <strong className={styles.adsimple}>Verwendungszweck: </strong>Instagram setzt dieses Cookie, um die eigenen Dienstleistungen und Angebote in und außerhalb von Instagram zu optimieren. Das Cookie legt eine eindeutige User-ID fest.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Ende der Sitzung</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> fbsr_312394688124024<br />
                    <strong className={styles.adsimple}>Wert: </strong>keine Angaben<br />
                    <strong className={styles.adsimple}>Verwendungszweck: </strong>Dieses Cookie speichert die Log-in-Anfrage für User der Instagram-App.<strong className={styles.adsimple}>
                      <br />
                    </strong>
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Ende der Sitzung</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> rur<br />
                    <strong className={styles.adsimple}>Wert: </strong>ATN<br />
                    <strong className={styles.adsimple}>Verwendungszweck: </strong>Dabei handelt es sich um ein Instagram-Cookie, das die Funktionalität auf Instagram gewährleistet.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Ende der Sitzung</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> urlgen<br />
                    <strong className={styles.adsimple}>Wert: </strong>&#8220;{"{"}&#8221;194.96.75.33&#8221;: 1901{"}"}:1iEtYv:Y833k2_UjKvXgYe312394688&#8221;<br />
                    <strong className={styles.adsimple}>Verwendungszweck: </strong>Dieses Cookie dient den Marketingzwecken von Instagram.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Ende der Sitzung</p>
                  <p>
                    <strong className={styles.adsimple}>Anmerkung:</strong> Wir können hier keinen Vollständigkeitsanspruch erheben. Welche Cookies im individuellen Fall gesetzt werden, hängt von den eingebetteten Funktionen und Ihrer Verwendung von Instagram ab.</p>
                  <h3 className={styles.adsimple}>Wie lange und wo werden die Daten gespeichert?</h3>
                  <p>Instagram teilt die erhaltenen Informationen zwischen den Facebook-Unternehmen mit externen Partnern und mit Personen, mit denen Sie sich weltweit verbinden. Die Datenverarbeitung erfolgt unter Einhaltung der eigenen Datenrichtlinie. Ihre Daten sind, unter anderem aus Sicherheitsgründen, auf den Facebook-Servern auf der ganzen Welt verteilt. Die meisten dieser Server stehen in den USA.</p>
                  <h3 className={styles.adsimple}>Wie kann ich meine Daten löschen bzw. die Datenspeicherung verhindern?</h3>
                  <p>Dank der Datenschutz Grundverordnung haben Sie das Recht auf Auskunft, Übertragbarkeit, Berichtigung und Löschung Ihrer Daten. In den Instagram-Einstellungen können Sie Ihre Daten verwalten. Wenn Sie Ihre Daten auf Instagram völlig löschen wollen, müssen Sie Ihr Instagram-Konto dauerhaft löschen.</p>
                  <p>Und so funktioniert die Löschung des Instagram-Kontos:</p>
                  <p>Öffnen Sie zuerst die Instagram-App. Auf Ihrer Profilseite gehen Sie nach unten und klicken Sie auf „Hilfebereich“. Jetzt kommen Sie auf die Webseite des Unternehmens. Klicken Sie auf der Webseite auf „Verwalten des Kontos“ und dann auf „Dein Konto löschen“.</p>
                  <p>Wenn Sie Ihr Konto ganz löschen, löscht Instagram Posts wie beispielsweise Ihre Fotos und Status-Updates. Informationen, die andere Personen über Sie geteilt haben, gehören nicht zu Ihrem Konto und werden folglich nicht gelöscht.</p>
                  <p>Wie bereits oben erwähnt, speichert Instagram Ihre Daten in erster Linie über Cookies. Diese Cookies können Sie in Ihrem Browser verwalten, deaktivieren oder löschen. Abhängig von Ihrem Browser funktioniert die Verwaltung immer ein bisschen anders. Unter dem Abschnitt „Cookies“ finden Sie die entsprechenden Links zu den jeweiligen Anleitungen der bekanntesten Browser.</p>
                  <p>Sie können auch grundsätzlich Ihren Browser so einrichten, dass Sie immer informiert werden, wenn ein Cookie gesetzt werden soll. Dann können Sie immer individuell entscheiden, ob Sie das Cookie zulassen wollen oder nicht.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Daten von Ihnen durch eingebundene Social-Media-Elemente verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. a DSGVO)</strong>. Grundsätzlich werden Ihre Daten auch auf Grundlage unseres berechtigten Interesses <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. f DSGVO)</strong> an einer schnellen und guten Kommunikation mit Ihnen oder anderen Kunden und Geschäftspartnern gespeichert und verarbeitet. Wir setzen die eingebundene Social-Media-Elemente gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben. Die meisten Social-Media-Plattformen setzen auch Cookies in Ihrem Browser, um Daten zu speichern. Darum empfehlen wir Ihnen, unseren Datenschutztext über Cookies genau durchzulesen und die Datenschutzerklärung oder die Cookie-Richtlinien des jeweiligen Dienstanbieters anzusehen.</p>
                  <p>Instagram bzw. Facebook verarbeitet Daten u.a. auch in den USA. Wir weisen darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Dies kann mit verschiedenen Risiken für die Rechtmäßigkeit und Sicherheit der Datenverarbeitung einhergehen.</p>
                  <p>Als Grundlage der Datenverarbeitung bei Empfängern mit Sitz in Drittstaaten (außerhalb der Europäischen Union, Island, Liechtenstein, Norwegen, also insbesondere in den USA) oder einer Datenweitergabe dorthin verwendet Facebook von der EU-Kommission genehmigte Standardvertragsklauseln (= Art. 46. Abs. 2 und 3 DSGVO). Diese Klauseln verpflichten Facebook, das EU-Datenschutzniveau bei der Verarbeitung relevanter Daten auch außerhalb der EU einzuhalten. Diese Klauseln basieren auf einem Durchführungsbeschluss der EU-Kommission. Sie finden den Beschluss sowie die Klauseln u.a. hier: <a className={styles.adsimple} href="https://germany.representation.ec.europa.eu/index_de" target="_blank" rel="follow noreferrer">https://germany.representation.ec.europa.eu/index_de</a>.</p>
                  <p>Wir haben versucht, Ihnen die wichtigsten Informationen über die Datenverarbeitung durch Instagram näherzubringen. Auf <a className={styles.adsimple} href="https://help.instagram.com/519522125107875">https://help.instagram.com/519522125107875</a>
                    <br />
                    können Sie sich noch näher mit den Datenrichtlinien von Instagram auseinandersetzen.</p>
                  <h2 id="cloud-dienste" className={styles.adsimple}>Cloud-Dienste</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Cloud-Dienste Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Wir als Websitebetreiber und Sie als Websitebesucher<br />
                          &#x1f91d; Zweck: Sicherheit und Datenspeicherung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Ihre IP-Adresse, Name oder technische Daten wie etwa Browserversion<br />
                          Mehr Details dazu finden Sie weiter unten und den einzelnen Datenschutztexten bzw. in den Datenschutzerklärungen der Anbieter<br />
                          &#x1f4c5; Speicherdauer: meisten werden die Daten solange gespeichert, bis sie zur Erfüllung der Dienstleistung nicht mehr benötigt werden<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was sind Cloud-Dienste?</h3>
                  <p>Cloud-Dienste stellen uns als Websitebetreiber Speicherplatz und Rechenleistung über das Internet zur Verfügung. Über das Internet können Daten an ein externes System übertragen, verarbeitet und gespeichert werden. Die Verwaltung dieser Daten übernimmt der entsprechende Cloud-Anbieter. Je nach Anforderung kann eine einzelne Person oder auch ein Unternehmen die Speicherplatzgröße oder Rechenleistung wählen. Zugegriffen wird auf Cloud-Speicher über eine API oder über Speicherprotokolle. API steht für Application Programming Interface und gemeint ist damit eine Programmierschnittstelle, die Software- mit Hardwarekomponenten verbindet.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir Cloud-Dienste?</h3>
                  <p>Wir nutzen Cloud-Dienste aus mehreren Gründen. Ein Cloud-Dienst bietet uns die Möglichkeit unsere Daten sicher zu speichern. Zudem haben wir von verschiedenen Orten und Geräten Zugriff auf die Daten und verfügen damit über mehr Flexibilität und erleichtern unsere Arbeitsprozesse. Ein Cloud-Speicher erspart uns auch Kosten, weil wir keine eigene Infrastruktur für Datenspeicherung und Datensicherheit errichten und verwalten müssen. Durch die zentrale Speicherung unserer Daten in der Cloud können wir auch unsere Anwendungsfelder erweitern und unsere Informationen deutlich besser verwalten.</p>
                  <p>Wir als Websitebetreiber bzw. als Unternehmen setzen Cloud-Dienste also in erster Linie für unsere eigenen Zwecke ein. Zum Beispiel nutzen wir die Dienste, um unseren Kalender zu verwalten, um Dokumente oder andere wichtige Informationen in der Cloud zu speichern. Dabei können allerdings auch personenbezogene Daten von Ihnen gespeichert werden. Dies ist beispielsweise dann der Fall, wenn Sie uns Ihre Kontaktdaten (etwa Name und E-Mail-Adresse) zu Verfügung stellen und wir unsere Kundendaten bei einem Cloud-Anbieter speichern. Folglich können Daten, die wir von Ihnen verarbeiten auch auf externen Servern abgelegt und verarbeitet werden. Wenn wir auf unserer Website bestimmte Formulare oder Inhalte von Cloud-Diensten anbieten, können auch Cookies für Webanalysen und Werbezwecke gesetzt werden. Weiters merken sich solche Cookies Ihre Einstellungen (wie z. B. die verwendete Sprache), damit Sie beim nächsten Besuch auf unserer Website Ihre gewohnte Webumgebung vorfinden.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden durch Cloud-Dienste verarbeitet?</h3>
                  <p>Viele von uns in der Cloud gespeicherten Daten haben keinen Personenbezug, einige Daten zählen jedoch, nach Definition der DSGVO, zu personenbezogenen Daten. Häufig handelt es sich um Kundendaten wie Name, Adresse, IP-Adresse oder Telefonnummer oder um technische Gerätinformationen. In der Cloud können des Weiteren auch Videos, Bilder und Audiodateien gespeichert werden. Wie die Daten genau erhoben und gespeichert werden, hängt vom jeweiligen Dienst ab. Wir versuchen nur Dienste zu nutzen, die sehr vertrauenswürdig und professionell mit den Daten umgehen. Grundsätzlich haben die Dienste, wie etwa Amazon Drive, Zugriff auf die gespeicherten Dateien, um ihren eigenen Service entsprechend anbieten zu können. Dafür benötigen die Dienste allerdings Genehmigungen wie beispielsweise das Recht Dateien wegen Sicherheitsaspekten zu kopieren. Diese Daten werden im Rahmen der Services und unter Einhaltung der geltenden Gesetze verarbeitet und verwaltet. Dazu zählt auch bei US-amerikanischen Anbietern (über die Standardvertragsklauseln) die DSGVO. Diese Cloud-Dienste arbeiten in einigen Fällen auch mit Drittanbietern zusammen, die unter Anweisung und in Übereinstimmung mit den Datenschutzrichtlinien und weiteren Sicherheitsmaßnahmen Daten verarbeiten können. Wir möchten an dieser Stelle nochmals betonen, dass sich alle bekannten Cloud-Dienste (wie Amazon Drive, Google Drive oder Microsoft Onedrive) das Recht einholen, Zugriff auf gespeicherte Inhalte zu haben, um ihr eigenes Service entsprechend anbieten und optimieren zu können.</p>
                  <h3 className={styles.adsimple}>Dauer der Datenverarbeitung</h3>
                  <p>Über die Dauer der Datenverarbeitung informieren wir Sie weiter unten, sofern wir weitere Informationen dazu haben. Im Allgemeinen speichern Cloud-Dienste Daten, bis Sie oder wir die Datenspeicherung widerrufen bzw. die Daten wieder löschen. Generell werden personenbezogene Daten nur so lange gespeichert, wie es für die Bereitstellung der Dienstleistungen unbedingt notwendig ist. Ein endgültiges Datenlöschen aus der Cloud kann allerdings einige Monate dauern. Das ist der Fall, weil die Daten meist nicht nur auf einem Server gespeichert sind, sondern auf verschiedenen Servern aufgeteilt werden.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Datenspeicherung in einer Cloud zu widerrufen. Falls Cookies verwendet werden, haben Sie auch hier ein Widerrufsrecht. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum Bespiel können Sie auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen. Wir empfehlen Ihnen auch unsere allgemeine Datenschutzerklärung über Cookies. Um zu erfahren, welche Daten von Ihnen genau gespeichert und verarbeitet werden, sollten Sie die Datenschutzerklärungen der jeweiligen Cloud-Anbieter durchlesen.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wir setzen Cloud-Dienste hauptsächlich auf Grundlage unserer berechtigten Interessen (Art. 6 Abs. 1 lit. f DSGVO) an einem guten Sicherheits- und Speichersystem ein.</p>
                  <p>Bestimmte Verarbeitungen, insbesondere der Einsatz von Cookies sowie die Nutzung von Speicherfunktionen bedürfen Ihrer Einwilligung. Wenn Sie eingewilligt haben, dass Daten von Ihnen bei Cloud-Diensten verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung (Art. 6 Abs. 1 lit. a DSGVO). Die meisten von uns verwendeten Dienste setzen Cookies in Ihrem Browser, um Daten zu speichern. Darum empfehlen wir Ihnen, unseren Datenschutztext über Cookies genau durchzulesen und die Datenschutzerklärung oder die Cookie-Richtlinien des jeweiligen Dienstanbieters anzusehen.</p>
                  <p>Informationen zu speziellen Tools erfahren Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>
                  {/* TODO: Vercel und Supabase markieren */}
                  <h2 id="audio-video-einleitung" className={styles.adsimple}>Audio &amp; Video Einleitung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Audio &amp; Video Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Optimierung unserer Serviceleistung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Kontaktdaten, Daten zum Nutzerverhalten, Informationen zu Ihrem Gerät und Ihre IP-Adresse können gespeichert werden.<br />
                          Mehr Details dazu finden Sie weiter unten in den entsprechenden Datenschutztexten.<br />
                          &#x1f4c5; Speicherdauer: Daten bleiben grundsätzlich gespeichert, solange sie für den Dienstzweck nötig sind<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was sind Audio- und Videoelemente?</h3>
                  <p>Wir haben auf unsere Website Audio- bzw. Videoelemente eingebunden, damit Sie sich direkt über unsere Website etwa Videos ansehen oder Musik/Podcasts anhören können. Die Inhalte werden von Dienstanbietern zur Verfügung gestellt. Alle Inhalte werden also auch von den entsprechenden Servern der Anbieter bezogen.</p>
                  <p>Es handelt sich dabei um eingebundene Funktionselemente von Plattformen wie etwa YouTube, Vimeo oder Spotify. Die Nutzung dieser Portale ist in der Regel kostenlos, es können aber auch kostenpflichtige Inhalte veröffentlicht werden. Mit Hilfe dieser eingebundenen Elemente könne Sie sich über unsere Website die jeweiligen Inhalte anhören oder ansehen.</p>
                  <p>Wenn Sie Audio- oder Videoelemente auf unsere Website verwenden, können auch personenbezogene Daten von Ihnen an die Dienstanbieter übermittelt, verarbeitet und gespeichert werden.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir Audio- &amp; Videoelemente auf unserer Website?</h3>
                  <p>Natürlich wollen wir Ihnen auf unserer Website das beste Angebot liefern. Und uns ist bewusst, dass Inhalte nicht mehr bloß in Text und statischem Bild vermittelt werden. Statt Ihnen einfach nur einen Link zu einem Video zu geben, bieten wir Ihnen direkt auf unserer Website Audio- und Videoformate, die unterhaltend oder informativ und im Idealfall sogar beides sind. Das erweitert unser Service und erleichtert Ihnen den Zugang zu interessanten Inhalten. Somit bieten wir neben unseren Texten und Bildern auch Video und/oder Audio-Inhalte an.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden durch Audio- &amp; Videoelemente gespeichert?</h3>
                  <p>Wenn Sie eine Seite auf unserer Website aufrufen, die beispielsweise ein eingebettetes Video hat, verbindet sich Ihr Server mit dem Server des Dienstanbieters. Dabei werden auch Daten von Ihnen an den Drittanbieter übertragen und dort gespeichert. Manche Daten werden ganz unabhängig davon, ob Sie bei dem Drittanbieter ein Konto haben oder nicht, gesammelt und gespeichert. Dazu zählen meist Ihre IP-Adresse, Browsertyp, Betriebssystem, und weitere allgemeine Informationen zu Ihrem Endgerät. Weiters werden von den meisten Anbietern auch Informationen über Ihre Webaktivität eingeholt. Dazu zählen etwa Sitzungsdauer, Absprungrate, auf welchen Button Sie geklickt haben oder über welche Website Sie den Dienst nutzen. All diese Informationen werden meist über Cookies oder Pixel-Tags (auch Web Beacon genannt) gespeichert. Pseudonymisierte Daten werden meist in Cookies in Ihrem Browser gespeichert. Welche Daten genau gespeichert und verarbeitet werden, erfahren Sie stets in der Datenschutzerklärung des jeweiligen Anbieters.</p>
                  <h3 className={styles.adsimple}>Dauer der Datenverarbeitung</h3>
                  <p>Wie lange die Daten auf den Servern der Drittanbieter genau gespeichert werden, erfahren Sie entweder weiter unten im Datenschutztext des jeweiligen Tools oder in der Datenschutzerklärung des Anbieters. Grundsätzlich werden personenbezogene Daten immer nur so lange verarbeitet, wie es für die Bereitstellung unserer Dienstleistungen oder Produkte unbedingt nötig wird. Dies gilt in der Regel auch für Drittanbieter. Meist können Sie davon ausgehen, dass gewisse Daten über mehrere Jahre auf den Servern der Drittanbieter gespeichert werden. Daten können speziell in Cookies unterschiedlich lange gespeichert werden. Manche Cookies werden bereits nach dem Verlassen der Website wieder gelöscht, anderen können über einige Jahre in Ihrem Browser gespeichert sein.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies bzw. Drittanbietern zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Zum Bespiel können Sie auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt unberührt.</p>
                  <p>Da durch die eingebundenen Audio- und Video-Funktionen auf unserer Seite meist auch Cookies verwendet werden, sollte Sie sich auch unsere allgemeine Datenschutzerklärung über Cookies durchlesen. In den Datenschutzerklärungen der jeweiligen Drittanbieter erfahren Sie genaueres über den Umgang und die Speicherung Ihrer Daten.</p>
                  <h3 className={styles.adsimple}>
                    <strong className={styles.adsimple}>Rechtsgrundlage</strong>
                  </h3>
                  <p>Wenn Sie eingewilligt haben, dass Daten von Ihnen durch eingebundene Audio- und Video-Elemente verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. a DSGVO)</strong>. Grundsätzlich werden Ihre Daten auch auf Grundlage unseres berechtigten Interesses <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. f DSGVO)</strong> an einer schnellen und guten Kommunikation mit Ihnen oder anderen Kunden und Geschäftspartnern gespeichert und verarbeitet. Wir setzen die eingebundenen Audio- und Video-Elemente gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben.</p>
                  <h2 id="youtube-datenschutzerklaerung" className={styles.adsimple}>YouTube Datenschutzerklärung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>YouTube Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Optimierung unserer Serviceleistung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa Kontaktdaten, Daten zum Nutzerverhalten, Informationen zu Ihrem Gerät und Ihre IP-Adresse können gespeichert werden.<br />
                          Mehr Details dazu finden Sie weiter unten in dieser Datenschutzerklärung.<br />
                          &#x1f4c5; Speicherdauer: Daten bleiben grundsätzlich gespeichert, solange sie für den Dienstzweck nötig sind<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was ist YouTube?</h3>
                  <p>Wir haben auf unserer Website YouTube-Videos eingebaut. So können wir Ihnen interessante Videos direkt auf unserer Seite präsentieren. YouTube ist ein Videoportal, das seit 2006 eine Tochterfirma von Google ist. Betrieben wird das Videoportal durch YouTube, LLC, 901 Cherry Ave., San Bruno, CA 94066, USA. Wenn Sie auf unserer Website eine Seite aufrufen, die ein YouTube-Video eingebettet hat, verbindet sich Ihr Browser automatisch mit den Servern von YouTube bzw. Google. Dabei werden (je nach Einstellungen) verschiedene Daten übertragen. Für die gesamte Datenverarbeitung im europäischen Raum ist Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland) verantwortlich.</p>
                  <p>Im Folgenden wollen wir Ihnen genauer erklären, welche Daten verarbeitet werden, warum wir YouTube-Videos eingebunden haben und wie Sie Ihre Daten verwalten oder löschen können.</p>
                  <p>Auf YouTube können die User kostenlos Videos ansehen, bewerten, kommentieren und selbst hochladen. Über die letzten Jahre wurde YouTube zu einem der wichtigsten Social-Media-Kanäle weltweit. Damit wir Videos auf unserer Webseite anzeigen können, stellt YouTube einen Codeausschnitt zur Verfügung, den wir auf unserer Seite eingebaut haben.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir YouTube-Videos auf unserer Website?</h3>
                  <p>YouTube ist die Videoplattform mit den meisten Besuchern und dem besten Content. Wir sind bemüht, Ihnen die bestmögliche User-Erfahrung auf unserer Webseite zu bieten. Und natürlich dürfen interessante Videos dabei nicht fehlen. Mithilfe unserer eingebetteten Videos stellen wir Ihnen neben unseren Texten und Bildern weiteren hilfreichen Content zur Verfügung. Zudem wird unsere Webseite auf der Google-Suchmaschine durch die eingebetteten Videos leichter gefunden. Auch wenn wir über Google Ads Werbeanzeigen schalten, kann Google – dank der gesammelten Daten – diese Anzeigen wirklich nur Menschen zeigen, die sich für unsere Angebote interessieren.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden von YouTube gespeichert?</h3>
                  <p>Sobald Sie eine unserer Seiten besuchen, die ein YouTube-Video eingebaut hat, setzt YouTube zumindest ein Cookie, das Ihre IP-Adresse und unsere URL speichert. Wenn Sie in Ihrem YouTube-Konto eingeloggt sind, kann YouTube Ihre Interaktionen auf unserer Webseite meist mithilfe von Cookies Ihrem Profil zuordnen. Dazu zählen Daten wie Sitzungsdauer, Absprungrate, ungefährer Standort, technische Informationen wie Browsertyp, Bildschirmauflösung oder Ihr Internetanbieter. Weitere Daten können Kontaktdaten, etwaige Bewertungen, das Teilen von Inhalten über Social Media oder das Hinzufügen zu Ihren Favoriten auf YouTube sein.</p>
                  <p>Wenn Sie nicht in einem Google-Konto oder einem Youtube-Konto angemeldet sind, speichert Google Daten mit einer eindeutigen Kennung, die mit Ihrem Gerät, Browser oder App verknüpft sind. So bleibt beispielsweise Ihre bevorzugte Spracheinstellung beibehalten. Aber viele Interaktionsdaten können nicht gespeichert werden, da weniger Cookies gesetzt werden.</p>
                  <p>In der folgenden Liste zeigen wir Cookies, die in einem Test im Browser gesetzt wurden. Wir zeigen einerseits Cookies, die ohne angemeldetes YouTube-Konto gesetzt werden. Andererseits zeigen wir Cookies, die mit angemeldetem Account gesetzt werden. Die Liste kann keinen Vollständigkeitsanspruch erheben, weil die Userdaten immer von den Interaktionen auf YouTube abhängen.</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> YSC<br />
                    <strong className={styles.adsimple}>Wert:</strong> b9-CV6ojI5Y312394688-1<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert eine eindeutige ID, um Statistiken des gesehenen Videos zu speichern.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Sitzungsende</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> PREF<br />
                    <strong className={styles.adsimple}>Wert:</strong> f1=50000000<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert ebenfalls Ihre eindeutige ID. Google bekommt über PREF Statistiken, wie Sie YouTube-Videos auf unserer Webseite verwenden.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 8 Monaten</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> GPS<br />
                    <strong className={styles.adsimple}>Wert:</strong> 1<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert Ihre eindeutige ID auf mobilen Geräten, um den GPS-Standort zu tracken.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 30 Minuten</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> VISITOR_INFO1_LIVE<br />
                    <strong className={styles.adsimple}>Wert:</strong> 95Chz8bagyU<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie versucht die Bandbreite des Users auf unseren Webseiten (mit eingebautem YouTube-Video) zu schätzen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 8 Monaten</p>
                  <p>Weitere Cookies, die gesetzt werden, wenn Sie mit Ihrem YouTube-Konto angemeldet sind:</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> APISID<br />
                    <strong className={styles.adsimple}>Wert:</strong> zILlvClZSkqGsSwI/AU1aZI6HY7312394688-<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie wird verwendet, um ein Profil über Ihre Interessen zu erstellen. Genützt werden die Daten für personalisierte Werbeanzeigen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> CONSENT<br />
                    <strong className={styles.adsimple}>Wert:</strong> YES+AT.de+20150628-20-0<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Das Cookie speichert den Status der Zustimmung eines Users zur Nutzung unterschiedlicher Services von Google. CONSENT dient auch der Sicherheit, um User zu überprüfen und Userdaten vor unbefugten Angriffen zu schützen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum: </strong>nach 19 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> HSID<br />
                    <strong className={styles.adsimple}>Wert:</strong> AcRwpgUik9Dveht0I<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie wird verwendet, um ein Profil über Ihre Interessen zu erstellen. Diese Daten helfen personalisierte Werbung anzeigen zu können.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> LOGIN_INFO<br />
                    <strong className={styles.adsimple}>Wert:</strong> AFmmF2swRQIhALl6aL…<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> In diesem Cookie werden Informationen über Ihre Login-Daten gespeichert.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> SAPISID<br />
                    <strong className={styles.adsimple}>Wert:</strong> 7oaPxoG-pZsJuuF5/AnUdDUIsJ9iJz2vdM<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie funktioniert, indem es Ihren Browser und Ihr Gerät eindeutig identifiziert. Es wird verwendet, um ein Profil über Ihre Interessen zu erstellen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> SID<br />
                    <strong className={styles.adsimple}>Wert:</strong> oQfNKjAsI312394688-<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie speichert Ihre Google-Konto-ID und Ihren letzten Anmeldezeitpunkt in digital signierter und verschlüsselter Form.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 2 Jahren</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> SIDCC<br />
                    <strong className={styles.adsimple}>Wert:</strong> AN0-TYuqub2JOcDTyL<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie speichert Informationen, wie Sie die Webseite nutzen und welche Werbung Sie vor dem Besuch auf unserer Seite möglicherweise gesehen haben.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 3 Monaten</p>
                  <h3 className={styles.adsimple}>Wie lange und wo werden die Daten gespeichert?</h3>
                  <p>Die Daten, die YouTube von Ihnen erhält und verarbeitet werden auf den Google-Servern gespeichert. Die meisten dieser Server befinden sich in Amerika. Unter <a className={styles.adsimple} href="https://www.google.com/about/datacenters/locations/?hl=de" target="_blank" rel="follow noreferrer">https://www.google.com/about/datacenters/locations/?hl=de</a> sehen Sie genau wo sich die Google-Rechenzentren befinden. Ihre Daten sind auf den Servern verteilt. So sind die Daten schneller abrufbar und vor Manipulation besser geschützt.</p>
                  <p>Die erhobenen Daten speichert Google unterschiedlich lang. Manche Daten können Sie jederzeit löschen, andere werden automatisch nach einer begrenzten Zeit gelöscht und wieder andere werden von Google über längere Zeit gespeichert. Einige Daten (wie Elemente aus „Meine Aktivität“, Fotos oder Dokumente, Produkte), die in Ihrem Google-Konto gespeichert sind, bleiben so lange gespeichert, bis Sie sie löschen. Auch wenn Sie nicht in einem Google-Konto angemeldet sind, können Sie einige Daten, die mit Ihrem Gerät, Browser oder App verknüpft sind, löschen.</p>
                  <h3 className={styles.adsimple}>Wie kann ich meine Daten löschen bzw. die Datenspeicherung verhindern?</h3>
                  <p>Grundsätzlich können Sie Daten im Google Konto manuell löschen. Mit der 2019 eingeführten automatischen Löschfunktion von Standort- und Aktivitätsdaten werden Informationen abhängig von Ihrer Entscheidung &#8211; entweder 3 oder 18 Monate gespeichert und dann gelöscht.</p>
                  <p>Unabhängig, ob Sie ein Google-Konto haben oder nicht, können Sie Ihren Browser so konfigurieren, dass Cookies von Google gelöscht bzw. deaktiviert werden. Je nachdem welchen Browser Sie verwenden, funktioniert dies auf unterschiedliche Art und Weise. Unter dem Abschnitt „Cookies“ finden Sie die entsprechenden Links zu den jeweiligen Anleitungen der bekanntesten Browser.</p>
                  <p>Falls Sie grundsätzlich keine Cookies haben wollen, können Sie Ihren Browser so einrichten, dass er Sie immer informiert, wenn ein Cookie gesetzt werden soll. So können Sie bei jedem einzelnen Cookie entscheiden, ob Sie es erlauben oder nicht.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Daten von Ihnen durch eingebundene YouTube-Elemente verarbeitet und gespeichert werden können, gilt diese Einwilligung als Rechtsgrundlage der Datenverarbeitung <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. a DSGVO)</strong>. Grundsätzlich werden Ihre Daten auch auf Grundlage unseres berechtigten Interesses <strong className={styles.adsimple}>(Art. 6 Abs. 1 lit. f DSGVO)</strong> an einer schnellen und guten Kommunikation mit Ihnen oder anderen Kunden und Geschäftspartnern gespeichert und verarbeitet. Wir setzen die eingebundenen YouTube-Elemente gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben. YouTube setzt auch Cookies in Ihrem Browser, um Daten zu speichern. Darum empfehlen wir Ihnen, unseren Datenschutztext über Cookies genau durchzulesen und die Datenschutzerklärung oder die Cookie-Richtlinien des jeweiligen Dienstanbieters anzusehen.</p>
                  <p>YouTube verarbeitet Daten u.a. auch in den USA. Wir weisen darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Dies kann mit verschiedenen Risiken für die Rechtmäßigkeit und Sicherheit der Datenverarbeitung einhergehen.</p>
                  <p>Als Grundlage der Datenverarbeitung bei Empfängern mit Sitz in Drittstaaten (außerhalb der Europäischen Union, Island, Liechtenstein, Norwegen, also insbesondere in den USA) oder einer Datenweitergabe dorthin verwendet YouTube von der EU-Kommission genehmigte Standardvertragsklauseln (= Art. 46. Abs. 2 und 3 DSGVO). Diese Klauseln verpflichten YouTube, das EU-Datenschutzniveau bei der Verarbeitung relevanter Daten auch außerhalb der EU einzuhalten. Diese Klauseln basieren auf einem Durchführungsbeschluss der EU-Kommission. Sie finden den Beschluss sowie die Klauseln u.a. hier: <a className={styles.adsimple} href="https://germany.representation.ec.europa.eu/index_de" target="_blank" rel="follow noreferrer">https://germany.representation.ec.europa.eu/index_de</a>.</p>
                  <p>Da YouTube ein Tochterunternehmen von Google ist, gibt es eine gemeinsame Datenschutzerklärung. Wenn Sie mehr über den Umgang mit Ihren Daten erfahren wollen, empfehlen wir Ihnen die Datenschutzerklärung unter <a className={styles.adsimple} href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noreferrer">https://policies.google.com/privacy?hl=de.</a>
                  </p>
                  <h2 id="youtube-abonnieren-button" className={styles.adsimple}>YouTube Abonnieren Button Datenschutzerklärung</h2>
                  <p>Wir haben auf unserer Webseite den YouTube Abonnieren Button (engl. „Subscribe-Button“) eingebaut. Sie erkennen den Button meist am klassischen YouTube-Logo. Das Logo zeigt vor rotem Hintergrund in weißer Schrift die Wörter „Abonnieren“ oder „YouTube“ und links davon das weiße „Play-Symbol“. Der Button kann aber auch in einem anderen Design dargestellt sein.</p>
                  <p>Unser YouTube-Kanal bietet Ihnen immer wieder lustige, interessante oder spannende Videos. Mit dem eingebauten „Abonnieren-Button“ können Sie unseren Kanal direkt von unserer Webseite aus abonnieren und müssen nicht eigens die YouTube-Webseite aufrufen. Wir wollen Ihnen somit den Zugang zu unserem umfassenden Content so einfach wie möglich machen. Bitte beachten Sie, dass YouTube dadurch Daten von Ihnen speichern und verarbeiten kann.</p>
                  <p>Wenn Sie auf unserer Seite einen eingebauten Abo-Button sehen, setzt YouTube &#8211; laut Google &#8211; mindestens ein Cookie. Dieses Cookie speichert Ihre IP-Adresse und unsere URL. Auch Informationen über Ihren Browser, Ihren ungefähren Standort und Ihre voreingestellte Sprache kann YouTube so erfahren. Bei unserem Test wurden folgende vier Cookies gesetzt, ohne bei YouTube angemeldet zu sein:</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> YSC<br />
                    <strong className={styles.adsimple}>Wert:</strong> b9-CV6ojI5312394688Y<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert eine eindeutige ID, um Statistiken des gesehenen Videos zu speichern.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach Sitzungsende</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> PREF<br />
                    <strong className={styles.adsimple}>Wert:</strong> f1=50000000<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert ebenfalls Ihre eindeutige ID. Google bekommt über PREF Statistiken, wie Sie YouTube-Videos auf unserer Webseite verwenden.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 8 Monate</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> GPS<br />
                    <strong className={styles.adsimple}>Wert:</strong> 1<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie registriert Ihre eindeutige ID auf mobilen Geräten, um den GPS-Standort zu tracken.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 30 Minuten</p>
                  <p>
                    <strong className={styles.adsimple}>Name:</strong> VISITOR_INFO1_LIVE<br />
                    <strong className={styles.adsimple}>Wert:</strong> 31239468895Chz8bagyU<br />
                    <strong className={styles.adsimple}>Verwendungszweck:</strong> Dieses Cookie versucht die Bandbreite des Users auf unseren Webseiten (mit eingebautem YouTube-Video) zu schätzen.<br />
                    <strong className={styles.adsimple}>Ablaufdatum:</strong> nach 8 Monaten</p>
                  <p>
                    <strong className={styles.adsimple}>Anmerkung:</strong> Diese Cookies wurden nach einem Test gesetzt und können nicht den Anspruch auf Vollständigkeit erheben.</p>
                  <p>Wenn Sie in Ihrem YouTube-Konto angemeldet sind, kann YouTube viele Ihrer Handlungen/Interaktionen auf unserer Webseite mit Hilfe von Cookies speichern und Ihrem YouTube-Konto zuordnen. YouTube bekommt dadurch zum Beispiel Informationen wie lange Sie auf unserer Seite surfen, welchen Browsertyp Sie verwenden, welche Bildschirmauflösung Sie bevorzugen oder welche Handlungen Sie ausführen.</p>
                  <p>YouTube verwendet diese Daten zum einen um die eigenen Dienstleistungen und Angebote zu verbessern, zum anderen um Analysen und Statistiken für Werbetreibende (die Google Ads verwenden) bereitzustellen.</p>
                  <h2 id="webdesign-einleitung" className={styles.adsimple}>Webdesign Einleitung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Webdesign Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Verbesserung der Nutzererfahrung<br />
                          &#x1f4d3; Verarbeitete Daten: Welche Daten verarbeitet werden, hängt stark von den verwendeten Diensten ab. Meist handelt es sich etwa um IP-Adresse, technische Daten, Spracheinstellungen,  Browserversion, Bildschirmauflösung und Name des Browsers. Mehr Details dazu finden Sie bei den jeweils eingesetzten Webdesign-Tools.<br />
                          &#x1f4c5; Speicherdauer: abhängig von den eingesetzten Tools<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was ist Webdesign?</h3>
                  <p>Wir verwenden auf unserer Website verschiedene Tools, die unserem Webdesign dienen. Bei Webdesign geht es nicht, wie oft angenommen, nur darum, dass unsere Website hübsch aussieht, sondern auch um Funktionalität und Leistung. Aber natürlich ist die passende Optik einer Website auch eines der großen Ziele professionellen Webdesigns. Webdesign ist ein Teilbereich des Mediendesigns und beschäftigt sich sowohl mit der visuellen als auch der strukturellen und funktionalen Gestaltung einer Website. Ziel ist es mit Hilfe von Webdesign Ihre Erfahrung auf unserer Website zu verbessern. Im Webdesign-Jargon spricht man in diesem Zusammenhang von User-Experience (UX) und Usability. Unter User Experience versteht man alle Eindrücke und Erlebnisse, die der Websitebesucher auf einer Website erfährt. Ein Unterpunkt der User Experience ist die Usability. Dabei geht es um die Nutzerfreundlichkeit einer Website. Wert gelegt wird hier vor allem darauf, dass Inhalte, Unterseiten oder Produkte klar strukturiert sind und Sie leicht und schnell finden, wonach Sie suchen. Um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten, verwenden wir auch sogenannte Webdesign-Tools von Drittanbietern. Unter die Kategorie „Webdesign“ fallen in dieser Datenschutzerklärung also alle Dienste, die unsere Website gestalterisch verbessern. Das können beispielsweise Schriftarten, diverse Plugins oder andere eingebundene Webdesign-Funktionen sein.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir Webdesign-Tools?</h3>
                  <p>Wie Sie Informationen auf einer Website aufnehmen, hängt sehr stark von der Struktur, der Funktionalität und der visuellen Wahrnehmung der Website ab. Daher wurde auch für uns ein gutes und professionelles Webdesign immer wichtiger. Wir arbeiten ständig an der Verbesserung unserer Website und sehen dies auch als erweiterte Dienstleistung für Sie als Websitebesucher. Weiters hat eine schöne und funktionierende Website auch wirtschaftliche Vorteile für uns. Schließlich werden Sie uns nur besuchen und unsere Angebote in Anspruch nehmen, wenn Sie sich rundum wohl fühlen.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden durch Webdesign-Tools gespeichert?</h3>
                  <p>Wenn Sie unsere Website besuchen, können Webdesign-Elemente in unseren Seiten eingebunden sein, die auch Daten verarbeiten können. Um welche Daten es sich genau handelt, hängt natürlich stark von den verwendeten Tools ab. Weiter unter sehen Sie genau, welche Tools wir für unsere Website verwenden. Wir empfehlen Ihnen für nähere Informationen über die Datenverarbeitung auch die jeweilige Datenschutzerklärung der verwendeten Tools durchzulesen. Meistens erfahren Sie dort, welche Daten verarbeitet werden, ob Cookies eingesetzt werden und wie lange die Daten aufbewahrt werden. Durch Schriftarten wie etwa Google Fonts werden beispielsweise auch Informationen wie Spracheinstellungen, IP-Adresse, Version des Browsers, Bildschirmauflösung des Browsers und Name des Browsers automatisch an die Google-Server übertragen.</p>
                  <h3 className={styles.adsimple}>Dauer der Datenverarbeitung</h3>
                  <p>Wie lange Daten verarbeitet werden, ist sehr individuell und hängt von den eingesetzten Webdesign-Elementen ab. Wenn Cookies beispielsweise zum Einsatz kommen, kann die Aufbewahrungsdauer nur eine Minute, aber auch ein paar Jahre dauern. Machen Sie sich diesbezüglich bitte schlau. Dazu empfehlen wir Ihnen einerseits unseren allgemeinen Textabschnitt über Cookies sowie die Datenschutzerklärungen der eingesetzten Tools. Dort erfahren Sie in der Regel, welche Cookies genau eingesetzt werden, und welche Informationen darin gespeichert werden. Google-Font-Dateien werden zum Beispiel ein Jahr gespeichert. Damit soll die Ladezeit einer Website verbessert werden. Grundsätzlich werden Daten immer nur so lange aufbewahrt, wie es für die Bereitstellung des Dienstes nötig ist. Bei gesetzlichen Vorschreibungen können Daten auch länger gespeichert werden.</p>
                  <h3 className={styles.adsimple}>Widerspruchsrecht</h3>
                  <p>Sie haben auch jederzeit das Recht und die Möglichkeit Ihre Einwilligung zur Verwendung von Cookies bzw. Drittanbietern zu widerrufen. Das funktioniert entweder über unser Cookie-Management-Tool oder über andere Opt-Out-Funktionen. Sie können auch die Datenerfassung durch Cookies verhindern, indem Sie in Ihrem Browser die Cookies verwalten, deaktivieren oder löschen. Unter Webdesign-Elementen (meistens bei Schriftarten) gibt es allerdings auch Daten, die nicht ganz so einfach gelöscht werden können. Das ist dann der Fall, wenn Daten direkt bei einem Seitenaufruf automatisch erhoben und an einen Drittanbieter (wie z. B. Google) übermittelt werden. Wenden Sie sich dann bitte an den Support des entsprechenden Anbieters. Im Fall von Google erreichen Sie den Support unter <a className={styles.adsimple} href="https://support.google.com/?hl=de">https://support.google.com/?hl=de</a>.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Webdesign-Tools eingesetzt werden dürfen, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt laut Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) die Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie sie bei der Erfassung durch Webdesign-Tools vorkommen kann, dar. Von unserer Seite besteht zudem ein berechtigtes Interesse, das Webdesign auf unserer Website zu verbessern. Schließlich können wir Ihnen nur dann ein schönes und professionelles Webangebot liefern. Die dafür entsprechende Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen). Wir setzen Webdesign-Tools gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben. Das wollen wir hier auf jeden Fall nochmals betonen.</p>
                  <p>Informationen zu speziellen Webdesign-Tools erhalten Sie &#8211; sofern vorhanden &#8211; in den folgenden Abschnitten.</p>
                  <h2 id="google-fonts-datenschutzerklaerung" className={styles.adsimple}>Google Fonts Datenschutzerklärung</h2>
                  <table style={{ border: "1" }}>
                    <tbody>
                      <tr>
                        <td>
                          <strong className={styles.adsimple}>Google Fonts Datenschutzerklärung Zusammenfassung</strong>
                          <br />
                          &#x1f465; Betroffene: Besucher der Website<br />
                          &#x1f91d; Zweck: Optimierung unserer Serviceleistung<br />
                          &#x1f4d3; Verarbeitete Daten: Daten wie etwa IP-Adresse und CSS- und Schrift-Anfragen<br />
                          Mehr Details dazu finden Sie weiter unten in dieser Datenschutzerklärung.<br />
                          &#x1f4c5; Speicherdauer: Font-Dateien werden bei Google ein Jahr gespeichert<br />
                          &#x2696;&#xfe0f; Rechtsgrundlagen: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</td>
                      </tr>
                    </tbody>
                  </table>
                  <h3 className={styles.adsimple}>Was sind Google Fonts?</h3>
                  <p>Auf unserer Website verwenden wir Google Fonts. Das sind die &#8220;Google-Schriften&#8221; der Firma Google Inc. Für den europäischen Raum ist das Unternehmen Google Ireland Limited (Gordon House, Barrow Street Dublin 4, Irland) für alle Google-Dienste verantwortlich.</p>
                  <p>Für die Verwendung von Google-Schriftarten müssen Sie sich nicht anmelden bzw. ein Passwort hinterlegen. Weiters werden auch keine Cookies in Ihrem Browser gespeichert. Die Dateien (CSS, Schriftarten/Fonts) werden über die Google-Domains fonts.googleapis.com und fonts.gstatic.com angefordert. Laut Google sind die Anfragen nach CSS und Schriften vollkommen getrennt von allen anderen Google-Diensten. Wenn Sie ein Google-Konto haben, brauchen Sie keine Sorge haben, dass Ihre Google-Kontodaten, während der Verwendung von Google Fonts, an Google übermittelt werden. Google erfasst die Nutzung von CSS (Cascading Style Sheets) und der verwendeten Schriftarten und speichert diese Daten sicher. Wie die Datenspeicherung genau aussieht, werden wir uns noch im Detail ansehen.</p>
                  <p>Google Fonts (früher Google Web Fonts) ist ein Verzeichnis mit über 800 Schriftarten, die <a className={styles.adsimple} href="https://de.wikipedia.org/wiki/Google_LLC?tid=312394688">Google</a> Ihren Nutzern kostenlos zu Verfügung stellen.</p>
                  <p>Viele dieser Schriftarten sind unter der SIL Open Font License veröffentlicht, während andere unter der Apache-Lizenz veröffentlicht wurden. Beides sind freie Software-Lizenzen.</p>
                  <h3 className={styles.adsimple}>Warum verwenden wir Google Fonts auf unserer Website?</h3>
                  <p>Mit Google Fonts können wir auf der eigenen Webseite Schriften nutzen, und müssen sie nicht auf unserem eigenen Server hochladen. Google Fonts ist ein wichtiger Baustein, um die Qualität unserer Webseite hoch zu halten. Alle Google-Schriften sind automatisch für das Web optimiert und dies spart Datenvolumen und ist speziell für die Verwendung bei mobilen Endgeräten ein großer Vorteil. Wenn Sie unsere Seite besuchen, sorgt die niedrige Dateigröße für eine schnelle Ladezeit. Des Weiteren sind Google Fonts sichere Web Fonts. Unterschiedliche Bildsynthese-Systeme (Rendering) in verschiedenen Browsern, Betriebssystemen und mobilen Endgeräten können zu Fehlern führen. Solche Fehler können teilweise Texte bzw. ganze Webseiten optisch verzerren. Dank des schnellen Content Delivery Network (CDN) gibt es mit Google Fonts keine plattformübergreifenden Probleme. Google Fonts unterstützt alle gängigen Browser (Google Chrome, Mozilla Firefox, Apple Safari, Opera) und funktioniert zuverlässig auf den meisten modernen mobilen Betriebssystemen, einschließlich Android 2.2+ und iOS 4.2+ (iPhone, iPad, iPod). Wir verwenden die Google Fonts also, damit wir unser gesamtes Online-Service so schön und einheitlich wie möglich darstellen können.</p>
                  <h3 className={styles.adsimple}>Welche Daten werden von Google gespeichert?</h3>
                  <p>Wenn Sie unsere Webseite besuchen, werden die Schriften über einen Google-Server nachgeladen. Durch diesen externen Aufruf werden Daten an die Google-Server übermittelt. So erkennt Google auch, dass Sie bzw. Ihre IP-Adresse unsere Webseite besucht. Die Google Fonts API wurde entwickelt, um Verwendung, Speicherung und Erfassung von Endnutzerdaten auf das zu reduzieren, was für eine ordentliche Bereitstellung von Schriften nötig ist. API steht übrigens für „Application Programming Interface“ und dient unter anderem als Datenübermittler im Softwarebereich.</p>
                  <p>Google Fonts speichert CSS- und Schrift-Anfragen sicher bei Google und ist somit geschützt. Durch die gesammelten Nutzungszahlen kann Google feststellen, wie gut die einzelnen Schriften ankommen. Die Ergebnisse veröffentlicht Google auf internen Analyseseiten, wie beispielsweise Google Analytics. Zudem verwendet Google auch Daten des eigenen Web-Crawlers, um festzustellen, welche Webseiten Google-Schriften verwenden. Diese Daten werden in der BigQuery-Datenbank von Google Fonts veröffentlicht. Unternehmer und Entwickler nützen das Google-Webservice BigQuery, um große Datenmengen untersuchen und bewegen zu können.</p>
                  <p>Zu bedenken gilt allerdings noch, dass durch jede Google Font Anfrage auch Informationen wie Spracheinstellungen, IP-Adresse, Version des Browsers, Bildschirmauflösung des Browsers und Name des Browsers automatisch an die Google-Server übertragen werden. Ob diese Daten auch gespeichert werden, ist nicht klar feststellbar bzw. wird von Google nicht eindeutig kommuniziert.</p>
                  <h3 className={styles.adsimple}>Wie lange und wo werden die Daten gespeichert?</h3>
                  <p>Anfragen für CSS-Assets speichert Google einen Tag lang auf seinen Servern, die hauptsächlich außerhalb der EU angesiedelt sind. Das ermöglicht uns, mithilfe eines Google-Stylesheets die Schriftarten zu nutzen. Ein Stylesheet ist eine Formatvorlage, über die man einfach und schnell z.B. das Design bzw. die Schriftart einer Webseite ändern kann.</p>
                  <p>Die Font-Dateien werden bei Google ein Jahr gespeichert. Google verfolgt damit das Ziel, die Ladezeit von Webseiten grundsätzlich zu verbessern. Wenn Millionen von Webseiten auf die gleichen Schriften verweisen, werden sie nach dem ersten Besuch zwischengespeichert und erscheinen sofort auf allen anderen später besuchten Webseiten wieder. Manchmal aktualisiert Google Schriftdateien, um die Dateigröße zu reduzieren, die Abdeckung von Sprache zu erhöhen und das Design zu verbessern.</p>
                  <h3 className={styles.adsimple}>Wie kann ich meine Daten löschen bzw. die Datenspeicherung verhindern?</h3>
                  <p>Jene Daten, die Google für einen Tag bzw. ein Jahr speichert können nicht einfach gelöscht werden. Die Daten werden beim Seitenaufruf automatisch an Google übermittelt. Um diese Daten vorzeitig löschen zu können, müssen Sie den Google-Support auf <a className={styles.adsimple} href="https://support.google.com/?hl=de&amp;tid=312394688">https://support.google.com/?hl=de&amp;tid=312394688</a> kontaktieren. Datenspeicherung verhindern Sie in diesem Fall nur, wenn Sie unsere Seite nicht besuchen.</p>
                  <p>Anders als andere Web-Schriften erlaubt uns Google uneingeschränkten Zugriff auf alle Schriftarten. Wir können also unlimitiert auf ein Meer an Schriftarten zugreifen und so das Optimum für unsere Webseite rausholen. Mehr zu Google Fonts und weiteren Fragen finden Sie auf <a className={styles.adsimple} href="https://developers.google.com/fonts/faq?tid=312394688">https://developers.google.com/fonts/faq?tid=312394688</a>. Dort geht zwar Google auf datenschutzrelevante Angelegenheiten ein, doch wirklich detaillierte Informationen über Datenspeicherung sind nicht enthalten. Es ist relativ schwierig, von Google wirklich präzise Informationen über gespeicherten Daten zu bekommen.</p>
                  <h3 className={styles.adsimple}>Rechtsgrundlage</h3>
                  <p>Wenn Sie eingewilligt haben, dass Google Fonts eingesetzt werden darf, ist die Rechtsgrundlage der entsprechenden Datenverarbeitung diese Einwilligung. Diese Einwilligung stellt laut<strong className={styles.adsimple}> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</strong> die Rechtsgrundlage für die Verarbeitung personenbezogener Daten, wie sie bei der Erfassung durch Google Fonts vorkommen kann, dar.</p>
                  <p>Von unserer Seite besteht zudem ein berechtigtes Interesse, Google Font zu verwenden, um unser Online-Service zu optimieren. Die dafür entsprechende Rechtsgrundlage ist <strong className={styles.adsimple}>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen)</strong>. Wir setzen Google Font gleichwohl nur ein, soweit Sie eine Einwilligung erteilt haben.</p>
                  <p>Google verarbeitet Daten von Ihnen u.a. auch in den USA. Wir weisen darauf hin, dass nach Meinung des Europäischen Gerichtshofs derzeit kein angemessenes Schutzniveau für den Datentransfer in die USA besteht. Dies kann mit verschiedenen Risiken für die Rechtmäßigkeit und Sicherheit der Datenverarbeitung einhergehen.</p>
                  <p>Als Grundlage der Datenverarbeitung bei Empfängern mit Sitz in Drittstaaten (außerhalb der Europäischen Union, Island, Liechtenstein, Norwegen, also insbesondere in den USA) oder einer Datenweitergabe dorthin verwendet Google sogenannte Standardvertragsklauseln (= Art. 46. Abs. 2 und 3 DSGVO). Standardvertragsklauseln (Standard Contractual Clauses – SCC) sind von der EU-Kommission bereitgestellte Mustervorlagen und sollen sicherstellen, dass Ihre Daten auch dann den europäischen Datenschutzstandards entsprechen, wenn diese in Drittländer (wie beispielsweise in die USA) überliefert und dort gespeichert werden. Durch diese Klauseln verpflichtet sich Google, bei der Verarbeitung Ihrer relevanten Daten, das europäische Datenschutzniveau einzuhalten, selbst wenn die Daten in den USA gespeichert, verarbeitet und verwaltet werden. Diese Klauseln basieren auf einem Durchführungsbeschluss der EU-Kommission. Sie finden den Beschluss und die entsprechenden Standardvertragsklauseln u.a. hier: <a className={styles.adsimple} href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de" target="_blank" rel="noreferrer">https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj?locale=de</a>
                  </p>
                  <p>Die Google Ads Datenverarbeitungsbedingungen (Google Ads Data Processing Terms), welche auch den Standardvertragsklauseln für Google Fonts entsprechen, finden Sie unter <a className={styles.adsimple} href="https://business.safety.google/adsprocessorterms/" target="_blank" rel="noreferrer">https://business.safety.google/adsprocessorterms/</a>.</p>
                  <p>Welche Daten grundsätzlich von Google erfasst werden und wofür diese Daten verwendet werden, können Sie auch auf <a className={styles.adsimple} href="https://policies.google.com/privacy?hl=de&amp;tid=312394688">https://www.google.com/intl/de/policies/privacy/</a> nachlesen.</p>
                  <p>Alle Texte sind urheberrechtlich geschützt.</p>
                  <p style={{ marginTop: "15px" }}>Quelle: Erstellt mit dem <a href="https://www.adsimple.de/datenschutz-generator/" title="Datenschutz Generator von AdSimple für Deutschland">Datenschutz Generator</a> von AdSimple</p>
                </div>
              </main>

              <footer>
                <Footer
                  isLoggedIn={this.context.user}
                />
              </footer>
            </div>
          </div>
        </PWPLanguageProvider>
      )
    }
  }
}

export default withRouter(withTranslation()(DSGVO))