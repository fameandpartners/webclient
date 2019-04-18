import PageContainer from '@components/cms/PageContainer';
import { logHandledError } from '@common/utils/error-reporting';
import UndefinedElement from '@components/cms/UndefinedElement';
import CmsDataLoadingContext, { resolveProductSummary, resolveProductSummaries, resolveProducts } from '@containers/CmsPage/DataLoader';
import SimpleHeader from '@components/cms/Header/SimpleHeader';
import SectionGrid from '@components/cms/Section/SectionGrid';
import Teaser from '@components/cms/Item/Teaser';
import FabricSwatchSection from '@components/cms/Section/FabricSwatchSection';
import EmailCaptureItem from '@components/cms/Item/EmailCaptureItem';
import ItemText from '@components/cms/Item/Text';
import TextSection from '@components/cms/Section/TextSection';
import ProductSection from '@components/cms/Section/ProductSection';
import ItemProduct from '@components/cms/Item/Product';
import ItemLinkList from '@components/cms/Item/LinkList';
import EmailCaptureCms from '@components/cms/EmailCaptureCms';
import Video from '@components/cms/Video';
import EmailCapturePopupCms from '@components/cms/EmailCapturePopupCms';
import ItemMedia from './Item/Media';

interface CmsMapping {
  component: React.ReactType;
  loader?: (props: any, dataLoadingContext: CmsDataLoadingContext) => void; 
}

const mapping: {[key: string]: CmsMapping} = {
  page: { component: PageContainer },
  simpleHeader: { component: SimpleHeader },
  sectionGrid: { component: SectionGrid },
  itemTeaser: { component: Teaser },
  fabricSwatchSection: { component: FabricSwatchSection, loader: resolveProducts() },
  emailCapture: { component: EmailCaptureCms },
  itemText: { component: ItemText },
  sectionProducts: { component: ProductSection, loader: resolveProductSummaries() },
  itemProduct: { component: ItemProduct, loader: resolveProductSummary() },
  sectionText: { component: TextSection },
  itemLinkList: { component: ItemLinkList },
  itemEmailCapture: { component: EmailCaptureItem },
  video: { component: Video },
  emailCapturePopup: { component: EmailCapturePopupCms },
  itemMedia: { component: ItemMedia },
};

export function getReactComponentClassForCmsName(name: string): CmsMapping {
  if (mapping[name]) {
    return mapping[name];
  }

  return { component: UndefinedElement };
}
