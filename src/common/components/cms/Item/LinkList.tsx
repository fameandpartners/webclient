import React from 'react';
import { CmsElement } from 'typings/cms';
import { WysiwygText } from '@components/cms/CmsUtils';
import BaseItem, { ItemSize, ItemTextSize, ItemTextAlign } from '@components/cms/Item/BaseItem';

interface Props extends CmsElement {
    links: Array<{
        title: string;
        url: string;
    }>;
}

const ItemLinkList: React.SFC<Props> = ({ links }: Props) => {
    return <BaseItem className="ItemLinkList" size={'Center'} mobileSize={'Center'} textAlignment={'Left'} textSize={'Medium'}>
        <style jsx>{`
            @import 'vars';

            ul {
                @include text-style-h1;
                font-size: 42px;
            }

            li {
                margin: 16px 0;
                display: block;

                a:hover,
                a:focus {
                    text-decoration: none;
                    border-bottom: 2px solid $color-black;
                }
            }
        `}</style>
        <ul>
            {links.map((x, i) => <li key={i}><a className="no-underline" href={x.url}>{x.title}</a></li>)}
        </ul>
    </BaseItem>;
};

export default ItemLinkList;