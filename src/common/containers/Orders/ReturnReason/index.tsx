import { connect } from 'react-redux';
import ReturnReason from './ReturnReason';
import { RootState, RootDispatch } from '@common/rematch';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
    orders: state.OrdersModel.orders,
    orderReturn: state.OrdersModel.orderReturn,
    user: state.UserModel,
});

const mapDispatchToProps = (dispatch: any) => ({
    submitReturnRequest: (dispatch as RootDispatch).OrdersModel.submitReturnRequest,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReturnReason));
