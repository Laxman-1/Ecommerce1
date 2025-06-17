<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProductController extends Controller
{
    // This method will return all products
    public function index()
    {
        $products=Product::orderBy('created_at','DESC')->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);  
    }
/*
    public function show($id)
    {
        $product = Product::with(['sizes', 'product_images'])->find($id);
    
        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Product not found',
            ], 404);
        }
    
        return response()->json([
            'status' => 200,
            'data' => [
                'id' => $product->id,
                'title' => $product->title,
                'price' => $product->price,
                'category_id' => $product->category_id,
                'brand_id' => $product->brand_id,
                'sku' => $product->sku,
                'qty' => $product->qty,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'status' => $product->status,
                'is_featured' => $product->is_featured,
                'barcode' => $product->barcode,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
                'sizes' => $product->sizes,
                'images' => $product->product_images->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => asset('/uploads/products/small/' . $image->image)
                    ];
                }),
            ]
        ], 200);
    }
  */
  
  public function show($id)
{
    $product = Product::with(['sizes', 'product_images'])->find($id);

    if (!$product) {
        return response()->json([
            'status' => 404,
            'message' => 'Product not found',
        ], 404);
    }

    // Prepare the sizes data
    $sizes = $product->sizes->map(function ($size) {
        return [
            'id' => $size->id,
            'name' => $size->name,
            'description' => $size->description,  // If size has a description field
        ];
    });

    // Prepare the images data
    $images = $product->product_images->map(function ($image) {
        return [
            'id' => $image->id,
            'image_url' => asset('/uploads/products/small/' . $image->image),
            'large_image_url' => asset('/uploads/products/large/' . $image->image),  // You can also include the large image URL
        ];
    });

    return response()->json([
        'status' => 200,
        'data' => [
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
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'sizes' => $sizes,
            'images' => $images,
        ]
    ], 200);
}

    



    // This method will store all products
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'price' => 'required|numeric',
            'category' => 'required|integer',
            'sku' => 'required|unique:products,sku',
            'is_featured'=>'required',
            'status' => 'required',
            'sizes' => 'required|array', // Ensure sizes are passed as an array
            'sizes.*' => 'exists:sizes,id' // Validate that each size ID exists in the sizes table
        ]);
    
       

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

       // Store data in database
       $product = new Product();
       $product->title = $request->title;
       $product->price = $request->price;
       $product->compare_price = $request->compare_price;
       $product->category_id = $request->category;
       $product->brand_id = $request->brand;
       $product->sku = $request->sku;
       $product->qty = $request->qty;
       $product->description = $request->description;
       $product->short_description = $request->short_description;
       $product->status = $request->status;
       $product->is_featured = $request->is_featured;
       $product->barcode= $request->barcode;
      // $product->sizes=$request->size_id;
       $product->save();

       $product->sizes()->attach($request->sizes);

       if (!empty($request->gallery)) {
        foreach ($request->gallery as $key => $tempImageId) {
            $tempImage = TempImage::find($tempImageId);

            // Process large thumbnail
            $extArray = explode('.', $tempImage->name);
            $ext = end($extArray);
            $imageName = $product->id . '-' . time() . '.' . $ext;

            $manager = new ImageManager(new Driver());
            $img = $manager->read(public_path('uploads/temp/' . $tempImage->name));
            $img->scaleDown(1200);
            $img->save(public_path('uploads/products/large/' . $imageName));

            // Process small thumbnail (corrected method)
            $imgSmall = $manager->read(public_path('uploads/temp/' . $tempImage->name));
            $imgSmall->cover(400, 460);
            $imgSmall->save(public_path('uploads/products/small/' . $imageName));

            // Save product image record
            $productImage = new ProductImage();
            $productImage->image = $imageName;
            $productImage->product_id = $product->id;
            $productImage->save();

            // Set first image as product's main image
            if ($key == 0) {
                $product->image = $imageName;
                $product->save();
            }
        }

       }

       return response()->json([
           'status' => 200,
           'message' => 'Product has been created successfully',
       ], 200);
   }

         
    // This method will update single products
    public function update($id,Request $request)
    {

     $product=Product::find($id);
    if($product==null){
        return response()->json([
            'status' => 400,
           'message'=>'product not found'
        ], 400);
    }
    
            // Validate request
            $validator= Validator::make($request->all(), [
                'title' => 'required',
                'price' => 'required|numeric',
                'category' => 'required|integer',
                'is_featured'=>'required',
                'status' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'errors' => $validator->errors(),
                ], 400);
            }

            // update data in database
            $product->title = $request->title;
            $product->price = $request->price;
            $product->compare_price = $request->compare_price;
            $product->category_id = $request->category;
            $product->brand_id = $request->brand;
            $product->sku = $request->sku;
            $product->qty = $request->qty;
            $product->description = $request->description;
            $product->short_description = $request->short_description;
            $product->status = $request->status;
            $product->is_featured = $request->is_featured;
            $product->barcode= $request->barcode;
            $product->save();

            return response()->json([
                'status' => 200,
                'message' => 'Product has been update successfully',
            ], 200);
            }


    

  
    // This method will delete single products and their associated images and sizes
public function destroy($id)
{
    $product = Product::find($id);
    
    if ($product == null) {
        return response()->json([
            'status' => 404,
            'message' => 'Product not found',
        ], 404);
    }

    // Delete associated images from the file system and database
    $productImages = ProductImage::where('product_id', $id)->get();

    foreach ($productImages as $image) {
        // Delete both large and small images from the file system
        $largeImagePath = public_path('uploads/products/large/' . $image->image);
        $smallImagePath = public_path('uploads/products/small/' . $image->image);

        if (file_exists($largeImagePath)) {
            unlink($largeImagePath); // Delete the large image
        }

        if (file_exists($smallImagePath)) {
            unlink($smallImagePath); // Delete the small image
        }

        // Delete the image record from the database
        $image->delete();
    }

    // Detach any sizes associated with this product
    $product->sizes()->detach(); // Detach sizes if it's a many-to-many relationship

    // Delete the product itself from the database
    $product->delete();

    return response()->json([
        'status' => 200,
        'message' => 'Product  deleted successfully',
    ], 200);
}

}