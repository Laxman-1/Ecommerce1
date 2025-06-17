<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
   protected $appends = ['image_url'];

   public function getImageUrlAttribute()
   {
       if ($this->image == "") {
           return "";  // If no image, return an empty string
       }
       return asset('/uploads/products/small/' . $this->image);  // Corrected asset URL
   }
   public function sizes()
   {
       return $this->belongsToMany(Size::class, 'product_sizes', 'product_id', 'size_id')
           ->withTimestamps();
   }
   


   public function product_images()
{
    return $this->hasMany(ProductImage::class, 'product_id');
}

public function product_sizes()
{
    return $this->hasMany(ProductSize::class, 'product_id');
}

}
