import { connect } from 'react-redux';
import ForgotPassword from './ForgotPassword';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
});

const mapDispatchToProps = (dispatch: any) => ({
    resetPassword: (dispatch as RootDispatch).UserModel.resetPassword,
    sendResetPasswordEmail: (dispatch as RootDispatch).UserModel.sendResetPasswordEmail,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ForgotPassword));
