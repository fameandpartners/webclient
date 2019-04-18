import { connect } from 'react-redux';
import CmsPage from './CmsPage';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    cmsElements: state.CmsModel.elements
});

const mapDispatchToProps = (dispatch: any) => ({
    loadProduct: (dispatch as RootDispatch).ProductsModel.loadProductAsync,
    dispatch,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CmsPage));
