export type LineItem = {
    size_id?: number|string,
    color_id?: number|string,
    variant_id: number,
    making_options_ids?: number,
    height_value?: number | null,
    height_unit?: string | null,
    customizations_ids?: number[]|string[],
    dress_variant_id?: number,
    fabric_id?: number|string,
    curation_name: string | null
};
