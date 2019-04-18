import React from 'react';
import { UserRootState } from '@common/rematch/models/user';
import { RootState } from '@common/rematch';
import { connect } from 'react-redux';

export const UserContext = React.createContext((null as UserRootState));

interface Props {
    user: UserRootState;
}

class UserProvider extends React.Component<Props> {
    public render() {
        return <UserContext.Provider value={this.props.user}>{this.props.children}</UserContext.Provider>;
    }
}

const mapStateToProps = (state: RootState) => ({
    user: state.UserModel,
});

export default connect(mapStateToProps)(UserProvider);