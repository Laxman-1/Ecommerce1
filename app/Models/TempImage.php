<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TempImage extends Model
{
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        if ($this->name == "") {
            return "";  // If no image, return an empty string
        }
        return asset('/uploads/temp/thumb/' . $this->name);  // Corrected asset URL
    }
}
