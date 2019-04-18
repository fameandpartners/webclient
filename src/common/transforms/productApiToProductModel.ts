import { Product } from '@typings';
import { DEFAULT_GLOBAL_OPTIONS_NAME } from '@common/constants';

export default function transform(dataString: string): Product {
    const data = JSON.parse(dataString);
    const components = data.components && data.components.map((x: any) => ({
        ...x,
        incompatibleWith: Array.isArray(x.incompatibleWith) 
            ? (x.incompatibleWith as Array<{ componentId: string, incompatibilities: string[][] }>)
                .flattenToObject('componentId', { fieldAsValue: 'incompatibilities', keyIfNotExists: DEFAULT_GLOBAL_OPTIONS_NAME })
            : {},
        }),
    );
    
    return {
        ...data,
        components,
    };
}