import { ComponentType } from '@common/utils/component-type';
import { SelectionType } from '@common/utils/selection-type';
import { HeightUnitType, SizeUnitType } from '@common/constants';
import { ZoomType } from '@common/utils/zoom-type';
import { OrientationType } from '@common/utils/orientation-type';
import { PreviewType } from '@common/utils/preview-type';
import { RenderPositionId } from '@common/utils/render-position-id';

export interface ProductMeta {
    name: string;
    description: string;
    styleDescription: string;
    keywords: string;
    permaLink: string;
}

export interface FallbackMedia {
    url: string;
    urlWebp?: string;
    fallbackUrl?: string;
    fallbackUrlWebp?: string;
    width: number;
    height: number;
}

export interface ProductMedia {
    pid?: string;
    fitDescription?: string;
    sizeDescription?: string;
    type: 'photo' | 'video' | 'render';
    src: Array<FallbackMedia>;
    sortOrder: number;
    options: string[];
}

export interface SectionComponent {
    section: Section;
    components: Component[];
}

export interface Component {
    cartId: number;
    code: string;
    title: string;
    componentTypeId: string;
    componentTypeCategory: ComponentType;
    price: number;
    strikeThroughPrice?: number;
    isProductCode: boolean;
    isRecommended?: boolean;
    sortOrder: number;

    meta: {
        hex?: string;

        image?: FallbackMedia;

        colorId?: number;
        colorCode?: string;

        colorTitle?: string;
        materialTitle? : string;

        careDescription?: string;
        fabricDescription?: string;
        deliveryTimeDescription?: string;
        deliveryTimeRange?: string;
        returnDescription?: string;

        sizeUs?: string;
        sizeAu?: string;
    }

    incompatibleWith: {
        [key: string]: string[][];
    };

    optionRenderComponents?: string[];
    renderPositionId?: RenderPositionId;
}

export interface Section {
    title: string,
    componentTypeId: string;
    componentTypeCategory: ComponentType;
    selectionType: SelectionType;
    options: SectionOption[];
}

export interface SectionGroup {
    title: string;
    aggregateTitle?: string;
    slug: string;
    previewType: PreviewType;
    renderPositionId: RenderPositionId;
    sections: Section[];
}

export interface Group {
    id: number;
    title: string;
    selectionTitle: string;
    slug: string;
    sortOrder: number;
    sectionGroups: SectionGroup[];
    changeButtonText: string;
    hidden: boolean;
}

export interface Size {
    minHeightCm: number;
    maxHeightCm: number;
    minHeightInch: number;
    maxHeightInch: number;
    sizeChart: string;
}

export interface LayerCAD {
    url: string;
    width: number;
    height: number;
    sortOrder: number;
    type: 'base' | 'layer';
    components: string[];
    src?: Array<FallbackMedia>;
}

export interface SectionOption {
    code: string;
    isDefault: boolean;
    parentOptionId: string;
}

export interface LayerCADActive extends LayerCAD {
    isActive: boolean;
}

export interface RenderPosition {
    renderPositionId: RenderPositionId;
    orientation: OrientationType;
    zoom: ZoomType;
}

export interface ProductListSummary {
    pid: string;
    name: string;
    description: string;
    url: string;
    price: number;
    strikeThroughPrice?: number; // TODO: PC
    media?: ProductMedia[];
    primarySilhouetteId: string;
    overlayText: string;
    taxonString?: string;
}

export type ProductListSummaries = { [pid: string]: ProductListSummary | null };

export interface Product {
    productId: string;
    urlProductId: string | null;
    productType: 'dress' | 'swatch' | 'cad';
    productVersionId: number;
    cartId: number;
    returnDescription: string | null;
    deliveryTimeDescription: string | null;
    previewType: PreviewType;

    curationMeta: ProductMeta;
    isAvailable: boolean;
    price: number;
    strikeThroughPrice?: number;

    paymentMethods: {
      afterPay: boolean
    }

    siteVersionInfo: {
      is_au: boolean,
      is_us: boolean
    }

    size: Size;

    media: ProductMedia[];

    productRenderComponents: string[];

    renderPositions: RenderPosition[];

    components: Component[];

    groups: Group[];

    layerCads: LayerCAD[];
}


export interface CustomizedProduct {
    product: Product;
    components: Component[];
    height: number | null;
    heightUnit: HeightUnitType;
    sizeUnit: SizeUnitType;
}
