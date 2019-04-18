import React, { PureComponent } from 'react';

interface CartEmptyProps {
    closeCartDrawer: () => void;
}

class CartEmpty extends PureComponent<CartEmptyProps> {
    public render() {
        return (
            <div className="container">
                <style jsx>{`
                    @import 'vars';

                    .container {
                        text-align: center;

                        :global(svg) {
                            margin: 0 auto;
                        }
                    }
                `}</style>
                <h3>Your Bag is Empty</h3>
                <a onClick={this.props.closeCartDrawer}>Continue Shopping</a>
            </div>
        );
    }
}

export default CartEmpty;
