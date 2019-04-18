import { connect } from 'react-redux';
import Signup from './Signup';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
});

const mapDispatchToProps = (dispatch: any) => ({
    signup: (dispatch as RootDispatch).UserModel.signup,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
