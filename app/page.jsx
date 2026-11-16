import ConversionLanding from '../components/ConversionLanding';
import StructuredData from '../components/StructuredData';
import { homepageData } from '../lib/structured-data.mjs';
import { siteDescription, pageMetadata } from '../lib/site.mjs';

export const metadata = pageMetadata('Fluente por Aí | Cursos de inglês online',siteDescription,'/');

export default function Home() {
  return <><StructuredData data={homepageData}/><ConversionLanding/></>;
}
