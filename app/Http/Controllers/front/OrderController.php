<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
public function saveOrder(Request $request){
   

    if(!empty($request->cart)){
 //save order in database
        $order=new Order();
        $order->name=$request->name;
        $order->email=$request->email;
        $order->address=$request->address;
        $order->mobile=$request->mobile;
        $order->state=$request->state;
        $order->zip=$request->zip;
        $order->city=$request->city;
        $order->shipping=$request->shipping;
        $order->grandtotal=$request->grandtotal;
        $order->subtotal=$request->subtotal;
        $order->payment_status=$request->payment_status;
        $order->discount=$request->discount;
        $order->status='pending';
        $order->user_id=$request->user_id;
        $order->save();
    
        //save order items
        foreach($request->cart as $item){
            $orderItems=new OrderItem();
            $orderItems->order_id = $order->id; 
            $orderItems->price=$item['qty']*$item['price'];
            $orderItems->unit_price=$item['price'];
            $orderItems->qty=$item['qty'];
            // Extract the numeric product ID from the string (e.g., "6-7886051" -> 6)
            $productId = is_string($item['product_id']) ? (int)explode('-', $item['product_id'])[0] : (int)$item['product_id'];
            $orderItems->product_id=$productId;
            $orderItems->size=$item['size'];
            $orderItems->name=$item['title'];
            
            $orderItems->save();
    
        } 
        return response()->json([
            'status'=>200,
            'message'=>'You have successfully placed your order.'
        ],200);
            
    }
    else{
        return response()->json([
            'status'=>400,
            'message'=>'You cart is empty.'
        ],400);
    }
}

public function userOrders(Request $request)
{
    try {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $orders = Order::with(['order_items.product'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'orders' => $orders
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Failed to fetch orders: ' . $e->getMessage()
        ], 500);
    }
}

public function cancelOrder(Request $request, $orderId)
{
    try {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'status' => 400,
                'message' => 'Only pending orders can be cancelled'
            ], 400);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Delete all order items first
            OrderItem::where('order_id', $order->id)->delete();
            
            // Delete the order
            $order->delete();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Order cancelled and removed successfully'
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            throw $e;
        }
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Failed to cancel order: ' . $e->getMessage()
        ], 500);
    }
}

public function updateOrderStatus(Request $request, $orderId)
{
    try {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Order not found'
            ], 404);
        }

        $validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        $newStatus = $request->input('status');

        if (!in_array($newStatus, $validStatuses)) {
            return response()->json([
                'status' => 400,
                'message' => 'Invalid status'
            ], 400);
        }

        $order->status = $newStatus;
        $order->save();

        return response()->json([
            'status' => 200,
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Failed to update order status: ' . $e->getMessage()
        ], 500);
    }
}

public function adminOrders(Request $request)
{
    try {
        $user = $request->user();
        if (!$user || !$user->isAdmin()) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $orders = Order::with(['order_items', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'orders' => $orders
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Failed to fetch orders: ' . $e->getMessage()
        ], 500);
    }
}

public function deleteCancelledOrder(Request $request, $orderId)
{
    try {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $order = Order::where('id', $orderId)
            ->where('user_id', $user->id)
            ->where('status', 'cancelled')
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 404,
                'message' => 'Cancelled order not found'
            ], 404);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Delete all order items first
            OrderItem::where('order_id', $order->id)->delete();
            
            // Delete the order
            $order->delete();

            // Commit the transaction
            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Order deleted successfully'
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            throw $e;
        }
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Failed to delete order: ' . $e->getMessage()
        ], 500);
    }
}

}
