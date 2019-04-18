import { connect } from 'react-redux';
import GuestReturn from './GuestReturn';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    orders: state.OrdersModel.orders,
    error: state.OrdersModel.error,
});

const mapDispatchToProps = (dispatch: any) => ({
    getGuestOrder: (dispatch as RootDispatch).OrdersModel.getGuestOrder,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GuestReturn));
