import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@components/base/Button/Button';
import { Link } from 'react-router-dom';
import { BASEURL_DRESS_FINDER } from '@common/utils/url-helper';

interface Props {
    dressTitle?: string;
}

const ProductUnavailable: React.SFC<Props> = ({ dressTitle }) => {
    return <div className="ProductUnavailable">
        <style jsx>{`
                @import 'vars';

                .ProductUnavailable {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    flex-grow: 1;

                    @include mobile {
                        margin: 6*$space-base;
                    }
                }

                .ProductUnavailable__Title {
                    display: block;
                    color: $color-grey60;
                    
                    margin-bottom: 6*$space-base;
                }

                h4 {
                    margin: 0;
                }

                :global(.no-underline) {
                    &:hover, &:focus {
                        text-decoration: none;
                    }
                }
            `}</style>
            
        {dressTitle && <h4 className="ProductUnavailable__DressTitle">{dressTitle}</h4>}
        <h4 className="ProductUnavailable__Title">
            <FormattedMessage id="ProductUnavailable.Title" defaultMessage="This item is no longer available" />
        </h4>
        <Link className="no-underline" to={'/dresses'}><Button secondary><FormattedMessage id={'ProductUnavailable.ShopAll'} defaultMessage={'SHOP ALL DRESSES'} /></Button></Link>
    </div>;
};

export default ProductUnavailable;