import { Package } from 'lucide-react';

export const OrdersSection = () => {
  return (
    <div className="text-center py-12">
      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
      <p className="text-gray-500">This section will show your order history</p>
    </div>
  );
};
