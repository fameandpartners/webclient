import { SpreeOrder } from "./order";
import { SpreeUser } from "./user";

export type SpreeGetCartResponse = {
    cart?: SpreeOrder,
    user?: SpreeUser,
}