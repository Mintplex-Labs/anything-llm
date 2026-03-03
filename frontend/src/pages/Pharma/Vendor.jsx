import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Pharma from "@/models/pharma";
import Workspace from "@/models/workspace";
import Sidebar from "@/components/Sidebar";
import showToast from "@/utils/toast";

export default function PharmaVendorPage() {
  const { slug } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const [ws, productList, orderList] = await Promise.all([
        Workspace.bySlug(slug),
        Pharma.products(slug),
        Pharma.orders(slug),
      ]);
      setWorkspace(ws);
      setProducts(productList);
      setOrders(orderList);
    }
    loadData();
  }, [slug]);

  const updateCartQuantity = (productId, quantity) => {
    setCart((prev) => ({
      ...prev,
      [productId]: Math.max(0, Number(quantity) || 0),
    }));
  };

  const totalAmount = products.reduce((sum, p) => {
    const qty = cart[p.id] || 0;
    return sum + qty * p.unitPrice;
  }, 0);

  const handleSubmitOrder = async () => {
    const items = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        productId: Number(productId),
        quantity: Number(quantity),
      }));

    if (items.length === 0) {
      showToast("Please select at least one product quantity.", "error");
      return;
    }

    setSubmitting(true);
    const { success, order, error } = await Pharma.createOrder(slug, {
      items,
      shippingAddress: shippingAddress || null,
    });
    setSubmitting(false);

    if (!success) {
      showToast(error || "Failed to create order.", "error");
      return;
    }

    showToast("Order placed successfully.", "success");
    setCart({});
    setShippingAddress("");
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-6">
        <div className="flex flex-col gap-y-6 max-w-5xl mx-auto">
          <header className="border-b border-white/10 pb-4">
            <h1 className="text-xl font-bold text-theme-text-primary">
              Pharma Ordering
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1">
              Browse available pharmaceutical products and place automated orders
              to connected manufacturers.
            </p>
            {workspace && (
              <p className="text-xs text-theme-text-secondary mt-2">
                Workspace: <span className="font-semibold">{workspace.name}</span>
              </p>
            )}
          </header>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-theme-text-primary">
                Available products
              </h2>
              <span className="text-xs text-theme-text-secondary">
                Total:{" "}
                <span className="font-semibold">
                  {totalAmount.toFixed(2)} EUR
                </span>
              </span>
            </div>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-theme-bg-primary text-theme-text-secondary uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">SKU</th>
                    <th className="px-4 py-2 text-left">Price (EUR)</th>
                    <th className="px-4 py-2 text-left">Available</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-4 text-theme-text-secondary"
                        colSpan={5}
                      >
                        No pharma products configured yet for this workspace.
                      </td>
                    </tr>
                  )}
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-white/5 hover:bg-theme-bg-primary/60"
                    >
                      <td className="px-4 py-2 text-theme-text-primary">
                        {product.name}
                      </td>
                      <td className="px-4 py-2 text-theme-text-secondary">
                        {product.sku}
                      </td>
                      <td className="px-4 py-2 text-theme-text-primary">
                        {product.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-theme-text-secondary">
                        {product.availableQuantity ?? "—"}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          className="w-20 px-2 py-1 rounded bg-theme-bg-secondary text-theme-text-primary border border-white/10 text-xs"
                          value={cart[product.id] || ""}
                          onChange={(e) =>
                            updateCartQuantity(product.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-2">
              <input
                type="text"
                placeholder="Shipping address in Nigeria"
                className="flex-1 px-3 py-2 rounded bg-theme-bg-primary text-theme-text-primary border border-white/10 text-xs"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-primary-button text-xs font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-theme-text-primary">
              Recent orders
            </h2>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-full text-xs">
                <thead className="bg-theme-bg-primary text-theme-text-secondary uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Total (EUR)</th>
                    <th className="px-4 py-2 text-left">Created at</th>
                    <th className="px-4 py-2 text-left">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-4 text-theme-text-secondary"
                        colSpan={5}
                      >
                        You have not placed any orders yet.
                      </td>
                    </tr>
                  )}
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-white/5 hover:bg-theme-bg-primary/60"
                    >
                      <td className="px-4 py-2 text-theme-text-primary">
                        #{order.id}
                      </td>
                      <td className="px-4 py-2 text-theme-text-secondary">
                        {order.status}
                      </td>
                      <td className="px-4 py-2 text-theme-text-primary">
                        {order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-theme-text-secondary">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-theme-text-secondary">
                        {order.items
                          ?.map(
                            (item) => `${item.quantity} × #${item.productId}`
                          )
                          .join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

