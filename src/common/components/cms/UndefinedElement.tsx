import React from 'react';
import { CmsElement } from 'typings/cms';
import { FormattedMessage } from 'react-intl';

const UndefinedElement: React.SFC<CmsElement> = ({ type }) => {
    return <div className="UndefinedElement">
        <style jsx>{`
            @import 'vars';

            .UndefinedElement {
                background-color: $color-grey60;
                border: 1px solid $color-grey20;
                padding: 2*$space-base;
                margin: $space-base;
            }
        `}</style>

        <FormattedMessage id="Cms.UndefinedElement.Text" defaultMessage="Missing CMS template: {name}" values={{name: type}} />
    </div>;
};

export default UndefinedElement;
