import React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import AspectRatio from '@components/base/AspectRatio';

const image3  = require('@common/assets/jpg/PreCustomizedStyles-01@3.jpg');
const image2  = require('@common/assets/jpg/PreCustomizedStyles-01@2.jpg');
const image  = require('@common/assets/jpg/PreCustomizedStyles-01.jpg');

class SearchResultAd extends React.PureComponent {
    public render() {
        return (
            <div className={'SearchResultAd'}>
             <style jsx>{`
                @import 'vars';

                .SearchResultAd {
                    text-align: center;
                    
                    p {
                        text-transform: uppercase;
                        text-align: center;

                        &:first-of-type {
                            @include text-style-body;
                            margin-bottom: $space-base;
                            margin-top: 2*$space-base;
                        }

                        &:last-of-type {
                            @include text-style-card-subtitle;
                            color: $color-black;
                        }
                    }
                }
            `}</style>

                <Link to="/custom-clothes/pre-customized-styles" className="no-underline">
                    <AspectRatio ratio={1.25}>
                        <img 
                            alt=""
                            src={image3}
                            width={352}
                            height={352}
                            sizes="25vw"
                            srcSet={`${image3} 1056w, ${image2} 704w, ${image} 352w`}    
                        />        
                    </AspectRatio>        
                    <p><FormattedMessage id={'SearchPage.Ad.Title'} defaultMessage={`Can't find what you are looking for?`} /></p>
                    <p><FormattedMessage id={'SearchPage.Ad.Body'} defaultMessage={`Shop pre-customized styles`} /></p>
                </Link>
            </div>
        );
    }
}

export default SearchResultAd;
