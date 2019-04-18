import { connect } from 'react-redux';
import Logout from './Logout';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
});

const mapDispatchToProps = (dispatch: any) => ({
    logout: (dispatch as RootDispatch).UserModel.logout,
    clear: (dispatch as RootDispatch).CartModel.clear,
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
