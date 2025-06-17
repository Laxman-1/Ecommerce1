<?php
namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class TempImageController extends Controller
{
    // This method will store temporary images
    public function store(Request $request)
    {
        // Validate the image input
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif'
        ]);

        // If validation fails, return an error response
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ], 400);
        }

        // Store the image record in the database
        $tempImage = new TempImage();
        $tempImage->name = 'Dummy name'; // Placeholder name initially
        $tempImage->save();

        // Handle the uploaded image
        $image = $request->file('image');
        $imageName = time() . '.' . $image->extension(); // Generate a unique name based on timestamp
        $image->move(public_path('uploads/temp'), $imageName); // Move the uploaded image to the server

        // Update the image record with the real filename
        $tempImage->name = $imageName;
        $tempImage->save();

        // Ensure the thumb directory exists
        $thumbDir = public_path('uploads/temp/thumb');
        if (!is_dir($thumbDir)) {
            mkdir($thumbDir, 0755, true); // Create the directory if it doesn't exist
        }

        // Create a thumbnail of the uploaded image
        $manager = new ImageManager(Driver::class); // Use the default driver (GD or Imagick depending on availability)
        $img = $manager->read(public_path('uploads/temp/' . $imageName)); // Read the uploaded image
        $img->resize(400, 450); // Resize the image to create a thumbnail
        $img->save(public_path('uploads/temp/thumb/' . $imageName)); // Save the thumbnail

        // Return a success response with the image data
        return response()->json([
            'status' => 200,
            'message' => 'Image is uploaded successfully',
            'data' => $tempImage
        ], 200);
    }
}
