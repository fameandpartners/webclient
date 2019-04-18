import { connect } from 'react-redux';
import Profile from './Profile';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
    siteVersion: state.SiteVersion,
});

const mapDispatchToProps = (dispatch: any) => ({
    updateProfile: dispatch.UserModel.updateProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
