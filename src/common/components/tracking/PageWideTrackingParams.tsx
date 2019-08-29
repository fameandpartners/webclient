import React from 'react';
import qs from 'query-string';
import FameAPI from '@common/services/fameApi';
import { SiteVersion } from '@common/constants';
import { RootState } from '@common/rematch';
import { connect } from 'react-redux';
import { GTMMeta } from '@common/analytics/datalayer';
import { UserRootState } from '@common/rematch/models/user';
import { trackOrderInProgress } from '@common/analytics/analytics';
import { Order } from '@typings';

const EXCLUDED_LEXICONS = ['password='];

class PageWideTrackingParams extends React.Component<{ siteVersion: SiteVersion; user: UserRootState; cart: Order | null }> {
  public componentDidMount() {
    const { user, siteVersion } = this.props;

    const queryString = qs.parseUrl(window.location.href);

    const data = {
      ...((queryString && queryString.query) || {}),
      referrer: document.referrer
    };
    if (queryString && queryString.query && !EXCLUDED_LEXICONS.some((x) => window.location.href.includes(x))) {
      const fameApi = new FameAPI(siteVersion);
      fameApi.trackAndApplyCampaign(data);
    }

    const gtmMeta: GTMMeta = {
      user: {
        id: user && user.id,
        firstName: user && user.firstName,
        lastName: user && user.lastName,
        name: user && `${user.firstName} ${user.lastName}`,
        loggedIn: !!user,
        email: user && user.email
      },
      site: {
        version: siteVersion === SiteVersion.US ? 'us' : 'au'
      }
    };
    window.dataLayer.push(gtmMeta);

    this.trackOrderInProgress();
  }

  private trackOrderInProgress() {
    if (this.props.cart && this.props.cart.itemsTotal > 0) {
      // The user has come from a bronto email as we have a tracking id.
      console.log('--> track order in progress');
      trackOrderInProgress(this.props.cart, this.props.siteVersion, this.props.user);
    }
  }

  public render() {
    return null;
  }
}

const mapStateToProps = (state: RootState) => ({
  siteVersion: state.SiteVersion,
  user: state.UserModel,
  cart: state.CartModel.cart
});

export default connect(mapStateToProps)(PageWideTrackingParams);
