import React from 'react';
import { Group, CustomizedProduct, OrderCustomizedProduct, OrderGroup } from 'typings';
import GroupRow from '@components/customization-overview/GroupRow';
import { SiteVersion } from '@common/constants';
import { RootState } from '@common/rematch';
import { connect } from 'react-redux';

interface Props {
  customizedProduct: CustomizedProduct | OrderCustomizedProduct;
  startCustomize: null | ((group: Group) => void);
  includeSeparators: boolean;
  canCustomize: boolean;
  condensed?: boolean;
  siteVersion: SiteVersion;
}

const CustomizationOverview: React.SFC<Props> = ({ customizedProduct, startCustomize, includeSeparators, canCustomize, condensed, siteVersion }) => {
  const { product } = customizedProduct;
  return (
    <div>
      {(product.groups as Array<Group | OrderGroup>)
        .filter((g) => !('hidden' in g && g.hidden))
        .map((group, index) => {
          return <GroupRow key={group.title} group={group} customizedProduct={customizedProduct} startCustomize={canCustomize ? startCustomize : null} includeSeparators={includeSeparators} condensed={condensed} siteVersion={siteVersion} />;
        })}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  siteVersion: state.SiteVersion
});

export default connect(mapStateToProps)(CustomizationOverview);
