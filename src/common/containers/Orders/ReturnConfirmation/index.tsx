import { connect } from 'react-redux';
import ReturnConfirmation from './ReturnConfirmation';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    orders: state.OrdersModel.orders,
    user: state.UserModel,
});

const mapDispatchToProps = (dispatch: any) => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnConfirmation));
