import { connect } from 'react-redux';
import EmailCapturePopup from './EmailCapturePopup';
import { RootState } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
    cmsPageConfig: state.CmsModel.elements.find((x) => x.slug === 'global-page'),
});

export default withRouter(connect(mapStateToProps)(EmailCapturePopup));
