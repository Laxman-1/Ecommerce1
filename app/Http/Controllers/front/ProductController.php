<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function getProducts(Request $request){
        $products = Product::orderBy('created_at', 'DESC')
            ->where('status', 1);
         
        // Filter products by category if category is provided
        if (!empty($request->category)) {
            $catArray = explode(',', $request->category);
            $products = $products->whereIn('category_id', $catArray);
        }

            // Filter products bybrand
            if (!empty($request->brand)) {
                $brandArray = explode(',', $request->brand);
                $products = $products->whereIn('brand_id', $brandArray);
            }  
    
        // Get the results
        $products = $products->get();
    
        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }
    
    



public function latestProduct(){
    $products=Product::orderBy('created_at','DESC')
    ->where('status',1)
    ->limit(8)
    ->get();
 
    return response()->json([
        'status'=>200,
        'data'=>$products
    ],200);

}



public function featureProduct(){
    $products=Product::orderBy('created_at','DESC')
    ->where('is_featured','yes')
    ->limit(8)
    ->get();
 
    return response()->json([
        'status'=>200,
        'data'=>$products
    ],200);

}

public function getCategories(){
    $categories=Category::orderBy('created_at','ASC')
    ->where('status','1')
    ->get();

    return response()->json([
        'status'=>200,
        'data'=>$categories
    ],200);
}


public function getbrands(){
    $brands=Brand::orderBy('created_at','ASC')
    ->where('status',1)
    ->get();
    return response()->json([
        'status'=>200,
        'data'=>$brands
    ],200);
}


/*
public function getProduct($id)
{
    $product = Product::with(['sizes:id,name', 'images:id,product_id,image'])->find($id);

    if (!$product) {
        return response()->json([
            'status' => 404,
            'message' => 'Product not found',
        ], 404);
    }

    return response()->json([
        'status' => 200,
        'product' => [
            'id' => $product->id,
            'title' => $product->title,
            'price' => $product->price,
            'compare_price' => $product->compare_price,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id,
            'sku' => $product->sku,
            'qty' => $product->qty,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'status' => $product->status,
            'is_featured' => $product->is_featured,
            'barcode' => $product->barcode,
            'image' => asset('uploads/products/large/' . $product->image),
            'sizes' => $product->sizes->pluck('name'), // Fetches the list of size names
            'gallery' => $product->images->map(function ($image) {
                return asset('uploads/products/small/' . $image->image);
            }),
        ],
    ], 200);
}
*/

public function getProduct($id)
{
    $product = Product::with(['product_images:id,product_id,image', 'product_sizes.size:id,name'])->find($id);

    if (!$product) {
        return response()->json([
            'status' => 404,
            'message' => 'Product not found',
        ], 404);
    }

    return response()->json([
        'status' => 200,
        'product' => [
            'id' => $product->id,
            'title' => $product->title,
            'price' => $product->price,
            'compare_price' => $product->compare_price,
            'category_id' => $product->category_id,
            'brand_id' => $product->brand_id,
            'sku' => $product->sku,
            'qty' => $product->qty,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'status' => $product->status,
            'is_featured' => $product->is_featured,
            'barcode' => $product->barcode,
            'image' => asset('uploads/products/large/' . $product->image),
            'sizes' => $product->product_sizes->pluck('size.name'), // Extracts size names
            'gallery' => $product->product_images->map(function ($image) {
                return asset('uploads/products/small/' . $image->image);
            }),
        ],
    ], 200);
}


}