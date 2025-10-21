import React from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    image?: string;
}

interface CartPanelProps {
    cart: CartItem[];
    setQty: (id: number, qty: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
    cart,
    setQty,
    removeFromCart,
    clearCart,
}) => {
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="w-80 bg-white shadow-xl rounded-lg p-4 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

            {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-2">
                            <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm text-gray-500">
                                    ₱{item.price.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span className="w-6 text-center">{item.qty}</span>
                                <button
                                    onClick={() => setQty(item.id, item.qty + 1)}
                                    className="p-2 bg-gray-200 hover:bg-gray-300 rounded"
                                >
                                    <FaPlus size={12} />
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between font-semibold text-lg mt-2">
                        <span>Total:</span>
                        <span>₱{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={clearCart}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                        >
                            Clear Cart
                        </button>

                        <Link
                            to="/checkout"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPanel;