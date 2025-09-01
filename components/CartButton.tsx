"use client";
import { useCart, selectCount } from "@/store/cart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function CartButton() {
  const items = useCart((s) => s.items);
  const count = selectCount(items);

  return (
    <button
      aria-haspopup="dialog"
      aria-controls="cart-drawer"
      onClick={() => (document.getElementById("cart-drawer") as HTMLDialogElement | null)?.showModal()}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-sky-500 px-4 py-2 text-sm font-medium text-white shadow hover:opacity-95"
    >
      <FontAwesomeIcon icon={faCartShopping} className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Open cart</span>
      Bag
      {count ? (
        <span className="ml-1 inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 text-[11px] font-semibold text-rose-600">
          {count}
        </span>
      ) : null}
    </button>
  );
}



