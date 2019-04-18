import { connect } from 'react-redux';
import SearchPage from './SearchPage';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';
import { DocumentSearchResponse } from 'typings/fame_api/product_document';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
    showAd: false,
    searchResult: (state.SearchModel as DocumentSearchResponse),
    cmsData: (state.CmsModel),
    hasMore: state.SearchModel.hasMore,
    isLoading: state.SearchModel.isLoading
});

const mapDispatchToProps = (dispatch: any) => ({
    loadDocument: (dispatch as RootDispatch).SearchModel.loadDocumentAsync,
    downloadDocument: (dispatch as RootDispatch).SearchModel.downloadDocumentAsync,
    loadFacetDetails: (dispatch as RootDispatch).CmsModel.loadFacetDetails,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchPage));
