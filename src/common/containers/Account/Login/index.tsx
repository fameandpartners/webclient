import { connect } from 'react-redux';
import Login from './Login';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
});

const mapDispatchToProps = (dispatch: any) => ({
    login: (dispatch as RootDispatch).UserModel.login,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
