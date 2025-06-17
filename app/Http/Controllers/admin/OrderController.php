<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::with(['user', 'orderItems.product'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 200,
                'orders' => $orders
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching orders: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching orders'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $orderId)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled'
            ]);

            $order = Order::findOrFail($orderId);

            DB::beginTransaction();
            try {
                $order->status = $request->status;
                $order->save();

                DB::commit();
                return response()->json([
                    'status' => 200,
                    'message' => 'Order status updated successfully',
                    'order' => $order
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error updating order status'
            ], 500);
        }
    }

    public function deleteOrder($orderId)
    {
        try {
            $order = Order::findOrFail($orderId);

            DB::beginTransaction();
            try {
                // Delete order items first
                OrderItem::where('order_id', $orderId)->delete();
                
                // Then delete the order
                $order->delete();

                DB::commit();
                return response()->json([
                    'status' => 200,
                    'message' => 'Order deleted successfully'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error deleting order: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error deleting order'
            ], 500);
        }
    }

    public function show($orderId)
    {
        try {
            $order = Order::with(['user', 'orderItems.product'])
                ->findOrFail($orderId);

            return response()->json([
                'status' => 200,
                'order' => $order
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching order details: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching order details'
            ], 500);
        }
    }
}
