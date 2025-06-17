<?php
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\BrandController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\admin\SizeController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\OrderController;
use App\Http\Controllers\front\ProductController as FrontproductController;
use App\Models\Order;
use Illuminate\Support\Facades\Route;



 // Route::get('categories', [CategoryController::class, 'index']);
    // Route::get('categories/{id}', [CategoryController::class, 'show']);
    // Route::put('categories/{id}', [CategoryController::class, 'update']);
    // Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
    // Route::post('categories', [CategoryController::class, 'store']);


Route::post('/admin/login', [AuthController::class, 'authenticate']);
Route::get('get-latest-products', [FrontproductController::class, 'latestProduct']);
Route::get('get-feature-products', [FrontproductController::class, 'featureProduct']);
Route::get('get-categories', [FrontproductController::class, 'getcategories']);
Route::get('get-brands', [FrontproductController::class, 'getbrands']);
Route::get('get-products', [FrontproductController::class, 'getproducts']);
Route::get('get-product/{id}', [FrontproductController::class, 'getproduct']);
Route::post('register', [AccountController::class, 'register']);
Route::post('login', [AccountController::class, 'authenticate']);



// User routes (protected by auth and user role)
Route::middleware(['auth:sanctum', 'checkUserRole'])->group(function () {
    // Order routes
    Route::post('save-order', [OrderController::class, 'saveOrder']);
    Route::get('user-orders', [OrderController::class, 'userOrders']);
    Route::post('cancel-order/{orderId}', [OrderController::class, 'cancelOrder']);
});

// Admin routes (protected by auth and admin role)
Route::middleware(['auth:sanctum', 'checkAdminRole'])->group(function () {
    // Resource routes
    Route::resource('categories', CategoryController::class);
    Route::resource('brands', BrandController::class);
    Route::resource('products', ProductController::class);
    
    // Size routes
    Route::get('sizes', [SizeController::class, 'index']);
    Route::post('sizes', [SizeController::class, 'index']);
    
    // Image routes
    Route::post('temp-images', [TempImageController::class, 'store']);
    
    // Admin Order Routes
    Route::get('admin/orders', [AdminOrderController::class, 'index']);
    Route::get('admin/orders/{orderId}', [AdminOrderController::class, 'show']);
    Route::post('admin/orders/{orderId}/status', [AdminOrderController::class, 'updateStatus']);
    Route::delete('admin/orders/{orderId}', [AdminOrderController::class, 'deleteOrder']);
});

