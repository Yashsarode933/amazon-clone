import { Response } from 'express';
import { OrderStatus } from '@prisma/client';
import prisma from '../prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Admin
export const adminGetOrders = async (_req: AuthenticatedRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    include: {
      items: true,
      address: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return res.json({
    success: true,
    data: orders
  });
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses: OrderStatus[] = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      items: true,
      address: true
    }
  });

  return res.json({
    success: true,
    data: order,
    message: 'Order status updated'
  });
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
export const getDashboardStats = async (_req: AuthenticatedRequest, res: Response) => {
  const [
    totalProducts,
    totalOrders,
    totalUsers,
    recentOrders,
    lowStockProducts
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    }),
    prisma.product.findMany({
      where: { stock: { lt: 10 } },
      take: 10
    })
  ]);

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalAmount: true }
  });

  return res.json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
      recentOrders,
      lowStockProducts
    }
  });
};
