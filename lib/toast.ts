import toast from 'react-hot-toast';

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
      iconTheme: { primary: '#FF6B35', secondary: '#fff' },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
      iconTheme: { primary: '#ef4444', secondary: '#fff' },
    }),

  loading: (message: string) =>
    toast.loading(message, {
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
    }),

  addedToCart: (itemName: string) =>
    toast.success(`${itemName} added to cart!`, {
      icon: '🍢',
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
      iconTheme: { primary: '#FF6B35', secondary: '#fff' },
    }),

  removedFromCart: (itemName: string) =>
    toast(`${itemName} removed`, {
      icon: '🗑️',
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
    }),

  orderPlaced: (orderId: string) =>
    toast.success(`Order ${orderId} placed successfully! 🎉`, {
      duration: 5000,
      style: { background: '#1A1A1A', color: '#fff', borderRadius: '12px' },
      iconTheme: { primary: '#22c55e', secondary: '#fff' },
    }),
};
