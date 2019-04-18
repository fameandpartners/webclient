export enum OrderPaymentState {
    BalanceDue = 'balance_due',
    CreditOwed = 'credit_owed',
    Failed = 'failed',
    Paid = 'paid',
    Void = 'void',
}

export enum ShipmentState {
    BackOrder = 'backorder',
    Cancelled = 'canceled',
    Partial = 'partial',
    Pending = 'pending',
    Ready = 'ready',
    Shipped = 'shipped',
}

export enum FabricationState {
    POPlaced = 'purchase_order_placed',
    POAssigned = 'purchase_order_confirmed',
    FabricAssigned = 'fabric_assigned',
    StyleCutting = 'style_cut',
    Making = 'make',
    QC = 'qc',
    Shipped = 'shipped',
    CustomerFeedback = 'customer_feedback_required',
    Processing = 'processing',
    New = 'new',
}

// acceptance_status
export enum ReturnsState {
    Requested = 'requested',
    Received = 'received',
    InNegotiation = 'in_neogtiation',
    InDispute = 'in_dispute',
    Rejected = 'rejected',
    Approved = 'approved',
    Refunded = 'refunded',
    StoreCredit = 'credit_note_issued',
    Unknown = 'unknown'
}

export enum OrderState {
    // [0] :cart,
    // [1] :address,
    // [2] :payment,
    // [3] :confirm,
    // [4] :complete,
    // [5] :canceled,
    // [6] :awaiting_return,
    // [7] :returned,
    // [8] :resumed,
    // [9] :delivery
    Cart = 'cart',
    Address = 'address',
    payment = 'payment',
    Confirm = 'confirm',
    Complete = 'complete',
    Cancelled = 'canceled',
    AwaitingReturn = 'awaiting_return',
    Returned = 'returned',
    Resumed = 'resumed',
    Delivery = 'delivery',
}
